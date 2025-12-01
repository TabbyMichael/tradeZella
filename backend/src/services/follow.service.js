import { FollowModel } from '../models/follow.model.js';

export class FollowService {
  static async followUser(followerId, followedId) {
    // Prevent users from following themselves
    // Convert both IDs to integers for proper comparison
    if (parseInt(followerId) === parseInt(followedId)) {
      throw new Error('Cannot follow yourself');
    }
    
    return await FollowModel.followUser(followerId, followedId);
  }

  static async unfollowUser(followerId, followedId) {
    return await FollowModel.unfollowUser(followerId, followedId);
  }

  static async getFollowers(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    return await FollowModel.getFollowers(userId, limit, offset);
  }

  static async getFollowing(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    return await FollowModel.getFollowing(userId, limit, offset);
  }

  static async isFollowing(followerId, followedId) {
    return await FollowModel.isFollowing(followerId, followedId);
  }

  static async getFollowerCount(userId) {
    return await FollowModel.getFollowerCount(userId);
  }

  static async getFollowingCount(userId) {
    return await FollowModel.getFollowingCount(userId);
  }
}