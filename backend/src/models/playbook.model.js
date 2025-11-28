import { pool } from '../db.js';

export class PlaybookModel {
  static async create(playbookData) {
    const client = await pool.connect();
    try {
      const {
        userId,
        name,
        description,
        strategy,
        rules,
        isPublic = false
      } = playbookData;

      const result = await client.query(
        `INSERT INTO playbooks (userId, name, description, strategy, rules, is_public)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, name, description, strategy, JSON.stringify(rules), isPublic]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, userId, name, description, strategy, rules, is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
         FROM playbooks
         WHERE id = $1`,
        [id]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, userId, name, description, strategy, rules, is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
         FROM playbooks
         WHERE userId = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findPublic() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, userId, name, description, strategy, rules, is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
         FROM playbooks
         WHERE is_public = true
         ORDER BY created_at DESC`
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async update(id, userId, updateData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'rules') {
            fields.push(`${key} = $${index}`);
            values.push(JSON.stringify(updateData[key]));
          } else if (key === 'isPublic') {
            fields.push(`is_public = $${index}`);
            values.push(updateData[key]);
          } else {
            fields.push(`${key} = $${index}`);
            values.push(updateData[key]);
          }
          index++;
        }
      });

      if (fields.length === 0) {
        return await this.findById(id);
      }

      values.push(id, userId);
      const result = await client.query(
        `UPDATE playbooks
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${index} AND userId = $${index + 1}
         RETURNING id, userId, name, description, strategy, rules, is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"`,
        values
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM playbooks WHERE id = $1 AND userId = $2',
        [id, userId]
      );

      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}