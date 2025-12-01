import { Router } from 'express';
import multer from 'multer';
import { TradeController } from '../controllers/trade.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, tradeValidationRules } from '../middleware/validator.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes in this file
// router.use(protect); // Removed global protect

router.route('/')
  .get(protect, TradeController.getTrades)
  .post(protect, tradeValidationRules(), validate, TradeController.createTrade);

router.post('/upload', protect, upload.single('file'), TradeController.uploadTrades);

router.route('/:id')
  .get(protect, TradeController.getTrade)
  .put(protect, tradeValidationRules(), validate, TradeController.updateTrade)
  .delete(protect, TradeController.deleteTrade);

export default router;
