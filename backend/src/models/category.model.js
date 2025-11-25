import { pool } from '../db.js';

export class CategoryModel {
  static async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM categories ORDER BY display_order ASC, created_at DESC'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findBySlug(slug) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM categories WHERE slug = $1',
        [slug]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async create(categoryData) {
    const client = await pool.connect();
    try {
      const { name, slug, description, icon, display_order = 0 } = categoryData;
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

  static async update(id, categoryData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(categoryData[key]);
          index++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const result = await client.query(
        `UPDATE categories
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${index}
         RETURNING *`,
        values
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}