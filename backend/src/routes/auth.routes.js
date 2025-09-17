import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller.js';
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from '../middleware/validator.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', registerValidationRules(), validate, AuthController.register);
router.post('/login', loginValidationRules(), validate, AuthController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1h',
  });
  res.redirect(`http://localhost:5173/oauth/callback?token=${token}`);
});

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
