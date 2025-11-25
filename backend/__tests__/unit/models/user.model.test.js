import { UserModel } from '../../../src/models/user.model.js';
import { pool } from '../../../src/db.js';
import bcrypt from 'bcryptjs';

// Mock the pool and bcrypt
jest.mock('../../../src/db.js', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  
  return {
    pool: {
      connect: jest.fn(() => mockClient),
    },
  };
});

jest.mock('bcryptjs');

describe('UserModel', () => {
  let mockClient;
  
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    pool.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'plaintextPassword',
        name: 'Test User',
        googleId: null
      };
      
      const hashedPassword = 'hashedPassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      const expectedResult = {
        id: 1,
        ...userData,
        password: hashedPassword,
        role: 'user',
        is_banned: false
      };
      
      mockClient.query.mockResolvedValue({ rows: [expectedResult] });
      
      const result = await UserModel.create(userData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO users (email, password, googleId, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [userData.email, hashedPassword, userData.googleId, userData.name]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
    
    it('should create a user without password when using OAuth', async () => {
      const userData = {
        email: 'oauthuser@example.com',
        password: null,
        name: 'OAuth User',
        googleId: 'google123'
      };
      
      const expectedResult = {
        id: 2,
        ...userData,
        role: 'user',
        is_banned: false
      };
      
      mockClient.query.mockResolvedValue({ rows: [expectedResult] });
      
      const result = await UserModel.create(userData);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO users (email, password, googleId, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [userData.email, null, userData.googleId, userData.name]
      );
      expect(result).toEqual(expectedResult);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      
      mockClient.query.mockResolvedValue({ rows: [user] });
      
      const result = await UserModel.findByEmail('test@example.com');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(user);
      expect(mockClient.release).toHaveBeenCalled();
    });
    
    it('should return undefined when user is not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });
      
      const result = await UserModel.findByEmail('nonexistent@example.com');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['nonexistent@example.com']
      );
      expect(result).toBeUndefined();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      
      mockClient.query.mockResolvedValue({ rows: [user] });
      
      const result = await UserModel.findById(1);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = $1',
        [1]
      );
      expect(result).toEqual(user);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('updateResetToken', () => {
    it('should update password reset token and expiration', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      const token = 'resetToken123';
      const expires = new Date();
      
      mockClient.query.mockResolvedValue({ rows: [user] });
      
      const result = await UserModel.updateResetToken(1, token, expires);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE users SET passwordResetToken = $1, passwordResetExpires = $2 WHERE id = $3 RETURNING *',
        [token, expires, 1]
      );
      expect(result).toEqual(user);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('findByResetToken', () => {
    it('should return a user by reset token', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User', passwordResetToken: 'resetToken123' };
      
      mockClient.query.mockResolvedValue({ rows: [user] });
      
      const result = await UserModel.findByResetToken('resetToken123');
      
      expect(pool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE passwordResetToken = $1',
        ['resetToken123']
      );
      expect(result).toEqual(user);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  describe('updatePassword', () => {
    it('should update user password and clear reset token', async () => {
      const newPassword = 'newPassword123';
      const hashedPassword = 'hashedNewPassword123';
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockClient.query.mockResolvedValue({ rows: [user] });
      
      const result = await UserModel.updatePassword(1, newPassword);
      
      expect(pool.connect).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE users SET password = $1, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = $2 RETURNING *',
        [hashedPassword, 1]
      );
      expect(result).toEqual(user);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});