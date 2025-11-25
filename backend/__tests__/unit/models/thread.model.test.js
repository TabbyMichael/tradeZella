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
  
  describe('findAll', () => {
    it('should return threads with default options', async () => {
      const threads = [
        { id: 1, title: 'First Thread', category_name: 'General', author_name: 'User1' },
        { id: 2, title: 'Second Thread', category_name: 'Trading', author_name: 'User2' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: threads });
      
      const result = await ThreadModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.*, c.name as category_name, u.name as author_name
         FROM threads t
         JOIN categories c ON t.category_id = c.id
         JOIN users u ON t.user_id = u.id
         ORDER BY t.last_activity_at DESC
         LIMIT $1 OFFSET $2`,
        [20, 0]
      );
      expect(result).toEqual(threads);
      expect(mockClient.release).toHaveBeenCalled();
    });
    
    it('should return threads with search filter', async () => {
      const threads = [
        { id: 1, title: 'Search Thread', category_name: 'General', author_name: 'User1' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: threads });
      
      const result = await ThreadModel.findAll({ search: 'search', limit: 10, offset: 0 });
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.*, c.name as category_name, u.name as author_name
         FROM threads t
         JOIN categories c ON t.category_id = c.id
         JOIN users u ON t.user_id = u.id
         WHERE 1=1 AND (t.search_vector @@ plainto_tsquery('english', $1) OR t.title ILIKE $2 OR t.content ILIKE $3)
         ORDER BY t.last_activity_at DESC
         LIMIT $4 OFFSET $5`,
        ['search', '%search%', '%search%', 10, 0]
      );
      expect(result).toEqual(threads);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a thread by id', async () => {
      const thread = { id: 1, title: 'Test Thread', category_name: 'General', author_name: 'User1' };
      
      mockClient.query.mockResolvedValue({ rows: [thread] });
      
      const result = await ThreadModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.*, c.name as category_name, u.name as author_name
         FROM threads t
         JOIN categories c ON t.category_id = c.id
         JOIN users u ON t.user_id = u.id
         WHERE t.id = $1`,
        [1]
      );
      expect(result).toEqual(thread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('count', () => {
    it('should return thread count', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ count: '5' }] });
      
      const result = await ThreadModel.count();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) FROM threads t',
        []
      );
      expect(result).toBe(5);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('create', () => {
    it('should create a new thread', async () => {
      const threadData = {
        category_id: 1,
        user_id: 1,
        title: 'New Thread',
        content: 'Thread content'
      };
      
      const createdThread = {
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
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [createdThread] })
        .mockResolvedValueOnce({ rows: [] }); // For category update
      
      const result = await ThreadModel.create(threadData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        `INSERT INTO threads (category_id, user_id, title, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [threadData.category_id, threadData.user_id, threadData.title, threadData.content]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        'UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [threadData.category_id]
      );
      expect(result).toEqual(createdThread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('should update a thread', async () => {
      const updateData = { title: 'Updated Thread', content: 'Updated content' };
      const updatedThread = {
        id: 1,
        category_id: 1,
        user_id: 1,
        title: 'Updated Thread',
        content: 'Updated content',
        is_pinned: false,
        is_locked: false,
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
         SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [updateData.title, updateData.content, 1]
      );
      expect(result).toEqual(updatedThread);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a thread', async () => {
      const deletedThread = { id: 1, title: 'Test Thread', category_id: 1, user_id: 1 };
      
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
  
  describe('incrementViewCount', () => {
    it('should increment thread view count', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });
      
      await ThreadModel.incrementViewCount(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE threads SET view_count = view_count + 1 WHERE id = $1',
        [1]
      );
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});