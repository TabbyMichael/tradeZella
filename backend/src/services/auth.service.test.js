import { AuthService } from './auth.service.js';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({ id: 1, email: 'test@example.com' });
      jwt.sign.mockReturnValue('test_token');

      const result = await AuthService.register({ email: 'test@example.com', password: 'password123' });

      expect(result).toEqual({ token: 'test_token' });
    });

    it('should throw an error if the user already exists', async () => {
      UserModel.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(AuthService.register({ email: 'test@example.com', password: 'password123' })).rejects.toThrow('User already exists.');
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' };
      UserModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test_token');

      const result = await AuthService.login({ email: 'test@example.com', password: 'password123' });

      expect(result).toEqual({ token: 'test_token' });
    });

    it('should throw an error for invalid credentials', async () => {
      UserModel.findByEmail.mockResolvedValue(null);

      await expect(AuthService.login({ email: 'test@example.com', password: 'password123' })).rejects.toThrow('Invalid credentials.');
    });

    it('should throw an error for an incorrect password', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' };
      UserModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(AuthService.login({ email: 'test@example.com', password: 'wrongpassword' })).rejects.toThrow('Invalid credentials.');
    });
  });
});
