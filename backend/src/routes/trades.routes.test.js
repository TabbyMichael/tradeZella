import request from 'supertest';
import app from '../index.js';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

describe('Trades API', () => {
  let user;
  let token;
  let client;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    client = await pool.connect();
    
    // Clear existing data (in correct order to respect foreign key constraints)
    await client.query('DELETE FROM trades');
    await client.query('DELETE FROM users');
    
    // Insert test user
    const userResult = await client.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *", 
      ['test@example.com', 'Test User', 'hashed_password']
    );
    user = userResult.rows[0];
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
    
    client.release();
  });

  afterAll(async () => {
    // Clean up the pool
    await pool.end();
  });

  describe('POST /api/trades', () => {
    it('should create a new trade for the authenticated user', async () => {
      const res = await request(app)
        .post('/api/trades')
        .set('Authorization', `Bearer ${token}`)
        .send({
          symbol: 'AAPL',
          direction: 'buy',
          size: 10,
          entryPrice: 150.0
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.symbol).toBe('AAPL');
      expect(res.body.data.userid).toBe(user.id); // PostgreSQL returns snake_case
    });

    it('should return 401 for unauthenticated request', async () => {
        const res = await request(app)
          .post('/api/trades')
          .send({
            symbol: 'AAPL',
            direction: 'buy',
            size: 10,
            entryPrice: 150.0
          });
        expect(res.statusCode).toEqual(401);
    });

    it('should return 422 for invalid trade data', async () => {
        const res = await request(app)
          .post('/api/trades')
          .set('Authorization', `Bearer ${token}`)
          .send({
            symbol: 'AAPL',
            direction: 'invalid-direction', // Invalid
            size: -10, // Invalid
            entryPrice: 150.0
          });
        expect(res.statusCode).toEqual(422);
    });
  });

  describe('GET /api/trades', () => {
    it('should get all trades for the user', async () => {
      const dbClient = await pool.connect();
      try {
        await dbClient.query("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5)", [user.id, 'GOOG', 'buy', 5, 2800]);
      } finally {
        dbClient.release();
      }

      const res = await request(app)
          .get('/api/trades')
          .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].symbol).toBe('GOOG');
    });
  });

  describe('PUT /api/trades/:id', () => {
    it('should update a trade', async () => {
      let tradeId;
      const dbClient = await pool.connect();
      try {
        const tradeResult = await dbClient.query("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user.id, 'GOOG', 'buy', 5, 2800]);
        tradeId = tradeResult.rows[0].id;
      } finally {
        dbClient.release();
      }

      const res = await request(app)
          .put(`/api/trades/${tradeId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            symbol: 'GOOGL',
            direction: 'buy',
            size: 5,
            entryPrice: 2800
          });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.symbol).toBe('GOOGL');
    });

    it('should not update a trade of another user', async () => {
      let tradeId;
      const dbClient = await pool.connect();
      try {
        const otherUserResult = await dbClient.query("INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *", ['other@example.com', 'Other User']);
        const otherUserId = otherUserResult.rows[0].id;
        const tradeResult = await dbClient.query("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *", [otherUserId, 'TSLA', 'buy', 100, 200]);
        tradeId = tradeResult.rows[0].id;
      } finally {
        dbClient.release();
      }

      const res = await request(app)
          .put(`/api/trades/${tradeId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
              symbol: 'F',
              direction: 'buy',
              size: 100,
              entryPrice: 200
          });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/trades/:id', () => {
    it('should delete a trade', async () => {
      let tradeId;
      const dbClient = await pool.connect();
      try {
        const tradeResult = await dbClient.query("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user.id, 'GOOG', 'buy', 5, 2800]);
        tradeId = tradeResult.rows[0].id;
      } finally {
        dbClient.release();
      }

      const res = await request(app)
          .delete(`/api/trades/${tradeId}`)
          .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);

      // Check that the trade was deleted
      const checkClient = await pool.connect();
      try {
        const dbTradeResult = await checkClient.query('SELECT * FROM trades WHERE id = $1', [tradeId]);
        const dbTrade = dbTradeResult.rows[0];
        expect(dbTrade).toBeUndefined();
      } finally {
        checkClient.release();
      }
    });
  });
});