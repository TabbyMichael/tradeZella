import { TagModel } from '../models/tag.model.js';

export class TagService {
  static async getAllTags() {
    return await TagModel.findAll();
  }

  static async getTagById(id) {
    return await TagModel.findById(id);
  }

  static async getTagByName(name) {
    return await TagModel.findByName(name);
  }

  static async getTagBySlug(slug) {
    return await TagModel.findBySlug(slug);
  }

  static async createTag(tagData) {
    // Validate required fields
    if (!tagData.name || !tagData.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if tag already exists
    const existingTag = await TagModel.findByName(tagData.name);
    if (existingTag) {
      throw new Error('Tag with this name already exists');
    }
    
    return await TagModel.create(tagData);
  }

  static async updateTag(id, tagData) {
    const tag = await TagModel.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    
    return await TagModel.update(id, tagData);
  }

  static async deleteTag(id) {
    const tag = await TagModel.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    
    return await TagModel.delete(id);
  }

  static async getTagsForThread(thread_id) {
    return await TagModel.getTagsForThread(thread_id);
  }

  static async addTagToThread(thread_id, tag_id) {
    return await TagModel.addTagToThread(thread_id, tag_id);
  }

  static async removeTagFromThread(thread_id, tag_id) {
    return await TagModel.removeTagFromThread(thread_id, tag_id);
  }
}