import { pool } from '../db.js';

export class TagModel {
  static async create({ name, slug }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO tags (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET usage_count = tags.usage_count
         RETURNING *`,
        [name, slug]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tags ORDER BY usage_count DESC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findBySlug(slug) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tags WHERE slug = $1', [slug]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByThreadId(thread_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT t.*
         FROM tags t
         JOIN thread_tags tt ON t.id = tt.tag_id
         WHERE tt.thread_id = $1`,
        [thread_id]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async addTagToThread(thread_id, tag_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO thread_tags (thread_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT (thread_id, tag_id) DO NOTHING
         RETURNING *`,
        [thread_id, tag_id]
      );
      
      // Increment usage count for the tag
      await client.query(
        `UPDATE tags
         SET usage_count = usage_count + 1
         WHERE id = $1`,
        [tag_id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async removeTagFromThread(thread_id, tag_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM thread_tags
         WHERE thread_id = $1 AND tag_id = $2
         RETURNING *`,
        [thread_id, tag_id]
      );
      
      // Decrement usage count for the tag
      await client.query(
        `UPDATE tags
         SET usage_count = GREATEST(usage_count - 1, 0)
         WHERE id = $1`,
        [tag_id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}