import { ReactionModel } from '../models/reaction.model.js';

export class ReactionService {
  static async addReaction(userId, targetId, targetType, type) {
    // Validate reaction type
    const validTypes = ['upvote', 'like', 'heart', 'laugh', 'surprised', 'sad', 'angry'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid reaction type');
    }
    
    // Validate target type
    if (!['post', 'thread'].includes(targetType)) {
      throw new Error('Invalid target type');
    }
    
    const reactionData = {
      user_id: userId,
      post_id: targetType === 'post' ? targetId : null,
      thread_id: targetType === 'thread' ? targetId : null,
      type
    };
    
    return await ReactionModel.createReaction(reactionData);
  }

  static async removeReaction(userId, targetId, targetType, type) {
    const reactionData = {
      user_id: userId,
      post_id: targetType === 'post' ? targetId : null,
      thread_id: targetType === 'thread' ? targetId : null,
      type
    };
    
    return await ReactionModel.removeReaction(reactionData);
  }

  static async getReactionsForPost(postId) {
    return await ReactionModel.getReactionsForPost(postId);
  }

  static async getReactionsForThread(threadId) {
    return await ReactionModel.getReactionsForThread(threadId);
  }

  static async getUserReaction(userId, targetId, targetType, type) {
    const reactionData = {
      user_id: userId,
      post_id: targetType === 'post' ? targetId : null,
      thread_id: targetType === 'thread' ? targetId : null,
      type
    };
    
    return await ReactionModel.getUserReaction(
      reactionData.user_id,
      reactionData.post_id,
      reactionData.thread_id,
      reactionData.type
    );
  }

  static async getReactionCounts(targetId, targetType) {
    return await ReactionModel.getReactionCounts(
      targetType === 'post' ? targetId : null,
      targetType === 'thread' ? targetId : null
    );
  }

  static async toggleReaction(userId, targetId, targetType, type) {
    const existingReaction = await this.getUserReaction(userId, targetId, targetType, type);
    
    if (existingReaction) {
      await this.removeReaction(userId, targetId, targetType, type);
      return { action: 'removed', reaction: existingReaction };
    } else {
      const reaction = await this.addReaction(userId, targetId, targetType, type);
      return { action: 'added', reaction };
    }
  }
}