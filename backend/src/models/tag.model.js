import { pool } from '../db.js';

export class TagModel {
  static async findAll() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tags ORDER BY usage_count DESC, name ASC'
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
        'SELECT * FROM tags WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByName(name) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tags WHERE name = $1',
        [name]
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
        'SELECT * FROM tags WHERE slug = $1',
        [slug]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async create(tagData) {
    const client = await pool.connect();
    try {
      const { name, slug } = tagData;
      const result = await client.query(
        `INSERT INTO tags (name, slug)
         VALUES ($1, $2)
         RETURNING *`,
        [name, slug]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, tagData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(tagData).forEach(key => {
        if (tagData[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(tagData[key]);
          index++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const result = await client.query(
        `UPDATE tags
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
        'DELETE FROM tags WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getTagsForThread(thread_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT t.* FROM tags t
         JOIN thread_tags tt ON t.id = tt.tag_id
         WHERE tt.thread_id = $1
         ORDER BY t.name ASC`,
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
      
      // Increment tag usage count
      if (result.rowCount > 0) {
        await client.query(
          'UPDATE tags SET usage_count = usage_count + 1 WHERE id = $1',
          [tag_id]
        );
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async removeTagFromThread(thread_id, tag_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM thread_tags WHERE thread_id = $1 AND tag_id = $2 RETURNING *',
        [thread_id, tag_id]
      );
      
      // Decrement tag usage count
      if (result.rowCount > 0) {
        await client.query(
          'UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = $1',
          [tag_id]
        );
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}