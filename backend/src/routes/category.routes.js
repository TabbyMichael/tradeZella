import express from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

// Protected routes (admin only)
router.post('/', protect, CategoryController.createCategory);
router.put('/:id', protect, CategoryController.updateCategory);
router.delete('/:id', protect, CategoryController.deleteCategory);

export default router;