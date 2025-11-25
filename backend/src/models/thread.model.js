import { pool } from '../db.js';

export class ThreadModel {
  static async findAll(options = {}) {
    const client = await pool.connect();
    try {
      const {
        category_id,
        limit = 20,
        offset = 0,
        search,
        sort = 'last_activity_at',
        order = 'DESC'
      } = options;

      let query = `
        SELECT t.*, c.name as category_name, u.name as author_name
        FROM threads t
        JOIN categories c ON t.category_id = c.id
        JOIN users u ON t.user_id = u.id
      `;
      
      const values = [];
      let whereClause = '';
      
      if (category_id) {
        whereClause += ` AND t.category_id = $${values.length + 1}`;
        values.push(category_id);
      }
      
      if (search) {
        // Use full-text search if available, otherwise fall back to ILIKE
        whereClause += ` AND (t.search_vector @@ plainto_tsquery('english', $${values.length + 1}) OR t.title ILIKE $${values.length + 2} OR t.content ILIKE $${values.length + 3})`;
        values.push(search, `%${search}%`, `%${search}%`);
      }
      
      if (whereClause) {
        query += ' WHERE 1=1' + whereClause;
      }
      
      query += ` ORDER BY t.${sort} ${order}`;
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);
      
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT t.*, c.name as category_name, u.name as author_name
         FROM threads t
         JOIN categories c ON t.category_id = c.id
         JOIN users u ON t.user_id = u.id
         WHERE t.id = $1`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async count(options = {}) {
    const client = await pool.connect();
    try {
      const { category_id, search } = options;
      
      let query = 'SELECT COUNT(*) FROM threads t';
      const values = [];
      let whereClause = '';
      
      if (category_id) {
        whereClause += ` AND t.category_id = $${values.length + 1}`;
        values.push(category_id);
      }
      
      if (search) {
        whereClause += ` AND (t.title ILIKE $${values.length + 1} OR t.content ILIKE $${values.length + 2})`;
        values.push(`%${search}%`, `%${search}%`);
      }
      
      if (whereClause) {
        query += ' WHERE 1=1' + whereClause;
      }
      
      const result = await client.query(query, values);
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }

  static async create(threadData) {
    const client = await pool.connect();
    try {
      const { category_id, user_id, title, content } = threadData;
      const result = await client.query(
        `INSERT INTO threads (category_id, user_id, title, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [category_id, user_id, title, content]
      );
      
      // Update category last activity
      await client.query(
        'UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [category_id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, threadData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(threadData).forEach(key => {
        if (threadData[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(threadData[key]);
          index++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const result = await client.query(
        `UPDATE threads
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
        'DELETE FROM threads WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async incrementViewCount(id) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE threads SET view_count = view_count + 1 WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  }

  static async incrementReplyCount(id) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE threads SET reply_count = reply_count + 1, last_activity_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  }

  static async decrementReplyCount(id) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE threads SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  }
}