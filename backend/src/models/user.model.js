import { getDb } from '../db.js';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create({ email, password }) {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', email, hashedPassword);
    return { id: result.lastID, email };
  }

  static async findByEmail(email) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE email = ?', email);
  }

  static async findById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE id = ?', id);
  }
}
