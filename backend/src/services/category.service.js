import { CategoryModel } from '../models/category.model.js';

export class CategoryService {
  static async createCategory(data) {
    // Validate required fields
    if (!data.name || !data.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if category with same slug already exists
    const existingCategory = await CategoryModel.findBySlug(data.slug);
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }
    
    return await CategoryModel.create(data);
  }

  static async getAllCategories() {
    return await CategoryModel.findAll();
  }

  static async getCategoryBySlug(slug) {
    return await CategoryModel.findBySlug(slug);
  }

  static async getCategoryById(id) {
    return await CategoryModel.findById(id);
  }

  static async updateCategory(id, data) {
    // Check if category exists
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }
    
    // If slug is being updated, check if another category already has this slug
    if (data.slug && data.slug !== existingCategory.slug) {
      const categoryWithSlug = await CategoryModel.findBySlug(data.slug);
      if (categoryWithSlug) {
        throw new Error('Category with this slug already exists');
      }
    }
    
    return await CategoryModel.update(id, data);
  }

  static async deleteCategory(id) {
    // Check if category exists
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }
    
    return await CategoryModel.delete(id);
  }
}