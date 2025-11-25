import { Router } from 'express';
import { ThreadController } from '../controllers/thread.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.route('/')
  .get(ThreadController.getThreads);

router.route('/:id')
  .get(ThreadController.getThread);

// Protected routes
router.use(protect);
router.route('/')
  .post(ThreadController.createThread);

router.route('/:id')
  .put(ThreadController.updateThread)
  .delete(ThreadController.deleteThread);

export default router;