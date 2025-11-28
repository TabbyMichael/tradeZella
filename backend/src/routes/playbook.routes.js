import { Router } from 'express';
import { PlaybookController } from '../controllers/playbook.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(PlaybookController.getPlaybooks)
  .post(PlaybookController.createPlaybook);

router.route('/public')
  .get(PlaybookController.getPublicPlaybooks);

router.route('/:id')
  .get(PlaybookController.getPlaybook)
  .put(PlaybookController.updatePlaybook)
  .delete(PlaybookController.deletePlaybook);

export default router;