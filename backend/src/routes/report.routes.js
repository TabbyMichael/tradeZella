import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(ReportController.getReports)
  .post(ReportController.createReport);

router.route('/:id')
  .get(ReportController.getReport)
  .put(ReportController.updateReport)
  .delete(ReportController.deleteReport);

router.route('/:id/generate')
  .post(ReportController.generateReportData);

export default router;