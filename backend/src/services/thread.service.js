import { ThreadModel } from '../models/thread.model.js';

export class ThreadService {
  static async getAllThreads(options = {}) {
    const threads = await ThreadModel.findAll(options);
    const totalCount = await ThreadModel.count(options);
    
    return {
      threads,
      totalCount,
      totalPages: Math.ceil(totalCount / (options.limit || 20)),
      currentPage: Math.floor((options.offset || 0) / (options.limit || 20)) + 1
    };
  }

  static async getThreadById(id) {
    return await ThreadModel.findById(id);
  }

  static async createThread(threadData) {
    // Validate required fields
    if (!threadData.category_id || !threadData.user_id || !threadData.title || !threadData.content) {
      throw new Error('Category ID, user ID, title, and content are required');
    }
    
    return await ThreadModel.create(threadData);
  }

  static async updateThread(id, threadData, userId, userRole) {
    const thread = await ThreadModel.findById(id);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    // Check if user is authorized to update (author or admin)
    if (thread.user_id !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to update this thread');
    }
    
    return await ThreadModel.update(id, threadData);
  }

  static async deleteThread(id, userId, userRole) {
    const thread = await ThreadModel.findById(id);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    // Check if user is authorized to delete (author or admin)
    if (thread.user_id !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to delete this thread');
    }
    
    return await ThreadModel.delete(id);
  }

  static async incrementViewCount(id) {
    return await ThreadModel.incrementViewCount(id);
  }
}