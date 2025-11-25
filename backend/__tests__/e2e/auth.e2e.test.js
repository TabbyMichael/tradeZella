import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { clearTestData } from '../../test-utils/helpers.js';

describe('Auth E2E', () => {
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('User Registration and Login Flow', () => {
    it('should register a new user and then login successfully', async () => {
      // Register a new user
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'e2euser@example.com',
          password: 'E2EPass123!',
          name: 'E2E Test User'
        })
        .expect(201);
      
      expect(registerRes.body.success).toBe(true);
      expect(registerRes.body.data.user.email).toBe('e2euser@example.com');
      expect(registerRes.body.data.user.name).toBe('E2E Test User');
      expect(registerRes.body.data).toHaveProperty('token');
      
      // Login with the same user
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2euser@example.com',
          password: 'E2EPass123!'
        })
        .expect(200);
      
      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.data.user.email).toBe('e2euser@example.com');
      expect(loginRes.body.data.user.name).toBe('E2E Test User');
      expect(loginRes.body.data).toHaveProperty('token');
    });
  });
});