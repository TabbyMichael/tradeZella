import { BacktestingModel } from '../models/backtesting.model.js';

export class BacktestingService {
  static async createBacktestingResult(backtestingData) {
    return await BacktestingModel.create(backtestingData);
  }

  static async getBacktestingResultById(id) {
    return await BacktestingModel.findById(id);
  }

  static async getBacktestingResultsByUserId(userId) {
    return await BacktestingModel.findByUserId(userId);
  }

  static async deleteBacktestingResult(id, userId) {
    return await BacktestingModel.delete(id, userId);
  }

  // Simulate a backtesting process (in a real implementation, this would connect to market data)
  static async runBacktest({ userId, strategy, startDate, endDate, initialCapital }) {
    // This is a simplified simulation - in a real implementation, this would:
    // 1. Connect to market data sources
    // 2. Apply the strategy to historical data
    // 3. Calculate performance metrics
    
    // Simulated results for demonstration
    const totalTrades = Math.floor(Math.random() * 100) + 50;
    const winningTrades = Math.floor(totalTrades * (0.4 + Math.random() * 0.3));
    const losingTrades = totalTrades - winningTrades;
    const winRate = (winningTrades / totalTrades) * 100;
    
    // Simulate profit/loss calculations
    const avgWin = initialCapital * 0.02;
    const avgLoss = initialCapital * 0.015;
    const totalProfit = (winningTrades * avgWin) - (losingTrades * avgLoss);
    const finalCapital = initialCapital + totalProfit;
    
    // Calculate performance metrics
    const profitFactor = winningTrades > 0 ? (winningTrades * avgWin) / (losingTrades * avgLoss || 1) : 0;
    const maxDrawdown = (Math.random() * 10).toFixed(2);
    const sharpeRatio = (Math.random() * 2).toFixed(2);
    
    const results = {
      trades: Array.from({ length: totalTrades }, (_, i) => ({
        id: i + 1,
        date: new Date(startDate).setDate(new Date(startDate).getDate() + i),
        symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'][Math.floor(Math.random() * 4)],
        direction: Math.random() > 0.5 ? 'buy' : 'sell',
        size: Math.floor(Math.random() * 100) + 1,
        entryPrice: 100 + (Math.random() * 50),
        exitPrice: 100 + (Math.random() * 50),
        profit: (Math.random() * 1000) - 500,
        commission: Math.random() * 10
      }))
    };

    return {
      userId,
      name: `Backtest: ${new Date().toISOString()}`,
      strategy,
      startDate,
      endDate,
      initialCapital,
      finalCapital,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: winRate.toFixed(2),
      profitFactor: profitFactor.toFixed(2),
      maxDrawdown,
      sharpeRatio,
      results
    };
  }
}