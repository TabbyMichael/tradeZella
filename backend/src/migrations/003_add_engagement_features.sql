-- Add engagement features tables

-- Create reactions table for upvotes and emoji reactions
CREATE TABLE IF NOT EXISTS reactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'upvote', 'like', 'heart', 'laugh', 'surprised', 'sad', 'angry'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id, type),
  UNIQUE(user_id, thread_id, type),
  CHECK ((post_id IS NOT NULL AND thread_id IS NULL) OR (post_id IS NULL AND thread_id IS NOT NULL))
);

-- Create follows table for follow/subscribe system
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, followed_id)
);

-- Add user stats tracking columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS thread_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_thread_id ON reactions(thread_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(type);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed_id ON follows(followed_id);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp);