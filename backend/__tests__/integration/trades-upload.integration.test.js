import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Trades API - CSV Upload', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await clearTestData();
    testUser = await createTestUser({
      email: 'csv-trader@example.com',
      password: 'CsvTraderPass123!',
      name: 'CSV Trader',
    });
    authToken = generateTestToken(testUser);
  });

  afterAll(async () => {
    await clearTestData();
    await pool.end();
  });

  it('should upload a valid CSV and create trades', async () => {
    const csvContent = `Symbol,Direction,Size,Entry Price
AAPL,buy,10,150.25
GOOG,sell,5,2800.50
TSLA,buy,20,700.00`;

    const res = await request(app)
      .post('/api/trades/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from(csvContent), 'trades.csv')
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Successfully created 3 trades.');
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].symbol).toBe('AAPL');
    expect(res.body.data[0].userid).toBe(testUser.id);

    // Verify from DB
    const { rows } = await pool.query('SELECT * FROM trades WHERE userId = $1', [testUser.id]);
    expect(rows).toHaveLength(3);
    expect(rows.find(t => t.symbol === 'AAPL').size).toBe(10);
    expect(rows.find(t => t.symbol === 'GOOG').direction).toBe('sell');
    expect(rows.find(t => t.symbol === 'TSLA').entryprice).toBe(700.00);
  });

  it('should return 400 if no file is uploaded', async () => {
    await request(app)
      .post('/api/trades/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400, {
        success: false,
        message: 'No file uploaded.',
      });
  });

  it('should return an error for a CSV with missing headers', async () => {
    const csvContent = `Symbol,Direction,Count
AAPL,buy,10`;

    const res = await request(app)
      .post('/api/trades/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from(csvContent), 'bad.csv')
      .expect(500); // The error handler will catch this

    // This depends on the error handler's format
    expect(res.body.message).toContain('Missing required CSV header: size');
  });

  it('should skip invalid rows and process valid ones', async () => {
    const csvContent = `Symbol,Direction,Size,Entry Price
MSFT,buy,15,300.00
,,,, 
NVDA,sell,abc,550.00
`;

    const res = await request(app)
      .post('/api/trades/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from(csvContent), 'mixed.csv')
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Successfully created 1 trades.');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].symbol).toBe('MSFT');
  });
});
