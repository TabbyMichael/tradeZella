import request from 'supertest';
import app from './index.js';
import db from './db.js';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // Reset the database before each test
    db.data = { users: [], trades: [] };
    await db.write();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with a duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
    });

    it('should log in a user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not log in a user with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });
  });
});
