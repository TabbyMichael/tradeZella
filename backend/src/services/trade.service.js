import { pool } from '../db.js';

export class TradeService {
    static async createTrade({ userId, symbol, direction, size, entryPrice, exitPrice, notes, tradeDate, tags, sentiment, screenshots }) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          `INSERT INTO trades (userId, symbol, direction, size, entryPrice, exitPrice, notes, trade_date, tags, sentiment, screenshots)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING *`,
          [userId, symbol, direction, size, entryPrice, exitPrice, notes, tradeDate, tags, sentiment, screenshots]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    }
  
    static async getTradesByUserId(userId) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT id, userId, symbol, direction, size, entryPrice, exitPrice, notes, trade_date, tags, sentiment, screenshots, createdAt, updatedAt FROM trades WHERE userId = $1 ORDER BY createdAt DESC',
          [userId]
        );
        return result.rows;
      } finally {
        client.release();
      }
    }
  
    static async getTradeById(id, userId) {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT id, userId, symbol, direction, size, entryPrice, exitPrice, notes, trade_date, tags, sentiment, screenshots, createdAt, updatedAt FROM trades WHERE id = $1 AND userId = $2',
          [id, userId]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    }
  static async updateTrade(id, userId, tradeData) {
    const client = await pool.connect();
    try {
      const existingTrade = await this.getTradeById(id, userId);
      if (!existingTrade) {
        return null;
      }

      // Build dynamic update query to only update provided fields
      const fields = [];
      const values = [];
      let index = 1;

      Object.keys(tradeData).forEach(key => {
        if (tradeData[key] !== undefined) {
          fields.push(`${key} = $${index}`);
          values.push(tradeData[key]);
          index++;
        }
      });

      if (fields.length === 0) {
        return existingTrade; // Nothing to update
      }

      values.push(id, userId); // Add id and userId for WHERE clause

      const result = await client.query(
        `UPDATE trades 
         SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP 
         WHERE id = $${index} AND userId = $${index + 1}
         RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return null; // Should not happen if existingTrade was found
      }
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async deleteTrade(id, userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM trades WHERE id = $1 AND userId = $2', 
        [id, userId]
      );
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}