import { CategoryModel } from '../models/category.model.js';

export class CategoryService {
  static async getAllCategories() {
    return await CategoryModel.findAll();
  }

  static async getCategoryById(id) {
    return await CategoryModel.findById(id);
  }

  static async getCategoryBySlug(slug) {
    return await CategoryModel.findBySlug(slug);
  }

  static async createCategory(categoryData) {
    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if slug already exists
    const existingCategory = await CategoryModel.findBySlug(categoryData.slug);
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }
    
    return await CategoryModel.create(categoryData);
  }

  static async updateCategory(id, categoryData) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Check if slug already exists (if being updated)
    if (categoryData.slug && categoryData.slug !== category.slug) {
      const existingCategory = await CategoryModel.findBySlug(categoryData.slug);
      if (existingCategory) {
        throw new Error('Category with this slug already exists');
      }
    }
    
    return await CategoryModel.update(id, categoryData);
  }

  static async deleteCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    return await CategoryModel.delete(id);
  }
}