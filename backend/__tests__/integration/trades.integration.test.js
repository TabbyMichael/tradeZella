import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Trades API', () => {
  let testUser;
  let authToken;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create a test user
    testUser = await createTestUser({
      email: 'trader@example.com',
      password: 'TraderPass123!',
      name: 'Test Trader'
    });
    
    // Generate auth token
    authToken = generateTestToken(testUser);
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('POST /api/trades', () => {
    it('should create a new trade with valid data', async () => {
      const newTrade = {
        symbol: 'AAPL',
        direction: 'buy',
        size: 100,
        entryPrice: 150.00
      };
      
      const res = await request(app)
        .post('/api/trades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTrade)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.symbol).toBe(newTrade.symbol);
      expect(res.body.data.direction).toBe(newTrade.direction);
      expect(res.body.data.size).toBe(newTrade.size);
      expect(res.body.data.entryprice).toBe(newTrade.entryPrice); // PostgreSQL returns snake_case
      expect(res.body.data.userid).toBe(testUser.id); // PostgreSQL returns snake_case
    });

    it('should return 401 without authentication', async () => {
      const newTrade = {
        symbol: 'AAPL',
        direction: 'buy',
        size: 100,
        entryPrice: 150.00
      };
      
      await request(app)
        .post('/api/trades')
        .send(newTrade)
        .expect(401);
    });
    
    it('should return 422 with missing required fields', async () => {
      const incompleteTrade = {
        symbol: 'AAPL',
        direction: 'buy'
        // Missing size and entryPrice
      };
      
      const res = await request(app)
        .post('/api/trades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteTrade)
        .expect(422);
      
      expect(res.body.success).toBe(undefined); // Validation middleware doesn't use success property
    });
  });
  
  describe('GET /api/trades', () => {
    it('should return user trades', async () => {
      // First create a trade
      const newTrade = {
        symbol: 'GOOGL',
        direction: 'sell',
        size: 50,
        entryPrice: 2500.00,
        userId: testUser.id
      };
      
      await pool.query(
        'INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5)',
        [newTrade.userId, newTrade.symbol, newTrade.direction, newTrade.size, newTrade.entryPrice]
      );
      
      const res = await request(app)
        .get('/api/trades')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].symbol).toBe(newTrade.symbol);
      expect(res.body.data[0].entryprice).toBe(newTrade.entryPrice); // PostgreSQL returns snake_case
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/trades')
        .expect(401);
    });
  });
});