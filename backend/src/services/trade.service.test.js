import { TradeService } from './trade.service.js';
import { pool } from '../db.js';
import { UserModel } from '../models/user.model.js';

describe('TradeService', () => {
  let user;
  let client;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    client = await pool.connect();
    
    // Clear existing data
    await client.query('DELETE FROM trades');
    await client.query('DELETE FROM users');
    
    // Manually insert user
    const userResult = await client.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *", 
      ['test@example.com', 'Test User', 'hashed_password']
    );
    user = userResult.rows[0];
    
    client.release();
  });

  afterAll(async () => {
    // Clean up the pool
    await pool.end();
  });

  it('should create a new trade', async () => {
    const tradeData = {
      userId: user.id,
      symbol: 'AAPL',
      direction: 'buy',
      size: 10,
      entryPrice: 150.0,
      notes: 'Test trade'
    };
    
    const trade = await TradeService.createTrade(tradeData);
    
    expect(trade).toHaveProperty('id');
    expect(trade.symbol).toBe('AAPL');

    // Check in database
    const dbClient = await pool.connect();
    try {
      const dbTradeResult = await dbClient.query('SELECT * FROM trades WHERE id = $1', [trade.id]);
      const dbTrade = dbTradeResult.rows[0];
      expect(dbTrade).toBeDefined();
      expect(dbTrade.symbol).toBe('AAPL');
    } finally {
      dbClient.release();
    }
  });

  it('should get all trades for a user', async () => {
    const dbClient = await pool.connect();
    try {
      await dbClient.query('INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5)', 
        [user.id, 'AAPL', 'buy', 10, 150.0]);
      await dbClient.query('INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5)', 
        [user.id, 'GOOG', 'sell', 5, 2800.0]);
    } finally {
      dbClient.release();
    }

    const trades = await TradeService.getTradesByUserId(user.id);
    expect(trades).toHaveLength(2);
  });

  it('should get a trade by id', async () => {
    const dbClient = await pool.connect();
    try {
      const newTradeResult = await dbClient.query(
        'INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.id, 'AAPL', 'buy', 10, 150.0]
      );
      const newTrade = newTradeResult.rows[0];
      
      const foundTrade = await TradeService.getTradeById(newTrade.id, user.id);
      expect(foundTrade).toBeDefined();
      expect(foundTrade.id).toBe(newTrade.id);
    } finally {
      dbClient.release();
    }
  });

  it('should not get a trade belonging to another user', async () => {
    const dbClient = await pool.connect();
    try {
      const newTradeResult = await dbClient.query(
        'INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.id, 'AAPL', 'buy', 10, 150.0]
      );
      const newTrade = newTradeResult.rows[0];
      
      const foundTrade = await TradeService.getTradeById(newTrade.id, user.id + 1);
      expect(foundTrade).toBeUndefined();
    } finally {
      dbClient.release();
    }
  });

  it('should update a trade with partial data', async () => {
    const dbClient = await pool.connect();
    try {
      const newTradeResult = await dbClient.query(
        'INSERT INTO trades (userId, symbol, direction, size, entryPrice, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user.id, 'AAPL', 'buy', 10, 150.0, 'Original note']
      );
      const newTrade = newTradeResult.rows[0];
      
      const updatedData = { symbol: 'MSFT', notes: 'Updated note' };
      const updatedTrade = await TradeService.updateTrade(newTrade.id, user.id, updatedData);

      expect(updatedTrade).toBeDefined();
      expect(updatedTrade.symbol).toBe('MSFT');
      expect(updatedTrade.notes).toBe('Updated note');
      expect(updatedTrade.direction).toBe('buy'); // Should remain unchanged
      expect(updatedTrade.entryprice).toBe(150.0); // Should remain unchanged
      expect(updatedTrade.size).toBe(10); // Should remain unchanged
    } finally {
      dbClient.release();
    }
  });

  it('should delete a trade', async () => {
    const dbClient = await pool.connect();
    try {
      const newTradeResult = await dbClient.query(
        'INSERT INTO trades (userId, symbol, direction, size, entryPrice) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.id, 'AAPL', 'buy', 10, 150.0]
      );
      const newTrade = newTradeResult.rows[0];
      
      const success = await TradeService.deleteTrade(newTrade.id, user.id);
      expect(success).toBe(true);

      const foundTradeResult = await dbClient.query('SELECT * FROM trades WHERE id = $1', [newTrade.id]);
      const foundTrade = foundTradeResult.rows[0];
      expect(foundTrade).toBeUndefined();
    } finally {
      dbClient.release();
    }
  });
});