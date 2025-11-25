import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../src/db.js';

/**
 * Generate a JWT token for testing
 */
export const generateTestToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
};

/**
 * Create a test user in the database
 */
export const createTestUser = async (userData) => {
  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : null;
  
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [userData.email, hashedPassword, userData.name, userData.role || 'user']
  );
  
  return result.rows[0];
};

/**
 * Create a test category in the database
 */
export const createTestCategory = async (categoryData) => {
  const result = await pool.query(
    'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
    [categoryData.name, categoryData.slug, categoryData.description]
  );
  
  return result.rows[0];
};

/**
 * Create a test thread in the database
 */
export const createTestThread = async (threadData) => {
  const result = await pool.query(
    'INSERT INTO threads (category_id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
    [threadData.category_id, threadData.user_id, threadData.title, threadData.content]
  );
  
  return result.rows[0];
};

/**
 * Create a test post in the database
 */
export const createTestPost = async (postData) => {
  const result = await pool.query(
    'INSERT INTO posts (thread_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
    [postData.thread_id, postData.user_id, postData.content]
  );
  
  // Update the reply count in the thread
  await pool.query(
    'UPDATE threads SET reply_count = reply_count + 1 WHERE id = $1',
    [postData.thread_id]
  );
  
  return result.rows[0];
};

/**
 * Clear test data from database tables
 */
export const clearTestData = async () => {
  // Clear in reverse order to respect foreign key constraints
  await pool.query('DELETE FROM posts');
  await pool.query('DELETE FROM threads');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM trades');
  await pool.query('DELETE FROM users');
};

/**
 * Generate random trade data
 */
export const generateTradeData = (overrides = {}) => ({
  symbol: 'AAPL',
  direction: 'LONG',
  size: Math.floor(Math.random() * 1000) + 1,
  entryPrice: parseFloat((Math.random() * 200 + 50).toFixed(2)),
  ...overrides
});

/**
 * Generate random user data
 */
export const generateUserData = (overrides = {}) => ({
  email: `test${Math.random().toString(36).substr(2, 9)}@example.com`,
  name: `Test User ${Math.floor(Math.random() * 1000)}`,
  password: 'SecurePass123!',
  ...overrides
});