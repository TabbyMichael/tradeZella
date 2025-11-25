import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.service.js';

const JWT_SECRET = process.env.NODE_ENV === 'test' ? 'test-secret' : process.env.JWT_SECRET;

export class AuthService {
  static async register({ email, password, name }) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await UserModel.create({ email, password, name });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }

  static async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }

  static async forgotPassword({ email }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await UserModel.updateResetToken(user.id, passwordResetToken, passwordResetExpires);

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // If email fails, we probably don't want to leave the token in the db
      await UserModel.updateResetToken(user.id, null, null);
      throw new Error('Error sending password reset email.');
    }
  }

  static async resetPassword({ token, password }) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserModel.findByResetToken(hashedToken);

    if (!user || new Date() > new Date(user.passwordResetExpires)) {
      throw new Error('Invalid or expired token.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updatePassword(user.id, hashedPassword);
    await UserModel.updateResetToken(user.id, null, null);
  }
}