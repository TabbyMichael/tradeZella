import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, createTestCategory, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Forum API', () => {
  let testUser;
  let adminUser;
  let authToken;
  let adminToken;
  let testCategory;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create test users
    testUser = await createTestUser({
      email: 'user@example.com',
      password: 'UserPass123!',
      name: 'Test User'
    });
    
    adminUser = await createTestUser({
      email: 'admin@example.com',
      password: 'AdminPass123!',
      name: 'Admin User',
      role: 'admin'
    });
    
    // Generate auth tokens
    authToken = generateTestToken(testUser);
    adminToken = generateTestToken(adminUser);
    
    // Create a test category
    testCategory = await createTestCategory({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('GET /api/community/categories', () => {
    it('should return all categories', async () => {
      const res = await request(app)
        .get('/api/community/categories')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // We might not have any categories in the database, so we can't assert length > 0
    });
  });
  
  describe('POST /api/community/categories', () => {
    it('should create a new category as admin', async () => {
      const newCategory = {
        name: 'New Category',
        slug: 'new-category',
        description: 'A new category'
      };
      
      const res = await request(app)
        .post('/api/community/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategory)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newCategory.name);
      expect(res.body.data.slug).toBe(newCategory.slug);
    });
    
    it('should return 403 when creating category as regular user', async () => {
      const newCategory = {
        name: 'Unauthorized Category',
        slug: 'unauthorized-category',
        description: 'Should not be created'
      };
      
      await request(app)
        .post('/api/community/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCategory)
        .expect(403);
    });
  });
  
  describe('POST /api/community/threads', () => {
    it('should create a new thread with valid data', async () => {
      const newThread = {
        category_id: testCategory.id,
        title: 'Test Thread',
        content: 'This is a test thread content'
      };
      
      const res = await request(app)
        .post('/api/community/threads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newThread)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newThread.title);
      expect(res.body.data.content).toBe(newThread.content);
      expect(res.body.data.user_id).toBe(testUser.id);
      expect(res.body.data.category_id).toBe(newThread.category_id);
    });
    
    it('should return 401 without authentication', async () => {
      const newThread = {
        category_id: testCategory.id,
        title: 'Unauthorized Thread',
        content: 'Should not be created'
      };
      
      await request(app)
        .post('/api/community/threads')
        .send(newThread)
        .expect(401);
    });
  });
  
  describe('GET /api/community/threads', () => {
    it('should return threads', async () => {
      const res = await request(app)
        .get('/api/community/threads')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});