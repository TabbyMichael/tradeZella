import { BrokerModel } from '../models/broker.model.js';

export class BrokerService {
  static async createBrokerConnection(brokerData) {
    return await BrokerModel.create(brokerData);
  }

  static async getBrokerConnectionById(id) {
    return await BrokerModel.findById(id);
  }

  static async getBrokerConnectionsByUserId(userId) {
    return await BrokerModel.findByUserId(userId);
  }

  static async getBrokerConnectionByUserIdAndBrokerName(userId, brokerName) {
    return await BrokerModel.findByUserIdAndBrokerName(userId, brokerName);
  }

  static async updateBrokerConnection(id, userId, updateData) {
    return await BrokerModel.update(id, userId, updateData);
  }

  static async deleteBrokerConnection(id, userId) {
    return await BrokerModel.delete(id, userId);
  }

  // Simulate syncing trades from a broker
  static async syncTradesFromBroker(brokerConnection) {
    // In a real implementation, this would:
    // 1. Connect to the broker's API using connectionDetails
    // 2. Fetch recent trades
    // 3. Transform them to our internal format
    // 4. Save them to the database
    
    // For now, return simulated data
    const trades = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
      symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'][Math.floor(Math.random() * 5)],
      direction: ['buy', 'sell'][Math.floor(Math.random() * 2)],
      size: Math.floor(Math.random() * 100) + 1,
      entryPrice: parseFloat((100 + Math.random() * 150).toFixed(2)),
      exitPrice: Math.random() > 0.3 ? parseFloat((100 + Math.random() * 150).toFixed(2)) : undefined,
      notes: `Auto-imported from ${brokerConnection.brokerName}`,
      tradeDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['broker-import'],
      sentiment: Math.random() > 0.5 ? 'confident' : 'cautious'
    }));

    return {
      success: true,
      tradesCount: trades.length,
      trades
    };
  }
}