import { Router } from 'express';
import { BacktestingController } from '../controllers/backtesting.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(BacktestingController.getBacktestingResults)
  .post(BacktestingController.runBacktest);

router.route('/:id')
  .get(BacktestingController.getBacktestingResult)
  .delete(BacktestingController.deleteBacktestingResult);

export default router;