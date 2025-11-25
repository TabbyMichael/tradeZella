import { PostService } from '../services/post.service.js';

export class PostController {
  static async getPosts(req, res, next) {
    try {
      const { thread_id } = req.params;
      const options = {
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.page - 1) * (parseInt(req.query.limit) || 50) || 0
      };
      
      const posts = await PostService.getPostsByThreadId(thread_id, options);
      
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req, res, next) {
    try {
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
      if (error.message === 'Thread ID, user ID, and content are required') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      
      const post = await PostService.updatePost(id, req.body, req.user.id, req.user.role);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to update this post') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      
      const post = await PostService.deletePost(id, req.user.id, req.user.role);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to delete this post') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async markAsBestAnswer(req, res, next) {
    try {
      const { id } = req.params;
      
      const post = await PostService.markAsBestAnswer(id, req.user.id, req.user.role);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post,
        message: 'Post marked as best answer'
      });
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to mark best answer') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}