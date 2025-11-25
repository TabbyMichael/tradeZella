import { pool } from '../db.js';

export class ThreadModel {
  static async create({ category_id, user_id, title, content }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO threads (category_id, user_id, title, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [category_id, user_id, title, content]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(filters = {}) {
    const client = await pool.connect();
    try {
      let query = `
        SELECT t.*, u.name as author_name, c.name as category_name
        FROM threads t
        JOIN users u ON t.user_id = u.id
        JOIN categories c ON t.category_id = c.id
      `;
      
      const params = [];
      const whereClauses = [];
      
      if (filters.category_id) {
        params.push(filters.category_id);
        whereClauses.push(`t.category_id = $${params.length}`);
      }
      
      if (filters.user_id) {
        params.push(filters.user_id);
        whereClauses.push(`t.user_id = $${params.length}`);
      }
      
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      query += ' ORDER BY t.created_at DESC';
      
      if (filters.limit) {
        params.push(filters.limit);
        query += ` LIMIT $${params.length}`;
      }
      
      if (filters.offset) {
        params.push(filters.offset);
        query += ` OFFSET $${params.length}`;
      }
      
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT t.*, u.name as author_name, c.name as category_name
         FROM threads t
         JOIN users u ON t.user_id = u.id
         JOIN categories c ON t.category_id = c.id
         WHERE t.id = $1`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, { title, content, is_pinned, is_locked }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE threads
         SET title = $1, content = $2, is_pinned = $3, is_locked = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [title, content, is_pinned, is_locked, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async incrementViewCount(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE threads
         SET view_count = view_count + 1, last_activity_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM threads WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}