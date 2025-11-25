import { ThreadService } from '../../../src/services/thread.service.js';
import { ThreadModel } from '../../../src/models/thread.model.js';
import { PostModel } from '../../../src/models/post.model.js';
import { TagModel } from '../../../src/models/tag.model.js';

// Mock the models
jest.mock('../../../src/models/thread.model.js');
jest.mock('../../../src/models/post.model.js');
jest.mock('../../../src/models/tag.model.js');

describe('ThreadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createThread', () => {
    it('should create a new thread when valid data is provided', async () => {
      const threadData = {
        category_id: 1,
        user_id: 1,
        title: 'Test Thread',
        content: 'Test content'
      };
      
      const createdThread = { id: 1, ...threadData };
      
      ThreadModel.create.mockResolvedValue(createdThread);
      
      const result = await ThreadService.createThread(threadData);
      
      expect(ThreadModel.create).toHaveBeenCalledWith(threadData);
      expect(result).toEqual(createdThread);
    });
    
    it('should throw an error when required fields are missing', async () => {
      const threadData = {
        title: 'Test Thread'
      };
      
      await expect(ThreadService.createThread(threadData))
        .rejects
        .toThrow('Category ID, user ID, title, and content are required');
    });
  });
  
  describe('getAllThreads', () => {
    it('should return all threads with filters', async () => {
      const threads = [
        { id: 1, title: 'Thread 1' },
        { id: 2, title: 'Thread 2' }
      ];
      
      const filters = { category_id: 1 };
      
      ThreadModel.findAll.mockResolvedValue(threads);
      
      const result = await ThreadService.getAllThreads(filters);
      
      expect(ThreadModel.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(threads);
    });
  });
  
  describe('getThreadById', () => {
    it('should return a thread with its posts and tags', async () => {
      const thread = { id: 1, title: 'Test Thread' };
      const posts = [{ id: 1, content: 'Test post' }];
      const tags = [{ id: 1, name: 'test-tag' }];
      
      ThreadModel.findById.mockResolvedValue(thread);
      PostModel.findByThreadId.mockResolvedValue(posts);
      TagModel.findByThreadId.mockResolvedValue(tags);
      
      const result = await ThreadService.getThreadById(1);
      
      expect(ThreadModel.findById).toHaveBeenCalledWith(1);
      expect(PostModel.findByThreadId).toHaveBeenCalledWith(1);
      expect(TagModel.findByThreadId).toHaveBeenCalledWith(1);
      expect(result).toEqual({ ...thread, posts, tags });
    });
    
    it('should throw an error when thread is not found', async () => {
      ThreadModel.findById.mockResolvedValue(null);
      
      await expect(ThreadService.getThreadById(999))
        .rejects
        .toThrow('Thread not found');
    });
  });
  
  describe('updateThread', () => {
    it('should update a thread when it exists', async () => {
      const existingThread = { id: 1, title: 'Old Title' };
      const updateData = { title: 'New Title' };
      const updatedThread = { id: 1, title: 'New Title' };
      
      ThreadModel.findById.mockResolvedValue(existingThread);
      ThreadModel.update.mockResolvedValue(updatedThread);
      
      const result = await ThreadService.updateThread(1, updateData);
      
      expect(ThreadModel.findById).toHaveBeenCalledWith(1);
      expect(ThreadModel.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedThread);
    });
    
    it('should throw an error when thread does not exist', async () => {
      ThreadModel.findById.mockResolvedValue(null);
      
      await expect(ThreadService.updateThread(999, { title: 'New Title' }))
        .rejects
        .toThrow('Thread not found');
    });
  });
  
  describe('incrementViewCount', () => {
    it('should increment view count when thread exists', async () => {
      const thread = { id: 1, title: 'Test Thread', view_count: 1 };
      
      ThreadModel.findById.mockResolvedValue(thread);
      ThreadModel.incrementViewCount.mockResolvedValue({ ...thread, view_count: 2 });
      
      const result = await ThreadService.incrementViewCount(1);
      
      expect(ThreadModel.findById).toHaveBeenCalledWith(1);
      expect(ThreadModel.incrementViewCount).toHaveBeenCalledWith(1);
      expect(result.view_count).toBe(2);
    });
    
    it('should throw an error when thread does not exist', async () => {
      ThreadModel.findById.mockResolvedValue(null);
      
      await expect(ThreadService.incrementViewCount(999))
        .rejects
        .toThrow('Thread not found');
    });
  });
  
  describe('deleteThread', () => {
    it('should delete a thread when it exists', async () => {
      const existingThread = { id: 1, title: 'Test Thread' };
      
      ThreadModel.findById.mockResolvedValue(existingThread);
      ThreadModel.delete.mockResolvedValue(existingThread);
      
      const result = await ThreadService.deleteThread(1);
      
      expect(ThreadModel.findById).toHaveBeenCalledWith(1);
      expect(ThreadModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(existingThread);
    });
    
    it('should throw an error when thread does not exist', async () => {
      ThreadModel.findById.mockResolvedValue(null);
      
      await expect(ThreadService.deleteThread(999))
        .rejects
        .toThrow('Thread not found');
    });
  });
});