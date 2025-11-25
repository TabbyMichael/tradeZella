import { PostModel } from '../../../src/models/post.model.js';
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

describe('PostModel', () => {
  let mockClient;
  
  beforeEach(() => {
    // Reset call history but preserve mock implementations
    jest.clearAllMocks();
    
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    pool.connect.mockResolvedValue(mockClient);
  });
  
  describe('create', () => {
    it('should create a new post and increment reply count', async () => {
      const postData = {
        thread_id: 1,
        user_id: 1,
        parent_post_id: null,
        content: 'Test post content'
      };
      
      const expectedResult = {
        id: 1,
        ...postData,
        is_best_answer: false,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] });
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // For the reply count update
      
      const result = await PostModel.create(postData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        `INSERT INTO posts (thread_id, user_id, parent_post_id, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [postData.thread_id, postData.user_id, postData.parent_post_id, postData.content]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        `UPDATE threads
         SET reply_count = reply_count + 1, last_activity_at = NOW()
         WHERE id = $1`,
        [postData.thread_id]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findByThreadId', () => {
    it('should return all posts for a thread ordered by creation time', async () => {
      const posts = [
        { id: 1, content: 'First post', author_name: 'User 1' },
        { id: 2, content: 'Second post', author_name: 'User 2' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: posts });
      
      const result = await PostModel.findByThreadId(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT p.*, u.name as author_name
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.thread_id = $1
         ORDER BY p.created_at ASC`,
        [1]
      );
      expect(result).toEqual(posts);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a post by id with author info', async () => {
      const post = { id: 1, content: 'Test post', author_name: 'Test User' };
      
      mockClient.query.mockResolvedValue({ rows: [post] });
      
      const result = await PostModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT p.*, u.name as author_name
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`,
        [1]
      );
      expect(result).toEqual(post);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('should update a post content', async () => {
      const updateData = { content: 'Updated post content' };
      
      const updatedPost = {
        id: 1,
        thread_id: 1,
        user_id: 1,
        content: 'Updated post content',
        is_best_answer: false,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedPost] });
      
      const result = await PostModel.update(1, updateData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE posts
         SET content = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [updateData.content, 1]
      );
      expect(result).toEqual(updatedPost);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a post and decrement reply count', async () => {
      const deletedPost = { id: 1, thread_id: 1, content: 'Test post' };
      
      // Set up the mock to return values in the correct order
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ thread_id: 1 }] }) // For getting thread_id
        .mockResolvedValueOnce({ rows: [deletedPost] }) // For deleting post
        .mockResolvedValueOnce({ rows: [] }); // For decrementing reply count
      
      const result = await PostModel.delete(1);
      
      expect(pool.connect).toHaveBeenCalled();
      
      // Check the number of calls
      expect(mockClient.query).toHaveBeenCalledTimes(3);
      
      // Check that all the queries were called (using less strict matching)
      const calls = mockClient.query.mock.calls;
      expect(calls[0][0]).toBe('SELECT thread_id FROM posts WHERE id = $1');
      expect(calls[1][0]).toBe('DELETE FROM posts WHERE id = $1 RETURNING *');
      expect(calls[2][0]).toContain('UPDATE threads');
      expect(calls[2][0]).toContain('reply_count = GREATEST(reply_count - 1, 0)');
      
      expect(result).toEqual(deletedPost);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('markAsBestAnswer', () => {
    it('should mark a post as best answer and unmark others', async () => {
      const bestAnswerPost = {
        id: 1,
        thread_id: 1,
        content: 'Best answer',
        is_best_answer: true
      };
      
      // Set up the mock to return values in the correct order
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ thread_id: 1 }] }) // For getting thread_id
        .mockResolvedValueOnce({ rows: [] }) // For unmarking existing best answers
        .mockResolvedValueOnce({ rows: [bestAnswerPost] }); // For marking as best answer
      
      const result = await PostModel.markAsBestAnswer(1);
      
      expect(pool.connect).toHaveBeenCalled();
      
      // Check the number of calls
      expect(mockClient.query).toHaveBeenCalledTimes(3);
      
      // Check that all the queries were called (using less strict matching)
      const calls = mockClient.query.mock.calls;
      expect(calls[0][0]).toBe('SELECT thread_id FROM posts WHERE id = $1');
      expect(calls[1][0]).toContain('UPDATE posts');
      expect(calls[1][0]).toContain('SET is_best_answer = false');
      expect(calls[2][0]).toContain('UPDATE posts');
      expect(calls[2][0]).toContain('SET is_best_answer = true');
      
      expect(result).toEqual(bestAnswerPost);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});