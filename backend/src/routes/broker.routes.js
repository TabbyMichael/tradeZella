import { Router } from 'express';
import { BrokerController } from '../controllers/broker.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(BrokerController.getBrokerConnections)
  .post(BrokerController.createBrokerConnection);

router.route('/:id')
  .get(BrokerController.getBrokerConnection)
  .put(BrokerController.updateBrokerConnection)
  .delete(BrokerController.deleteBrokerConnection);

router.route('/:id/sync')
  .post(BrokerController.syncTrades);

export default router;