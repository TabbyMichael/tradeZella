import { CategoryService } from '../../../src/services/category.service.js';
import { CategoryModel } from '../../../src/models/category.model.js';

// Clear any automatic mocks
jest.clearAllMocks();

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 1, name: 'General', slug: 'general' },
        { id: 2, name: 'Trading', slug: 'trading' }
      ];
      
      CategoryModel.findAll.mockResolvedValue(categories);
      
      const result = await CategoryService.getAllCategories();
      
      expect(CategoryModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });
  
  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'General', slug: 'general' };
      
      CategoryModel.findById.mockResolvedValue(category);
      
      const result = await CategoryService.getCategoryById(1);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(category);
    });
  });
  
  describe('getCategoryBySlug', () => {
    it('should return a category by slug', async () => {
      const category = { id: 1, name: 'General', slug: 'general' };
      
      CategoryModel.findBySlug.mockResolvedValue(category);
      
      const result = await CategoryService.getCategoryBySlug('general');
      
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith('general');
      expect(result).toEqual(category);
    });
  });
  
  describe('createCategory', () => {
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
      
      CategoryModel.findBySlug.mockResolvedValue(null);
      CategoryModel.create.mockResolvedValue(createdCategory);
      
      const result = await CategoryService.createCategory(categoryData);
      
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith('new-category');
      expect(CategoryModel.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(createdCategory);
    });
    
    it('should throw an error if name or slug is missing', async () => {
      await expect(CategoryService.createCategory({ description: 'No name or slug' }))
        .rejects
        .toThrow('Name and slug are required');
    });
    
    it('should throw an error if category with slug already exists', async () => {
      const categoryData = {
        name: 'Duplicate Category',
        slug: 'existing',
        description: 'Duplicate category'
      };
      
      const existingCategory = { id: 1, name: 'Existing', slug: 'existing' };
      
      CategoryModel.findBySlug.mockResolvedValue(existingCategory);
      
      await expect(CategoryService.createCategory(categoryData))
        .rejects
        .toThrow('Category with this slug already exists');
    });
  });
  
  describe('updateCategory', () => {
    it('should update a category', async () => {
      const existingCategory = { id: 1, name: 'Old Name', slug: 'old-slug' };
      const updateData = { name: 'New Name', slug: 'new-slug' };
      const updatedCategory = { id: 1, name: 'New Name', slug: 'new-slug' };
      
      CategoryModel.findById.mockResolvedValue(existingCategory);
      CategoryModel.findBySlug.mockResolvedValue(null);
      CategoryModel.update.mockResolvedValue(updatedCategory);
      
      const result = await CategoryService.updateCategory(1, updateData);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(CategoryModel.findBySlug).toHaveBeenCalledWith('new-slug');
      expect(CategoryModel.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedCategory);
    });
    
    it('should throw an error if category not found', async () => {
      CategoryModel.findById.mockResolvedValue(null);
      
      await expect(CategoryService.updateCategory(1, { name: 'New Name' }))
        .rejects
        .toThrow('Category not found');
    });
  });
  
  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const deletedCategory = { id: 1, name: 'To Delete', slug: 'to-delete' };
      
      CategoryModel.findById.mockResolvedValue(deletedCategory);
      CategoryModel.delete.mockResolvedValue(deletedCategory);
      
      const result = await CategoryService.deleteCategory(1);
      
      expect(CategoryModel.findById).toHaveBeenCalledWith(1);
      expect(CategoryModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deletedCategory);
    });
    
    it('should throw an error if category not found', async () => {
      CategoryModel.findById.mockResolvedValue(null);
      
      await expect(CategoryService.deleteCategory(1))
        .rejects
        .toThrow('Category not found');
    });
  });
});