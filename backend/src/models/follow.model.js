import { pool } from '../db.js';

export class FollowModel {
  static async followUser(follower_id, followed_id) {
    const client = await pool.connect();
    try {
      console.log(`[FollowModel.followUser] Attempting to follow: follower_id=${follower_id}, followed_id=${followed_id}`);
      // Check if both users exist
      const usersExist = await client.query(
        'SELECT COUNT(*) as count FROM users WHERE id = $1 OR id = $2',
        [follower_id, followed_id]
      );
      if (parseInt(usersExist.rows[0].count) !== 2) {
        console.error(`[FollowModel.followUser] One or both users not found: follower_id=${follower_id}, followed_id=${followed_id}`);
        throw new Error('One or both users not found.');
      }

      // Check if already following
      const existing = await client.query(
        'SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2',
        [follower_id, followed_id]
      );
      
      if (existing.rows.length > 0) {
        return existing.rows[0]; // Already following
      }
      
      // Create follow relationship
      const result = await client.query(
        `INSERT INTO follows (follower_id, followed_id)
         VALUES ($1, $2)
         RETURNING *`,
        [follower_id, followed_id]
      );
      
      // Update user stats
      await client.query(
        `UPDATE users 
         SET follower_count = follower_count + 1
         WHERE id = $1`,
        [followed_id]
      );
      
      await client.query(
        `UPDATE users 
         SET following_count = following_count + 1
         WHERE id = $1`,
        [follower_id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async unfollowUser(follower_id, followed_id) {
    const client = await pool.connect();
    try {
      console.log(`[FollowModel.unfollowUser] Attempting to unfollow: follower_id=${follower_id}, followed_id=${followed_id}`);
      // Check if both users exist
      const usersExist = await client.query(
        'SELECT COUNT(*) as count FROM users WHERE id = $1 OR id = $2',
        [follower_id, followed_id]
      );
      if (parseInt(usersExist.rows[0].count) !== 2) {
        console.error(`[FollowModel.unfollowUser] One or both users not found: follower_id=${follower_id}, followed_id=${followed_id}`);
        throw new Error('One or both users not found.');
      }

      const result = await client.query(
        `DELETE FROM follows 
         WHERE follower_id = $1 AND followed_id = $2
         RETURNING *`,
        [follower_id, followed_id]
      );
      
      // Update user stats only if unfollow was successful
      if (result.rows.length > 0) {
        await client.query(
          `UPDATE users 
           SET follower_count = GREATEST(follower_count - 1, 0)
           WHERE id = $1`,
          [followed_id]
        );
        
        await client.query(
          `UPDATE users 
           SET following_count = GREATEST(following_count - 1, 0)
           WHERE id = $1`,
          [follower_id]
        );
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getFollowers(user_id, limit = 50, offset = 0) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT u.id, u.name, u.avatar_url, u.bio, f.created_at as followed_at
         FROM follows f
         JOIN users u ON f.follower_id = u.id
         WHERE f.followed_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [user_id, limit, offset]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getFollowing(user_id, limit = 50, offset = 0) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT u.id, u.name, u.avatar_url, u.bio, f.created_at as followed_at
         FROM follows f
         JOIN users u ON f.followed_id = u.id
         WHERE f.follower_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [user_id, limit, offset]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async isFollowing(follower_id, followed_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2',
        [follower_id, followed_id]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  static async getFollowerCount(user_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT follower_count FROM users WHERE id = $1',
        [user_id]
      );
      return result.rows[0] ? result.rows[0].follower_count : 0;
    } finally {
      client.release();
    }
  }

  static async getFollowingCount(user_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT following_count FROM users WHERE id = $1',
        [user_id]
      );
      return result.rows[0] ? result.rows[0].following_count : 0;
    } finally {
      client.release();
    }
  }
}