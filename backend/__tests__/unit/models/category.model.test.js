import { CategoryModel } from '../../../src/models/category.model.js';
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

describe('CategoryModel', () => {
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
    it('should return all categories ordered by display_order', async () => {
      const categories = [
        { id: 1, name: 'General', slug: 'general' },
        { id: 2, name: 'Trading', slug: 'trading' }
      ];
      
      mockClient.query.mockResolvedValue({ rows: categories });
      
      const result = await CategoryModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM categories ORDER BY display_order ASC, created_at DESC'
      );
      expect(result).toEqual(categories);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'General', slug: 'general' };
      
      mockClient.query.mockResolvedValue({ rows: [category] });
      
      const result = await CategoryModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM categories WHERE id = $1',
        [1]
      );
      expect(result).toEqual(category);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findBySlug', () => {
    it('should return a category by slug', async () => {
      const category = { id: 1, name: 'General', slug: 'general' };
      
      mockClient.query.mockResolvedValue({ rows: [category] });
      
      const result = await CategoryModel.findBySlug('general');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM categories WHERE slug = $1',
        ['general']
      );
      expect(result).toEqual(category);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'New Category',
        slug: 'new-category',
        description: 'A new category'
      };
      
      const createdCategory = {
        id: 1,
        ...categoryData,
        icon: null,
        display_order: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [createdCategory] });
      
      const result = await CategoryModel.create(categoryData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO categories (name, slug, description, icon, display_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [categoryData.name, categoryData.slug, categoryData.description, null, 0]
      );
      expect(result).toEqual(createdCategory);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('update', () => {
    it('should update a category', async () => {
      const updateData = { name: 'Updated Category', description: 'Updated description' };
      const updatedCategory = {
        id: 1,
        name: 'Updated Category',
        slug: 'general',
        description: 'Updated description',
        icon: null,
        display_order: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedCategory] });
      
      const result = await CategoryModel.update(1, updateData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE categories
         SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [updateData.name, updateData.description, 1]
      );
      expect(result).toEqual(updatedCategory);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a category', async () => {
      const deletedCategory = { id: 1, name: 'General', slug: 'general' };
      
      mockClient.query.mockResolvedValue({ rows: [deletedCategory] });
      
      const result = await CategoryModel.delete(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [1]
      );
      expect(result).toEqual(deletedCategory);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});