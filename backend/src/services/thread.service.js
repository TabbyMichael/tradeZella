import { ThreadModel } from '../models/thread.model.js';
import { PostModel } from '../models/post.model.js';
import { TagModel } from '../models/tag.model.js';

export class ThreadService {
  static async createThread(data) {
    // Validate required fields
    if (!data.category_id || !data.user_id || !data.title || !data.content) {
      throw new Error('Category ID, user ID, title, and content are required');
    }
    
    // Create the thread
    const thread = await ThreadModel.create(data);
    
    // If tags are provided, associate them with the thread
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        // Create tag if it doesn't exist
        let tag = await TagModel.findBySlug(tagName.toLowerCase().replace(/\s+/g, '-'));
        if (!tag) {
          tag = await TagModel.create({
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          });
        }
        
        // Associate tag with thread
        await TagModel.addTagToThread(thread.id, tag.id);
      }
    }
    
    return thread;
  }

  static async getAllThreads(filters = {}) {
    return await ThreadModel.findAll(filters);
  }

  static async getThreadById(id) {
    const thread = await ThreadModel.findById(id);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    // Get associated posts
    const posts = await PostModel.findByThreadId(id);
    
    // Get associated tags
    const tags = await TagModel.findByThreadId(id);
    
    return {
      ...thread,
      posts,
      tags
    };
  }

  static async updateThread(id, data) {
    // Check if thread exists
    const existingThread = await ThreadModel.findById(id);
    if (!existingThread) {
      throw new Error('Thread not found');
    }
    
    return await ThreadModel.update(id, data);
  }

  static async incrementViewCount(id) {
    // Check if thread exists
    const existingThread = await ThreadModel.findById(id);
    if (!existingThread) {
      throw new Error('Thread not found');
    }
    
    return await ThreadModel.incrementViewCount(id);
  }

  static async deleteThread(id) {
    // Check if thread exists
    const existingThread = await ThreadModel.findById(id);
    if (!existingThread) {
      throw new Error('Thread not found');
    }
    
    return await ThreadModel.delete(id);
  }
}