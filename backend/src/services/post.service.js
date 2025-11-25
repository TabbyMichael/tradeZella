import { PostModel } from '../models/post.model.js';
import { ThreadModel } from '../models/thread.model.js';

export class PostService {
  static async getPostsByThreadId(thread_id, options = {}) {
    return await PostModel.findByThreadId(thread_id, options);
  }

  static async getPostById(id) {
    return await PostModel.findById(id);
  }

  static async createPost(postData) {
    // Validate required fields
    if (!postData.thread_id || !postData.user_id || !postData.content) {
      throw new Error('Thread ID, user ID, and content are required');
    }
    
    return await PostModel.create(postData);
  }

  static async updatePost(id, postData, userId, userRole) {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check if user is authorized to update (author or admin)
    if (post.user_id !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to update this post');
    }
    
    return await PostModel.update(id, postData);
  }

  static async deletePost(id, userId, userRole) {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check if user is authorized to delete (author or admin)
    if (post.user_id !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to delete this post');
    }
    
    return await PostModel.delete(id);
  }

  static async markAsBestAnswer(id, userId, userRole) {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Only the thread author or admin can mark best answer
    const thread = await ThreadModel.findById(post.thread_id);
    if (thread.user_id !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to mark best answer');
    }
    
    return await PostModel.markAsBestAnswer(id);
  }
}