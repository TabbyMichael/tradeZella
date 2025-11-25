import { ThreadService } from '../services/thread.service.js';

export class ThreadController {
  static async createThread(req, res, next) {
    try {
      // Add user_id from authenticated user
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
      next(error);
    }
  }

  static async getAllThreads(req, res, next) {
    try {
      const filters = {};
      
      // Apply filters from query parameters
      if (req.query.category_id) {
        filters.category_id = req.query.category_id;
      }
      
      if (req.query.user_id) {
        filters.user_id = req.query.user_id;
      }
      
      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit);
      }
      
      if (req.query.offset) {
        filters.offset = parseInt(req.query.offset);
      }
      
      const threads = await ThreadService.getAllThreads(filters);
      res.status(200).json({
        success: true,
        data: threads
      });
    } catch (error) {
      next(error);
    }
  }

  static async getThreadById(req, res, next) {
    try {
      const { id } = req.params;
      const thread = await ThreadService.getThreadById(id);
      
      // Increment view count
      await ThreadService.incrementViewCount(id);
      
      res.status(200).json({
        success: true,
        data: thread
      });
    } catch (error) {
      if (error.message === 'Thread not found') {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      next(error);
    }
  }

  static async updateThread(req, res, next) {
    try {
      const { id } = req.params;
      const thread = await ThreadService.updateThread(id, req.body);
      
      res.status(200).json({
        success: true,
        data: thread
      });
    } catch (error) {
      if (error.message === 'Thread not found') {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      next(error);
    }
  }

  static async deleteThread(req, res, next) {
    try {
      const { id } = req.params;
      await ThreadService.deleteThread(id);
      
      res.status(200).json({
        success: true,
        message: 'Thread deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Thread not found') {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      next(error);
    }
  }
}