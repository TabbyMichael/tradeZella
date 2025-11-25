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
  
  describe('create', () => {
    it('should create a new tag', async () => {
      const tagData = {
        name: 'Test Tag',
        slug: 'test-tag'
      };
      
      const expectedResult = {
        id: 1,
        ...tagData,
        usage_count: 0
      };
      
      mockClient.query.mockResolvedValue({ rows: [expectedResult] });
      
      const result = await TagModel.create(tagData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO tags (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET usage_count = tags.usage_count
         RETURNING *`,
        [tagData.name, tagData.slug]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findAll', () => {
    it('should return all tags ordered by usage count', async () => {
      const tags = [
        { id: 1, name: 'Popular Tag', slug: 'popular-tag', usage_count: 10 },
        { id: 2, name: 'Less Used Tag', slug: 'less-used-tag', usage_count: 2 }
      ];
      
      mockClient.query.mockResolvedValue({ rows: tags });
      
      const result = await TagModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags ORDER BY usage_count DESC'
      );
      expect(result).toEqual(tags);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findBySlug', () => {
    it('should return a tag by slug', async () => {
      const tag = { id: 1, name: 'Test Tag', slug: 'test-tag', usage_count: 0 };
      
      mockClient.query.mockResolvedValue({ rows: [tag] });
      
      const result = await TagModel.findBySlug('test-tag');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM tags WHERE slug = $1',
        ['test-tag']
      );
      expect(result).toEqual(tag);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findByThreadId', () => {
    it('should return all tags for a thread', async () => {
      const tags = [
        { id: 1, name: 'Tag 1', slug: 'tag-1' },
        { id: 2, name: 'Tag 2', slug: 'tag-2' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: tags });
      
      const result = await TagModel.findByThreadId(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `SELECT t.*
         FROM tags t
         JOIN thread_tags tt ON t.id = tt.tag_id
         WHERE tt.thread_id = $1`,
        [1]
      );
      expect(result).toEqual(tags);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('addTagToThread', () => {
    it('should associate a tag with a thread and increment usage count', async () => {
      const association = { thread_id: 1, tag_id: 1 };
      
      mockClient.query.mockResolvedValueOnce({ rows: [association] }); // For association
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // For incrementing usage count
      
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
        `UPDATE tags
         SET usage_count = usage_count + 1
         WHERE id = $1`,
        [1]
      );
      expect(result).toEqual(association);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('removeTagFromThread', () => {
    it('should remove tag association from thread and decrement usage count', async () => {
      const association = { thread_id: 1, tag_id: 1 };
      
      mockClient.query.mockResolvedValueOnce({ rows: [association] }); // For removal
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // For decrementing usage count
      
      const result = await TagModel.removeTagFromThread(1, 1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenNthCalledWith(
        1,
        `DELETE FROM thread_tags
         WHERE thread_id = $1 AND tag_id = $2
         RETURNING *`,
        [1, 1]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        `UPDATE tags
         SET usage_count = GREATEST(usage_count - 1, 0)
         WHERE id = $1`,
        [1]
      );
      expect(result).toEqual(association);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});