import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      const { user, token } = await AuthService.register({ email, password, name });
      res.status(201).json({ 
        success: true,
        data: { user: { id: user.id, email: user.email, name: user.name }, token } 
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login({ email, password });
      res.json({ 
        success: true,
        data: { user: { id: user.id, email: user.email, name: user.name }, token } 
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ 
          success: false,
          message: error.message 
        });
      }
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword({ email });
      res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword({ token, password });
      res.json({ 
        success: true,
        message: 'Password has been successfully reset.' 
      });
    } catch (error) {
      if (error.message === 'Invalid or expired token.') {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      next(error);
    }
  }
}