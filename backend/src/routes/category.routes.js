import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.route('/')
  .get(CategoryController.getCategories);

router.route('/:id')
  .get(CategoryController.getCategory);

// Protected routes (admin only)
router.use(protect);
router.route('/')
  .post(CategoryController.createCategory);

router.route('/:id')
  .put(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

export default router;