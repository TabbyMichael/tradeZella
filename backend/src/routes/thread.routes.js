import express from 'express';
import { ThreadController } from '../controllers/thread.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', ThreadController.getAllThreads);
router.get('/:id', ThreadController.getThreadById);

// Protected routes
router.post('/', protect, ThreadController.createThread);
router.put('/:id', protect, ThreadController.updateThread);
router.delete('/:id', protect, ThreadController.deleteThread);

export default router;