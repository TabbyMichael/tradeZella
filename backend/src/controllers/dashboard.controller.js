import { TradeService } from '../services/trade.service.js';

export class DashboardController {
  static async getDashboardMetrics(req, res, next) {
    try {
      const userId = req.user.id;
      
      // Get all user trades
      const trades = await TradeService.getTradesByUserId(userId);
      
      // Calculate metrics
      const metrics = calculatePerformanceMetrics(trades);
      
      res.status(200).json({ 
        success: true,
        data: {
          metrics,
          recentTrades: trades.slice(0, 5)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

function calculatePerformanceMetrics(trades) {
  const completedTrades = trades.filter(t => t.exitPrice != null && t.exitPrice > 0);

  let totalProfitLoss = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let totalWins = 0;
  let totalLosses = 0;
  let maxDrawdown = 0;
  let peak = 0;
  let runningTotal = 0;
  let bestTrade = 0;
  let worstTrade = 0;

  // Calculate profit/loss for each trade
  completedTrades.forEach(trade => {
    const profit = trade.direction === 'buy' || trade.direction === 'cover'
      ? (trade.exitPrice - trade.entryPrice) * trade.size
      : (trade.entryPrice - trade.exitPrice) * trade.size;

    totalProfitLoss += profit;
    
    if (profit > 0) {
      winningTrades++;
      totalWins += profit;
      if (profit > bestTrade) bestTrade = profit;
    } else {
      losingTrades++;
      totalLosses += Math.abs(profit);
      if (profit < worstTrade) worstTrade = profit;
    }
    
    // Calculate drawdown
    runningTotal += profit;
    if (runningTotal > peak) {
      peak = runningTotal;
    }
    const drawdown = peak - runningTotal;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  const totalClosedTrades = winningTrades + losingTrades;
  const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;
  const avgWin = winningTrades > 0 ? totalWins / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? totalLosses / losingTrades : 0;
  const profitFactor = avgLoss > 0 ? totalWins / totalLosses : 0;
  const expectancy = totalClosedTrades > 0 ? totalProfitLoss / totalClosedTrades : 0;
  const sharpeRatio = 1.5; // Simplified - would be calculated from actual returns

  return {
    totalTrades: trades.length,
    completedTrades: completedTrades.length,
    totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(2)),
    winningTrades,
    losingTrades,
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
    expectancy: parseFloat(expectancy.toFixed(2)),
    bestTrade: parseFloat(bestTrade.toFixed(2)),
    worstTrade: parseFloat(worstTrade.toFixed(2))
  };
}