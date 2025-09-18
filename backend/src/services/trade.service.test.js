import { TradeService } from './trade.service.js';
import { getDb, initDb } from '../db.js';
import { UserModel } from '../models/user.model.js';

describe('TradeService', () => {
  let db;
  let user;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // It's important to initialize the DB for the test environment
    await initDb();
    db = await getDb();
  });

  beforeEach(async () => {
    await db.exec('DELETE FROM trades');
    await db.exec('DELETE FROM users');
    // Manually insert user since UserModel is not fully fleshed out for testing
    const userResult = await db.run("INSERT INTO users (email, name) VALUES (?, ?)", ['test@example.com', 'Test User']);
    user = { id: userResult.lastID, email: 'test@example.com', name: 'Test User' };
  });

  afterAll(async () => {
    await db.close();
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

    const dbTrade = await db.get('SELECT * FROM trades WHERE id = ?', trade.id);
    expect(dbTrade).toBeDefined();
    expect(dbTrade.symbol).toBe('AAPL');
  });

  it('should get all trades for a user', async () => {
    await TradeService.createTrade({ userId: user.id, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150.0 });
    await TradeService.createTrade({ userId: user.id, symbol: 'GOOG', direction: 'sell', size: 5, entryPrice: 2800.0 });

    const trades = await TradeService.getTradesByUserId(user.id);
    expect(trades).toHaveLength(2);
  });

  it('should get a trade by id', async () => {
    const newTrade = await TradeService.createTrade({ userId: user.id, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150.0 });
    const foundTrade = await TradeService.getTradeById(newTrade.id, user.id);
    expect(foundTrade).toBeDefined();
    expect(foundTrade.id).toBe(newTrade.id);
  });

  it('should not get a trade belonging to another user', async () => {
    const newTrade = await TradeService.createTrade({ userId: user.id, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150.0 });
    const foundTrade = await TradeService.getTradeById(newTrade.id, user.id + 1);
    expect(foundTrade).toBeUndefined();
  });

  it('should update a trade with partial data', async () => {
    const newTrade = await TradeService.createTrade({ userId: user.id, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150.0, notes: 'Original note' });
    const updatedData = { symbol: 'MSFT', notes: 'Updated note' };
    const updatedTrade = await TradeService.updateTrade(newTrade.id, user.id, updatedData);

    expect(updatedTrade).toBeDefined();
    expect(updatedTrade.symbol).toBe('MSFT');
    expect(updatedTrade.notes).toBe('Updated note');
    expect(updatedTrade.direction).toBe('buy'); // Should remain unchanged
  });

  it('should delete a trade', async () => {
    const newTrade = await TradeService.createTrade({ userId: user.id, symbol: 'AAPL', direction: 'buy', size: 10, entryPrice: 150.0 });
    const success = await TradeService.deleteTrade(newTrade.id, user.id);
    expect(success).toBe(true);

    const foundTrade = await TradeService.getTradeById(newTrade.id, user.id);
    expect(foundTrade).toBeUndefined();
  });
});
