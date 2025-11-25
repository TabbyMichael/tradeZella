import express from 'express';
import { PostController } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/thread/:threadId', PostController.getPostsByThreadId);

// Protected routes
router.post('/', protect, PostController.createPost);
router.put('/:id', protect, PostController.updatePost);
router.delete('/:id', protect, PostController.deletePost);
router.post('/:id/best-answer', protect, PostController.markAsBestAnswer);

export default router;