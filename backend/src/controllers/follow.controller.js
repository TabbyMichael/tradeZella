import { FollowService } from '../services/follow.service.js';

export class FollowController {
  static async followUser(req, res, next) {
    try {
      const { userId } = req.params;
      const followerId = req.user.id;
      
      const follow = await FollowService.followUser(followerId, userId);
      
      res.status(201).json({
        success: true,
        data: follow
      });
    } catch (error) {
      if (error.message === 'Cannot follow yourself') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async unfollowUser(req, res, next) {
    try {
      const { userId } = req.params;
      const followerId = req.user.id;
      
      const result = await FollowService.unfollowUser(followerId, userId);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Not following this user'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Unfollowed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFollowers(req, res, next) {
    try {
      const { userId } = req.params;
      const options = {
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };
      
      const followers = await FollowService.getFollowers(userId, options);
      
      res.status(200).json({
        success: true,
        data: followers
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFollowing(req, res, next) {
    try {
      const { userId } = req.params;
      const options = {
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };
      
      const following = await FollowService.getFollowing(userId, options);
      
      res.status(200).json({
        success: true,
        data: following
      });
    } catch (error) {
      next(error);
    }
  }

  static async isFollowing(req, res, next) {
    try {
      const { userId } = req.params;
      const followerId = req.user.id;
      
      const isFollowing = await FollowService.isFollowing(followerId, userId);
      
      res.status(200).json({
        success: true,
        data: { isFollowing }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFollowStats(req, res, next) {
    try {
      const { userId } = req.params;
      
      const [followerCount, followingCount] = await Promise.all([
        FollowService.getFollowerCount(userId),
        FollowService.getFollowingCount(userId)
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          followerCount,
          followingCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
}