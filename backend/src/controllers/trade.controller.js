import { TradeService } from '../services/trade.service.js';

export class TradeController {
  static async createTrade(req, res, next) {
    try {
      // Assuming req.user is populated by authentication middleware
      const tradeData = { ...req.body, userId: req.user.id };
      const newTrade = await TradeService.createTrade(tradeData);
      res.status(201).json(newTrade);
    } catch (error) {
      next(error);
    }
  }

  static async getTrades(req, res, next) {
    try {
      const trades = await TradeService.getTradesByUserId(req.user.id);
      res.status(200).json(trades);
    } catch (error) {
      next(error);
    }
  }

  static async getTrade(req, res, next) {
    try {
      const trade = await TradeService.getTradeById(req.params.id, req.user.id);
      if (!trade) {
        return res.status(404).json({ message: 'Trade not found' });
      }
      res.status(200).json(trade);
    } catch (error) {
      next(error);
    }
  }

  static async updateTrade(req, res, next) {
    try {
      const updatedTrade = await TradeService.updateTrade(req.params.id, req.user.id, req.body);
      if (!updatedTrade) {
        return res.status(404).json({ message: 'Trade not found' });
      }
      res.status(200).json(updatedTrade);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrade(req, res, next) {
    try {
      const success = await TradeService.deleteTrade(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ message: 'Trade not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
