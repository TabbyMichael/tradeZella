import { ReactionService } from '../services/reaction.service.js';

export class ReactionController {
  static async addReaction(req, res, next) {
    try {
      const { targetId, targetType, type } = req.body;
      const userId = req.user.id;
      
      const result = await ReactionService.addReaction(userId, targetId, targetType, type);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeReaction(req, res, next) {
    try {
      const { targetId, targetType, type } = req.body;
      const userId = req.user.id;
      
      const result = await ReactionService.removeReaction(userId, targetId, targetType, type);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Reaction not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Reaction removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleReaction(req, res, next) {
    try {
      const { targetId, targetType, type } = req.body;
      const userId = req.user.id;
      
      const result = await ReactionService.toggleReaction(userId, targetId, targetType, type);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReactionsForPost(req, res, next) {
    try {
      const { postId } = req.params;
      
      const reactions = await ReactionService.getReactionsForPost(postId);
      
      res.status(200).json({
        success: true,
        data: reactions
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReactionsForThread(req, res, next) {
    try {
      const { threadId } = req.params;
      
      const reactions = await ReactionService.getReactionsForThread(threadId);
      
      res.status(200).json({
        success: true,
        data: reactions
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReactionCounts(req, res, next) {
    try {
      const { targetId, targetType } = req.params;
      
      const counts = await ReactionService.getReactionCounts(targetId, targetType);
      
      res.status(200).json({
        success: true,
        data: counts
      });
    } catch (error) {
      next(error);
    }
  }
}