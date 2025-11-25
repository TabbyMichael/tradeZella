import { PostModel } from '../models/post.model.js';

export class PostService {
  static async createPost(data) {
    // Validate required fields
    if (!data.thread_id || !data.user_id || !data.content) {
      throw new Error('Thread ID, user ID, and content are required');
    }
    
    return await PostModel.create(data);
  }

  static async getPostsByThreadId(thread_id) {
    return await PostModel.findByThreadId(thread_id);
  }

  static async getPostById(id) {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  }

  static async updatePost(id, data) {
    // Check if post exists
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    
    // Only content can be updated
    if (!data.content) {
      throw new Error('Content is required');
    }
    
    return await PostModel.update(id, {
      content: data.content
    });
  }

  static async deletePost(id) {
    // Check if post exists
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    
    return await PostModel.delete(id);
  }

  static async markAsBestAnswer(id) {
    // Check if post exists
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    
    return await PostModel.markAsBestAnswer(id);
  }
}