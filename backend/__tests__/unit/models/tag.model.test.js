import { TagModel } from '../../../src/models/tag.model.js';
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

describe('TagModel', () => {
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
    it('should return all tags ordered by usage count', async () => {
      const tags = [
        { id: 1, name: 'Trading', slug: 'trading', usage_count: 10 },
        { id: 2, name: 'Strategy', slug: 'strategy', usage_count: 5 }
      ];
      
      mockClient.query.mockResolvedValue({ rows: tags });
      
      const result = await TagModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags ORDER BY usage_count DESC, name ASC'
      );
      expect(result).toEqual(tags);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a tag by id', async () => {
      const tag = { id: 1, name: 'Trading', slug: 'trading', usage_count: 10 };
      
      mockClient.query.mockResolvedValue({ rows: [tag] });
      
      const result = await TagModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags WHERE id = $1',
        [1]
      );
      expect(result).toEqual(tag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findByName', () => {
    it('should return a tag by name', async () => {
      const tag = { id: 1, name: 'Trading', slug: 'trading', usage_count: 10 };
      
      mockClient.query.mockResolvedValue({ rows: [tag] });
      
      const result = await TagModel.findByName('Trading');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags WHERE name = $1',
        ['Trading']
      );
      expect(result).toEqual(tag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findBySlug', () => {
    it('should return a tag by slug', async () => {
      const tag = { id: 1, name: 'Trading', slug: 'trading', usage_count: 10 };
      
      mockClient.query.mockResolvedValue({ rows: [tag] });
      
      const result = await TagModel.findBySlug('trading');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags WHERE slug = $1',
        ['trading']
      );
      expect(result).toEqual(tag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('create', () => {
    it('should create a new tag', async () => {
      const tagData = {
        name: 'New Tag',
        slug: 'new-tag'
      };
      
      const createdTag = {
        id: 1,
        ...tagData,
        usage_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [createdTag] });
      
      const result = await TagModel.create(tagData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO tags (name, slug)
         VALUES ($1, $2)
         RETURNING *`,
        [tagData.name, tagData.slug]
      );
      expect(result).toEqual(createdTag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('should update a tag', async () => {
      const updateData = { name: 'Updated Tag', slug: 'updated-tag' };
      const updatedTag = {
        id: 1,
        name: 'Updated Tag',
        slug: 'updated-tag',
        usage_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedTag] });
      
      const result = await TagModel.update(1, updateData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE tags
         SET name = $1, slug = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [updateData.name, updateData.slug, 1]
      );
      expect(result).toEqual(updatedTag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a tag', async () => {
      const deletedTag = { id: 1, name: 'Test Tag', slug: 'test-tag', usage_count: 0 };
      
      mockClient.query.mockResolvedValue({ rows: [deletedTag] });
      
      const result = await TagModel.delete(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM tags WHERE id = $1 RETURNING *',
        [1]
      );
      expect(result).toEqual(deletedTag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('getTagsForThread', () => {
    it('should return tags for a thread', async () => {
      const tags = [
        { id: 1, name: 'Trading', slug: 'trading' },
        { id: 2, name: 'Strategy', slug: 'strategy' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: tags });
      
      const result = await TagModel.getTagsForThread(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.* FROM tags t
         JOIN thread_tags tt ON t.id = tt.tag_id
         WHERE tt.thread_id = $1
         ORDER BY t.name ASC`,
        [1]
      );
      expect(result).toEqual(tags);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('addTagToThread', () => {
    it('should add a tag to a thread and increment usage count', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ thread_id: 1, tag_id: 1 }], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [] });
      
      const result = await TagModel.addTagToThread(1, 1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        `INSERT INTO thread_tags (thread_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT (thread_id, tag_id) DO NOTHING
         RETURNING *`,
        [1, 1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        'UPDATE tags SET usage_count = usage_count + 1 WHERE id = $1',
        [1]
      );
      expect(result).toEqual({ thread_id: 1, tag_id: 1 });
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('removeTagFromThread', () => {
    it('should remove a tag from a thread and decrement usage count', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ thread_id: 1, tag_id: 1 }], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [] });
      
      const result = await TagModel.removeTagFromThread(1, 1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        'DELETE FROM thread_tags WHERE thread_id = $1 AND tag_id = $2 RETURNING *',
        [1, 1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        'UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = $1',
        [1]
      );
      expect(result).toEqual({ thread_id: 1, tag_id: 1 });
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});