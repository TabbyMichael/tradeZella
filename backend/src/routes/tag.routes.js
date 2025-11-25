import { Router } from 'express';
import { TagController } from '../controllers/tag.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.route('/')
  .get(TagController.getTags);

router.route('/:id')
  .get(TagController.getTag);

// Thread-specific routes
router.route('/thread/:thread_id')
  .get(TagController.getTagsForThread);

// Protected routes
router.use(protect);
router.route('/')
  .post(TagController.createTag);

router.route('/:id')
  .put(TagController.updateTag)
  .delete(TagController.deleteTag);

router.route('/thread/:thread_id/tag')
  .post(TagController.addTagToThread);

router.route('/thread/:thread_id/tag/:tag_id')
  .delete(TagController.removeTagFromThread);

export default router;