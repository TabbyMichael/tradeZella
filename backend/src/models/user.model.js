import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create({ email, password, googleId, name }) {
    const client = await pool.connect();
    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      const result = await client.query(
        'INSERT INTO users (email, password, googleId, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, hashedPassword, googleId, name]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateResetToken(id, token, expires) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE users SET passwordResetToken = $1, passwordResetExpires = $2 WHERE id = $3 RETURNING *',
        [token, expires, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByResetToken(token) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE passwordResetToken = $1', [token]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updatePassword(id, password) {
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query(
        'UPDATE users SET password = $1, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = $2 RETURNING *',
        [hashedPassword, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateStats(userId, stats) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(stats).forEach(key => {
        if (stats[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(stats[key]);
          index++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(userId);
      const result = await client.query(
        `UPDATE users
         SET ${fields.join(', ')}
         WHERE id = $${index}
         RETURNING *`,
        values
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async incrementPostCount(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE users SET post_count = post_count + 1 WHERE id = $1 RETURNING *',
        [userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async incrementThreadCount(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE users SET thread_count = thread_count + 1 WHERE id = $1 RETURNING *',
        [userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getTopUsersByReputation(limit = 10) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, avatar_url, reputation, xp FROM users ORDER BY reputation DESC, xp DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getTopUsersByXP(limit = 10) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, name, avatar_url, reputation, xp FROM users ORDER BY xp DESC, reputation DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async searchUsers(query, limit = 20) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, name, avatar_url, bio, reputation, xp
         FROM users 
         WHERE name ILIKE $1 OR bio ILIKE $1
         ORDER BY reputation DESC, xp DESC
         LIMIT $2`,
        [`%${query}%`, limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}