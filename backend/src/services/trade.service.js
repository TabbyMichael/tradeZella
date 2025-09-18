import { getDb } from '../db.js';

export class TradeService {
  static async createTrade({ userId, symbol, direction, size, entryPrice, exitPrice, notes }) {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO trades (userId, symbol, direction, size, entryPrice, exitPrice, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, symbol, direction, size, entryPrice, exitPrice, notes]
    );
    return { id: result.lastID, userId, symbol, direction, size, entryPrice, exitPrice, notes };
  }

  static async getTradesByUserId(userId) {
    const db = await getDb();
    const trades = await db.all('SELECT * FROM trades WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return trades;
  }

  static async getTradeById(id, userId) {
    const db = await getDb();
    const trade = await db.get('SELECT * FROM trades WHERE id = ? AND userId = ?', [id, userId]);
    return trade;
  }

  static async updateTrade(id, userId, tradeData) {
    const db = await getDb();
    const existingTrade = await this.getTradeById(id, userId);
    if (!existingTrade) {
      return null;
    }

    const updatedTradeData = { ...existingTrade, ...tradeData };

    const result = await db.run(
      'UPDATE trades SET symbol = ?, direction = ?, size = ?, entryPrice = ?, exitPrice = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?',
      [
        updatedTradeData.symbol,
        updatedTradeData.direction,
        updatedTradeData.size,
        updatedTradeData.entryPrice,
        updatedTradeData.exitPrice,
        updatedTradeData.notes,
        id,
        userId,
      ]
    );

    if (result.changes === 0) {
      return null; // Should not happen if existingTrade was found
    }
    return this.getTradeById(id, userId);
  }

  static async deleteTrade(id, userId) {
    const db = await getDb();
    const result = await db.run('DELETE FROM trades WHERE id = ? AND userId = ?', [id, userId]);
    return result.changes > 0;
  }
}
