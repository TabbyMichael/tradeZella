import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, clearTestData } from '../../test-utils/helpers.js';

describe('Auth API', () => {
  let testUser;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create a test user
    testUser = await createTestUser({
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    });
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!'
        })
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.name).toBe('Test User');
    });
    
    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(401);
      
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });
    
    it('should return 422 with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(422);
      
      // The validation middleware doesn't return a success property or message for validation errors
    });
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'NewUserPass123!',
          name: 'New User'
        })
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('newuser@example.com');
      expect(res.body.data.user.name).toBe('New User');
      expect(res.body.data).toHaveProperty('token');
    });
    
    it('should return 400 when email is already registered', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'AnotherPass123!',
          name: 'Another User'
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User already exists');
    });
  });
});