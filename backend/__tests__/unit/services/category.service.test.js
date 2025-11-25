import { CategoryService } from '../../../src/services/category.service.js';
import { CategoryModel } from '../../../src/models/category.model.js';

// Mock the CategoryModel
jest.mock('../../../src/models/category.model.js');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createCategory', () => {
    it('should create a new category when valid data is provided', async () => {
      const categoryData = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category'
      };
      
      const createdCategory = { id: 1, ...categoryData };
      
      CategoryModel.findBySlug.mockResolvedValue(null);
      CategoryModel.create.mockResolvedValue(createdCategory);
      
      const result = await CategoryService.createCategory(categoryData);
      
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith(categoryData.slug);
      expect(CategoryModel.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(createdCategory);
    });
    
    it('should throw an error when name is missing', async () => {
      const categoryData = {
        slug: 'test-category'
      };
      
      await expect(CategoryService.createCategory(categoryData))
        .rejects
        .toThrow('Name and slug are required');
    });
    
    it('should throw an error when slug is missing', async () => {
      const categoryData = {
        name: 'Test Category'
      };
      
      await expect(CategoryService.createCategory(categoryData))
        .rejects
        .toThrow('Name and slug are required');
    });
    
    it('should throw an error when category with slug already exists', async () => {
      const categoryData = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category'
      };
      
      const existingCategory = { id: 1, ...categoryData };
      
      CategoryModel.findBySlug.mockResolvedValue(existingCategory);
      
      await expect(CategoryService.createCategory(categoryData))
        .rejects
        .toThrow('Category with this slug already exists');
    });
  });
  
  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 1, name: 'Category 1', slug: 'cat-1' },
        { id: 2, name: 'Category 2', slug: 'cat-2' }
      ];
      
      CategoryModel.findAll.mockResolvedValue(categories);
      
      const result = await CategoryService.getAllCategories();
      
      expect(CategoryModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });
  
  describe('getCategoryBySlug', () => {
    it('should return a category by slug', async () => {
      const category = { id: 1, name: 'Test Category', slug: 'test-category' };
      
      CategoryModel.findBySlug.mockResolvedValue(category);
      
      const result = await CategoryService.getCategoryBySlug('test-category');
      
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith('test-category');
      expect(result).toEqual(category);
    });
  });
  
  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Test Category', slug: 'test-category' };
      
      CategoryModel.findById.mockResolvedValue(category);
      
      const result = await CategoryService.getCategoryById(1);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(category);
    });
  });
  
  describe('updateCategory', () => {
    it('should update a category when it exists', async () => {
      const existingCategory = { id: 1, name: 'Old Name', slug: 'old-slug' };
      const updateData = { name: 'New Name', slug: 'new-slug' };
      const updatedCategory = { id: 1, name: 'New Name', slug: 'new-slug' };
      
      CategoryModel.findById.mockResolvedValue(existingCategory);
      CategoryModel.findBySlug.mockResolvedValue(null);
      CategoryModel.update.mockResolvedValue(updatedCategory);
      
      const result = await CategoryService.updateCategory(1, updateData);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith(updateData.slug);
      expect(CategoryModel.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedCategory);
    });
    
    it('should throw an error when category does not exist', async () => {
      CategoryModel.findById.mockResolvedValue(null);
      
      await expect(CategoryService.updateCategory(999, { name: 'New Name' }))
        .rejects
        .toThrow('Category not found');
    });
    
    it('should throw an error when updating to an existing slug', async () => {
      const existingCategory = { id: 1, name: 'Old Name', slug: 'old-slug' };
      const updateData = { slug: 'existing-slug' };
      const conflictingCategory = { id: 2, name: 'Existing Category', slug: 'existing-slug' };
      
      CategoryModel.findById.mockResolvedValue(existingCategory);
      CategoryModel.findBySlug.mockResolvedValue(conflictingCategory);
      
      await expect(CategoryService.updateCategory(1, updateData))
        .rejects
        .toThrow('Category with this slug already exists');
    });
  });
  
  describe('deleteCategory', () => {
    it('should delete a category when it exists', async () => {
      const existingCategory = { id: 1, name: 'Test Category', slug: 'test-category' };
      
      CategoryModel.findById.mockResolvedValue(existingCategory);
      CategoryModel.delete.mockResolvedValue(existingCategory);
      
      const result = await CategoryService.deleteCategory(1);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(CategoryModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(existingCategory);
    });
    
    it('should throw an error when category does not exist', async () => {
      CategoryModel.findById.mockResolvedValue(null);
      
      await expect(CategoryService.deleteCategory(999))
        .rejects
        .toThrow('Category not found');
    });
  });
});