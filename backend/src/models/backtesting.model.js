import { pool } from '../db.js';

export class BacktestingModel {
  static async create(backtestingData) {
    const client = await pool.connect();
    try {
      const {
        userId,
        playbookId,
        name,
        strategy,
        startDate,
        endDate,
        initialCapital,
        finalCapital,
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        profitFactor,
        maxDrawdown,
        sharpeRatio,
        results
      } = backtestingData;

      const result = await client.query(
        `INSERT INTO backtesting_results (
          userId, playbookId, name, strategy, start_date, end_date, 
          initial_capital, final_capital, total_trades, winning_trades, 
          losing_trades, win_rate, profit_factor, max_drawdown, sharpe_ratio, results
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING *`,
        [
          userId, playbookId, name, strategy, startDate, endDate,
          initialCapital, finalCapital, totalTrades, winningTrades,
          losingTrades, winRate, profitFactor, maxDrawdown, sharpeRatio,
          JSON.stringify(results)
        ]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, playbookId, name, strategy, start_date as "startDate", 
          end_date as "endDate", initial_capital as "initialCapital", 
          final_capital as "finalCapital", total_trades as "totalTrades", 
          winning_trades as "winningTrades", losing_trades as "losingTrades", 
          win_rate as "winRate", profit_factor as "profitFactor", 
          max_drawdown as "maxDrawdown", sharpe_ratio as "sharpeRatio", 
          results, created_at as "createdAt"
         FROM backtesting_results
         WHERE id = $1`,
        [id]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          id, userId, playbookId, name, strategy, start_date as "startDate", 
          end_date as "endDate", initial_capital as "initialCapital", 
          final_capital as "finalCapital", total_trades as "totalTrades", 
          winning_trades as "winningTrades", losing_trades as "losingTrades", 
          win_rate as "winRate", profit_factor as "profitFactor", 
          max_drawdown as "maxDrawdown", sharpe_ratio as "sharpeRatio", 
          results, created_at as "createdAt"
         FROM backtesting_results
         WHERE userId = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async delete(id, userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM backtesting_results WHERE id = $1 AND userId = $2',
        [id, userId]
      );

      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}