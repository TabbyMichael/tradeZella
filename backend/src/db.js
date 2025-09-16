import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite',
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
}
