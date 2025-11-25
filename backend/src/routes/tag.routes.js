import express from 'express';
import { TagController } from '../controllers/tag.controller.js';

const router = express.Router();

// Public routes
router.get('/', TagController.getAllTags);
router.get('/:slug', TagController.getTagBySlug);
router.get('/thread/:threadId', TagController.getTagsByThreadId);

// Protected routes
router.post('/', TagController.createTag);

export default router;