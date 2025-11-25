import { pool } from '../db.js';

export class CategoryModel {
  static async create({ name, slug, description, icon, display_order }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO categories (name, slug, description, icon, display_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, slug, description, icon, display_order]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM categories ORDER BY display_order ASC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findBySlug(slug) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM categories WHERE slug = $1', [slug]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM categories WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, { name, slug, description, icon, display_order }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE categories
         SET name = $1, slug = $2, description = $3, icon = $4, display_order = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [name, slug, description, icon, display_order, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}