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
  
  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category',
        icon: 'icon.png',
        display_order: 1
      };
      
      const expectedResult = {
        id: 1,
        ...categoryData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [expectedResult] });
      
      const result = await CategoryModel.create(categoryData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO categories (name, slug, description, icon, display_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [categoryData.name, categoryData.slug, categoryData.description, categoryData.icon, categoryData.display_order]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findAll', () => {
    it('should return all categories ordered by display_order', async () => {
      const categories = [
        { id: 1, name: 'Category 1', slug: 'cat-1', display_order: 1 },
        { id: 2, name: 'Category 2', slug: 'cat-2', display_order: 2 }
      ];
      
      mockClient.query.mockResolvedValue({ rows: categories });
      
      const result = await CategoryModel.findAll();
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM categories ORDER BY display_order ASC'
      );
      expect(result).toEqual(categories);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findBySlug', () => {
    it('should return a category by slug', async () => {
      const category = { id: 1, name: 'Test Category', slug: 'test-category' };
      
      mockClient.query.mockResolvedValue({ rows: [category] });
      
      const result = await CategoryModel.findBySlug('test-category');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM categories WHERE slug = $1',
        ['test-category']
      );
      expect(result).toEqual(category);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Test Category', slug: 'test-category' };
      
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
  
  describe('update', () => {
    it('should update a category', async () => {
      const updateData = {
        name: 'Updated Category',
        slug: 'updated-category',
        description: 'An updated category',
        icon: 'new-icon.png',
        display_order: 2
      };
      
      const updatedCategory = {
        id: 1,
        ...updateData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockClient.query.mockResolvedValue({ rows: [updatedCategory] });
      
      const result = await CategoryModel.update(1, updateData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        `UPDATE categories
         SET name = $1, slug = $2, description = $3, icon = $4, display_order = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [updateData.name, updateData.slug, updateData.description, updateData.icon, updateData.display_order, 1]
      );
      expect(result).toEqual(updatedCategory);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('delete', () => {
    it('should delete a category', async () => {
      const deletedCategory = { id: 1, name: 'Test Category', slug: 'test-category' };
      
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