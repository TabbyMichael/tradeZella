import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes (authentication required)
router.use(protect);

// Follow routes
router.route('/follow/:userId')
  .post(FollowController.followUser)
  .delete(FollowController.unfollowUser);

router.route('/followers/:userId')
  .get(FollowController.getFollowers);

router.route('/following/:userId')
  .get(FollowController.getFollowing);

router.route('/is-following/:userId')
  .get(FollowController.isFollowing);

router.route('/stats/:userId')
  .get(FollowController.getFollowStats);

export default router;