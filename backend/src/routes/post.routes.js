import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

// Public routes
router.route('/')
  .get(PostController.getPosts);

router.route('/:id')
  .get(PostController.getPost);

// Protected routes
router.use(protect);
router.route('/')
  .post(PostController.createPost);

router.route('/:id')
  .put(PostController.updatePost)
  .delete(PostController.deletePost);

router.route('/:id/best-answer')
  .post(PostController.markAsBestAnswer);

export default router;