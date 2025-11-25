import { PostService } from '../../../src/services/post.service.js';
import { PostModel } from '../../../src/models/post.model.js';

// Mock the PostModel
jest.mock('../../../src/models/post.model.js');

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createPost', () => {
    it('should create a new post when valid data is provided', async () => {
      const postData = {
        thread_id: 1,
        user_id: 1,
        content: 'Test post content'
      };
      
      const createdPost = { id: 1, ...postData };
      
      PostModel.create.mockResolvedValue(createdPost);
      
      const result = await PostService.createPost(postData);
      
      expect(PostModel.create).toHaveBeenCalledWith(postData);
      expect(result).toEqual(createdPost);
    });
    
    it('should throw an error when required fields are missing', async () => {
      const postData = {
        content: 'Test post content'
      };
      
      await expect(PostService.createPost(postData))
        .rejects
        .toThrow('Thread ID, user ID, and content are required');
    });
  });
  
  describe('getPostsByThreadId', () => {
    it('should return all posts for a thread', async () => {
      const posts = [
        { id: 1, content: 'First post' },
        { id: 2, content: 'Second post' }
      ];
      
      PostModel.findByThreadId.mockResolvedValue(posts);
      
      const result = await PostService.getPostsByThreadId(1);
      
      expect(PostModel.findByThreadId).toHaveBeenCalledWith(1);
      expect(result).toEqual(posts);
    });
  });
  
  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const post = { id: 1, content: 'Test post' };
      
      PostModel.findById.mockResolvedValue(post);
      
      const result = await PostService.getPostById(1);
      
      expect(PostModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(post);
    });
    
    it('should throw an error when post is not found', async () => {
      PostModel.findById.mockResolvedValue(null);
      
      await expect(PostService.getPostById(999))
        .rejects
        .toThrow('Post not found');
    });
  });
  
  describe('updatePost', () => {
    it('should update a post when it exists', async () => {
      const existingPost = { id: 1, content: 'Old content' };
      const updateData = { content: 'New content' };
      const updatedPost = { id: 1, content: 'New content' };
      
      PostModel.findById.mockResolvedValue(existingPost);
      PostModel.update.mockResolvedValue(updatedPost);
      
      const result = await PostService.updatePost(1, updateData);
      
      expect(PostModel.findById).toHaveBeenCalledWith(1);
      expect(PostModel.update).toHaveBeenCalledWith(1, { content: updateData.content });
      expect(result).toEqual(updatedPost);
    });
    
    it('should throw an error when post does not exist', async () => {
      PostModel.findById.mockResolvedValue(null);
      
      await expect(PostService.updatePost(999, { content: 'New content' }))
        .rejects
        .toThrow('Post not found');
    });
    
    it('should throw an error when content is missing', async () => {
      const existingPost = { id: 1, content: 'Old content' };
      
      PostModel.findById.mockResolvedValue(existingPost);
      
      await expect(PostService.updatePost(1, {}))
        .rejects
        .toThrow('Content is required');
    });
  });
  
  describe('deletePost', () => {
    it('should delete a post when it exists', async () => {
      const existingPost = { id: 1, content: 'Test post' };
      
      PostModel.findById.mockResolvedValue(existingPost);
      PostModel.delete.mockResolvedValue(existingPost);
      
      const result = await PostService.deletePost(1);
      
      expect(PostModel.findById).toHaveBeenCalledWith(1);
      expect(PostModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(existingPost);
    });
    
    it('should throw an error when post does not exist', async () => {
      PostModel.findById.mockResolvedValue(null);
      
      await expect(PostService.deletePost(999))
        .rejects
        .toThrow('Post not found');
    });
  });
  
  describe('markAsBestAnswer', () => {
    it('should mark a post as best answer when it exists', async () => {
      const post = { id: 1, content: 'Test post' };
      const updatedPost = { id: 1, content: 'Test post', is_best_answer: true };
      
      PostModel.findById.mockResolvedValue(post);
      PostModel.markAsBestAnswer.mockResolvedValue(updatedPost);
      
      const result = await PostService.markAsBestAnswer(1);
      
      expect(PostModel.findById).toHaveBeenCalledWith(1);
      expect(PostModel.markAsBestAnswer).toHaveBeenCalledWith(1);
      expect(result).toEqual(updatedPost);
    });
    
    it('should throw an error when post does not exist', async () => {
      PostModel.findById.mockResolvedValue(null);
      
      await expect(PostService.markAsBestAnswer(999))
        .rejects
        .toThrow('Post not found');
    });
  });
});