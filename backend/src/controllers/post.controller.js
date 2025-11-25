import { PostService } from '../services/post.service.js';

export class PostController {
  static async createPost(req, res, next) {
    try {
      // Add user_id from authenticated user
      const postData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const post = await PostService.createPost(postData);
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostsByThreadId(req, res, next) {
    try {
      const { threadId } = req.params;
      const posts = await PostService.getPostsByThreadId(threadId);
      
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.updatePost(id, req.body);
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      await PostService.deletePost(id);
      
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      next(error);
    }
  }

  static async markAsBestAnswer(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.markAsBestAnswer(id);
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      next(error);
    }
  }
}