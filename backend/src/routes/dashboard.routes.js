import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/metrics')
  .get(DashboardController.getDashboardMetrics);

export default router;