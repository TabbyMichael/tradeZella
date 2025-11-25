import { ThreadService } from '../services/thread.service.js';

export class ThreadController {
  static async getThreads(req, res, next) {
    try {
      const options = {
        category_id: req.query.category_id,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.page - 1) * (parseInt(req.query.limit) || 20) || 0,
        search: req.query.search,
        sort: req.query.sort || 'last_activity_at',
        order: req.query.order || 'DESC'
      };
      
      const result = await ThreadService.getAllThreads(options);
      
      res.status(200).json({
        success: true,
        data: result.threads,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: options.limit
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getThread(req, res, next) {
    try {
      const { id } = req.params;
      const thread = await ThreadService.getThreadById(id);
      
      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      
      // Increment view count
      await ThreadService.incrementViewCount(id);
      
      res.status(200).json({
        success: true,
        data: thread
      });
    } catch (error) {
      next(error);
    }
  }

  static async createThread(req, res, next) {
    try {
      const threadData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const thread = await ThreadService.createThread(threadData);
      res.status(201).json({
        success: true,
        data: thread
      });
    } catch (error) {
      if (error.message === 'Category ID, user ID, title, and content are required') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async updateThread(req, res, next) {
    try {
      const { id } = req.params;
      
      const thread = await ThreadService.updateThread(id, req.body, req.user.id, req.user.role);
      
      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: thread
      });
    } catch (error) {
      if (error.message === 'Thread not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to update this thread') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async deleteThread(req, res, next) {
    try {
      const { id } = req.params;
      
      const thread = await ThreadService.deleteThread(id, req.user.id, req.user.role);
      
      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Thread deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Thread not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to delete this thread') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}