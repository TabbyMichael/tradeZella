import { BacktestingService } from '../services/backtesting.service.js';

export class BacktestingController {
  static async runBacktest(req, res, next) {
    try {
      const backtestData = { ...req.body, userId: req.user.id };
      const backtestResult = await BacktestingService.runBacktest(backtestData);
      const savedResult = await BacktestingService.createBacktestingResult(backtestResult);
      
      res.status(201).json({ 
        success: true,
        data: savedResult 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBacktestingResults(req, res, next) {
    try {
      const results = await BacktestingService.getBacktestingResultsByUserId(req.user.id);
      res.status(200).json({ 
        success: true,
        data: results 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBacktestingResult(req, res, next) {
    try {
      const result = await BacktestingService.getBacktestingResultById(req.params.id);
      if (!result) {
        return res.status(404).json({ 
          success: false,
          message: 'Backtesting result not found' 
        });
      }
      
      // Check if user owns the result
      if (result.userId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
      
      res.status(200).json({ 
        success: true,
        data: result 
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBacktestingResult(req, res, next) {
    try {
      const success = await BacktestingService.deleteBacktestingResult(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ 
          success: false,
          message: 'Backtesting result not found' 
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'Backtesting result deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  }
}