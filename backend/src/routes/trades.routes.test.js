import request from 'supertest';
import app from '../index.js';
import { getDb, initDb } from '../db.js';
import jwt from 'jsonwebtoken';

describe('Trades API', () => {
  let db;
  let user;
  let token;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initDb();
    db = await getDb();
  });

  beforeEach(async () => {
    await db.exec('DELETE FROM trades');
    await db.exec('DELETE FROM users');
    const userResult = await db.run("INSERT INTO users (email, name, password) VALUES (?, ?, ?)", ['test@example.com', 'Test User', 'password']);
    user = { id: userResult.lastID, email: 'test@example.com' };
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
  });

  afterAll(async () => {
    await db.close();
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
      expect(res.body).toHaveProperty('id');
      expect(res.body.symbol).toBe('AAPL');
      expect(res.body.userId).toBe(user.id);
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
        await db.run("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES (?, ?, ?, ?, ?)", [user.id, 'GOOG', 'buy', 5, 2800]);

        const res = await request(app)
            .get('/api/trades')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].symbol).toBe('GOOG');
    });
  });

  describe('PUT /api/trades/:id', () => {
    it('should update a trade', async () => {
        const tradeResult = await db.run("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES (?, ?, ?, ?, ?)", [user.id, 'GOOG', 'buy', 5, 2800]);
        const tradeId = tradeResult.lastID;

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
        expect(res.body.symbol).toBe('GOOGL');
    });

    it('should not update a trade of another user', async () => {
        const otherUserResult = await db.run("INSERT INTO users (email, name) VALUES (?, ?)", ['other@example.com', 'Other User']);
        const otherUserId = otherUserResult.lastID;
        const tradeResult = await db.run("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES (?, ?, ?, ?, ?)", [otherUserId, 'TSLA', 'buy', 100, 200]);
        const tradeId = tradeResult.lastID;

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
        const tradeResult = await db.run("INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES (?, ?, ?, ?, ?)", [user.id, 'GOOG', 'buy', 5, 2800]);
        const tradeId = tradeResult.lastID;

        const res = await request(app)
            .delete(`/api/trades/${tradeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);

        const dbTrade = await db.get('SELECT * FROM trades WHERE id = ?', tradeId);
        expect(dbTrade).toBeUndefined();
    });
  });
});
