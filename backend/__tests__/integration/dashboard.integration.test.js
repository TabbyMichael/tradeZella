import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Dashboard API', () => {
  let testUser;
  let authToken;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create a test user
    testUser = await createTestUser({
      email: 'dashboard@example.com',
      password: 'DashboardPass123!',
      name: 'Dashboard Tester'
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
  
  describe('GET /api/dashboard/metrics', () => {
    it('should return dashboard metrics for authenticated user', async () => {
      // First create some test trades
      const dbClient = await pool.connect();
      try {
        await dbClient.query(
          'INSERT INTO trades (userId, symbol, direction, size, entryPrice, exitPrice) VALUES ($1, $2, $3, $4, $5, $6)',
          [testUser.id, 'AAPL', 'buy', 100, 150.00, 155.00] // Winning trade
        );
        await dbClient.query(
          'INSERT INTO trades (userId, symbol, direction, size, entryPrice, exitPrice) VALUES ($1, $2, $3, $4, $5, $6)',
          [testUser.id, 'GOOGL', 'buy', 50, 2500.00, 2450.00] // Losing trade
        );
      } finally {
        dbClient.release();
      }
      
      const res = await request(app)
        .get('/api/dashboard/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('metrics');
      expect(res.body.data).toHaveProperty('recentTrades');
      
      // Check metrics structure
      const metrics = res.body.data.metrics;
      expect(metrics).toHaveProperty('totalTrades');
      expect(metrics).toHaveProperty('completedTrades');
      expect(metrics).toHaveProperty('totalProfitLoss');
      expect(metrics).toHaveProperty('winRate');
      expect(metrics).toHaveProperty('winningTrades');
      expect(metrics).toHaveProperty('losingTrades');
      expect(metrics).toHaveProperty('avgWin');
      expect(metrics).toHaveProperty('avgLoss');
      expect(metrics).toHaveProperty('profitFactor');
      expect(metrics).toHaveProperty('maxDrawdown');
      expect(metrics).toHaveProperty('sharpeRatio');
      expect(metrics).toHaveProperty('expectancy');
      expect(metrics).toHaveProperty('bestTrade');
      expect(metrics).toHaveProperty('worstTrade');
      
      // Check recent trades structure
      expect(Array.isArray(res.body.data.recentTrades)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/dashboard/metrics')
        .expect(401);
    });
  });
});