import { TagService } from '../services/tag.service.js';

export class TagController {
  static async createTag(req, res, next) {
    try {
      const tag = await TagService.createTag(req.body);
      res.status(201).json({
        success: true,
        data: tag
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllTags(req, res, next) {
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

  static async getTagBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const tag = await TagService.getTagBySlug(slug);
      
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

  static async getTagsByThreadId(req, res, next) {
    try {
      const { threadId } = req.params;
      const tags = await TagService.getTagsByThreadId(threadId);
      
      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }
}