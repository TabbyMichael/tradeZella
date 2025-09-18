import { Router } from 'express';
import { TradeController } from '../controllers/trade.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, tradeValidationRules } from '../middleware/validator.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(TradeController.getTrades)
  .post(tradeValidationRules(), validate, TradeController.createTrade);

router.route('/:id')
  .get(TradeController.getTrade)
  .put(tradeValidationRules(), validate, TradeController.updateTrade)
  .delete(TradeController.deleteTrade);

export default router;
