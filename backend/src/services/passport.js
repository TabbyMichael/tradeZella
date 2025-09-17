import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getDb } from '../db.js';
import { UserModel } from '../models/user.model.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE id = ?', id);
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    try {
      let user = await UserModel.findByEmail(email);
      if (!user) {
        user = await UserModel.create({ email, googleId: profile.id, name: profile.displayName });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));
