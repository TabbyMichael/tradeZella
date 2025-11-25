import { Router } from 'express';
import { ReactionController } from '../controllers/reaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes (authentication required)
router.use(protect);

// Reaction routes
router.route('/')
  .post(ReactionController.addReaction)
  .delete(ReactionController.removeReaction)
  .put(ReactionController.toggleReaction);

router.route('/post/:postId')
  .get(ReactionController.getReactionsForPost);

router.route('/thread/:threadId')
  .get(ReactionController.getReactionsForThread);

router.route('/counts/:targetId/:targetType')
  .get(ReactionController.getReactionCounts);

export default router;