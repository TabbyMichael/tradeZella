import { getDb } from '../db.js';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create({ email, password, googleId, name }) {
    const db = await getDb();
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const result = await db.run(
      'INSERT INTO users (email, password, googleId, name) VALUES (?, ?, ?, ?)',
      email,
      hashedPassword,
      googleId,
      name
    );
    return { id: result.lastID, email, name };
  }

  static async findByEmail(email) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE email = ?', email);
  }

  static async findById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE id = ?', id);
  }

  static async updateResetToken(id, token, expires) {
    const db = await getDb();
    return db.run('UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE id = ?', token, expires, id);
  }

  static async findByResetToken(token) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE passwordResetToken = ?', token);
  }

  static async updatePassword(id, password) {
    const db = await getDb();
    return db.run('UPDATE users SET password = ? WHERE id = ?', password, id);
  }
}
