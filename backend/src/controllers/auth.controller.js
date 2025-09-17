import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token } = await AuthService.register({ email, password });
      res.status(201).json({ token });
    } catch (error) {
      if (error.message === 'User already exists.') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token } = await AuthService.login({ email, password });
      res.json({ token });
    } catch (error) {
      if (error.message === 'Invalid credentials.') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword({ email });
      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword({ token, password });
      res.json({ message: 'Password has been successfully reset.' });
    } catch (error) {
      if (error.message === 'Invalid or expired token.') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
}
