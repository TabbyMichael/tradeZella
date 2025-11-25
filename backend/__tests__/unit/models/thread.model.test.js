import { ThreadModel } from '../../../src/models/thread.model.js';
import { pool } from '../../../src/db.js';

// Mock the pool
jest.mock('../../../src/db.js', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  
  return {
    pool: {
      connect: jest.fn(() => mockClient),
    },
  };
});

describe('ThreadModel', () => {
  let mockClient;
  
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    pool.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('should create a new thread', async () => {
      const threadData = {
        category_id: 1,
        user_id: 1,
        title: 'Test Thread',
        content: 'Test content'
      };
      
      const expectedResult = {
        id: 1,
        ...threadData,
        is_pinned: false,
        is_locked: false,
        view_count: 0,
        reply_count: 0,
        last_activity_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [expectedResult] });
      
      const result = await ThreadModel.create(threadData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO threads (category_id, user_id, title, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [threadData.category_id, threadData.user_id, threadData.title, threadData.content]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findAll', () => {
    it('should return all threads with default query', async () => {
      const threads = [
        { id: 1, title: 'Thread 1', author_name: 'User 1', category_name: 'Category 1' },
        { id: 2, title: 'Thread 2', author_name: 'User 2', category_name: 'Category 2' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: threads });
      
      const result = await ThreadModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `
        SELECT t.*, u.name as author_name, c.name as category_name
        FROM threads t
        JOIN users u ON t.user_id = u.id
        JOIN categories c ON t.category_id = c.id
       ORDER BY t.created_at DESC`,
        []
      );
      expect(result).toEqual(threads);
      expect(mockClient.release).toHaveBeenCalled();
    });
    
    it('should apply filters when provided', async () => {
      const threads = [{ id: 1, title: 'Filtered Thread' }];
      
      mockClient.query.mockResolvedValue({ rows: threads });
      
      const filters = { category_id: 1, user_id: 1, limit: 10 };
      const result = await ThreadModel.findAll(filters);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `
        SELECT t.*, u.name as author_name, c.name as category_name
        FROM threads t
        JOIN users u ON t.user_id = u.id
        JOIN categories c ON t.category_id = c.id
       WHERE t.category_id = $1 AND t.user_id = $2 ORDER BY t.created_at DESC LIMIT $3`,
        [1, 1, 10]
      );
      expect(result).toEqual(threads);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a thread by id with author and category info', async () => {
      const thread = { 
        id: 1, 
        title: 'Test Thread', 
        author_name: 'Test User', 
        category_name: 'Test Category' 
      };
      
      mockClient.query.mockResolvedValue({ rows: [thread] });
      
      const result = await ThreadModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.*, u.name as author_name, c.name as category_name
         FROM threads t
         JOIN users u ON t.user_id = u.id
         JOIN categories c ON t.category_id = c.id
         WHERE t.id = $1`,
        [1]
      );
      expect(result).toEqual(thread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('should update a thread', async () => {
      const updateData = {
        title: 'Updated Thread',
        content: 'Updated content',
        is_pinned: true,
        is_locked: false
      };
      
      const updatedThread = {
        id: 1,
        category_id: 1,
        user_id: 1,
        ...updateData,
        view_count: 0,
        reply_count: 0,
        last_activity_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedThread] });
      
      const result = await ThreadModel.update(1, updateData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE threads
         SET title = $1, content = $2, is_pinned = $3, is_locked = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [updateData.title, updateData.content, updateData.is_pinned, updateData.is_locked, 1]
      );
      expect(result).toEqual(updatedThread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('incrementViewCount', () => {
    it('should increment the view count and update last activity', async () => {
      const updatedThread = {
        id: 1,
        title: 'Test Thread',
        view_count: 1,
        last_activity_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedThread] });
      
      const result = await ThreadModel.incrementViewCount(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE threads
         SET view_count = view_count + 1, last_activity_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [1]
      );
      expect(result).toEqual(updatedThread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a thread', async () => {
      const deletedThread = { id: 1, title: 'Test Thread' };
      
      mockClient.query.mockResolvedValue({ rows: [deletedThread] });
      
      const result = await ThreadModel.delete(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM threads WHERE id = $1 RETURNING *',
        [1]
      );
      expect(result).toEqual(deletedThread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});