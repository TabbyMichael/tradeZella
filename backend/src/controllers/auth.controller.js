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
}
