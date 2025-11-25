import { TagService } from '../services/tag.service.js';

export class TagController {
  static async getTags(req, res, next) {
    try {
      const tags = await TagService.getAllTags();
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTag(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await TagService.getTagById(id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTag(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create tags'
        });
      }
      
      const tag = await TagService.createTag(req.body);
      res.status(201).json({
        success: true,
        data: tag
      });
    } catch (error) {
      if (error.message === 'Name and slug are required') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Tag with this name already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async updateTag(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update tags'
        });
      }
      
      const tag = await TagService.updateTag(id, req.body);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete tags'
        });
      }
      
      const tag = await TagService.deleteTag(id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Tag not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async getTagsForThread(req, res, next) {
    try {
      const { thread_id } = req.params;
      const tags = await TagService.getTagsForThread(thread_id);
      
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTagToThread(req, res, next) {
    try {
      const { thread_id } = req.params;
      const { tag_id } = req.body;
      
      // Check if user is admin or thread author
      const thread = await ThreadService.getThreadById(thread_id);
      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      
      if (thread.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add tags to this thread'
        });
      }
      
      const result = await TagService.addTagToThread(thread_id, tag_id);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Tag added to thread successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeTagFromThread(req, res, next) {
    try {
      const { thread_id, tag_id } = req.params;
      
      // Check if user is admin or thread author
      const thread = await ThreadService.getThreadById(thread_id);
      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Thread not found'
        });
      }
      
      if (thread.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to remove tags from this thread'
        });
      }
      
      const result = await TagService.removeTagFromThread(thread_id, tag_id);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Tag removed from thread successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}