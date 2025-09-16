import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from '../middleware/validator.js';

const router = Router();

router.post('/register', registerValidationRules(), validate, AuthController.register);
router.post('/login', loginValidationRules(), validate, AuthController.login);

export default router;
