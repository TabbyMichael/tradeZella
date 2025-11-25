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
}