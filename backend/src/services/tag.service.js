import { TagModel } from '../models/tag.model.js';

export class TagService {
  static async createTag(data) {
    // Validate required fields
    if (!data.name || !data.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if tag with same name already exists
    const existingTag = await TagModel.findBySlug(data.slug);
    if (existingTag) {
      throw new Error('Tag with this slug already exists');
    }
    
    return await TagModel.create(data);
  }

  static async getAllTags() {
    return await TagModel.findAll();
  }

  static async getTagBySlug(slug) {
    return await TagModel.findBySlug(slug);
  }

  static async getTagsByThreadId(thread_id) {
    return await TagModel.findByThreadId(thread_id);
  }

  static async addTagToThread(thread_id, tag_id) {
    return await TagModel.addTagToThread(thread_id, tag_id);
  }

  static async removeTagFromThread(thread_id, tag_id) {
    return await TagModel.removeTagFromThread(thread_id, tag_id);
  }
}