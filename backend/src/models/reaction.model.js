import { pool } from '../db.js';

export class ReactionModel {
  static async createReaction(reactionData) {
    const client = await pool.connect();
    try {
      const { user_id, post_id, thread_id, type } = reactionData;
      
      // Check if reaction already exists
      const existing = await client.query(
        `SELECT * FROM reactions 
         WHERE user_id = $1 AND post_id = $2 AND thread_id = $3 AND type = $4`,
        [user_id, post_id, thread_id, type]
      );
      
      if (existing.rows.length > 0) {
        return existing.rows[0]; // Already exists
      }
      
      const result = await client.query(
        `INSERT INTO reactions (user_id, post_id, thread_id, type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, post_id, thread_id, type]
      );
      
      // Update user stats
      if (type === 'upvote') {
        if (post_id) {
          await client.query(
            `UPDATE users 
             SET upvote_count = upvote_count + 1
             WHERE id = (SELECT user_id FROM posts WHERE id = $1)`,
            [post_id]
          );
        } else if (thread_id) {
          await client.query(
            `UPDATE users 
             SET upvote_count = upvote_count + 1
             WHERE id = (SELECT user_id FROM threads WHERE id = $1)`,
            [thread_id]
          );
        }
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating reaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async removeReaction(reactionData) {
    const client = await pool.connect();
    try {
      const { user_id, post_id, thread_id, type } = reactionData;
      const result = await client.query(
        `DELETE FROM reactions 
         WHERE user_id = $1 AND (($2 IS NULL AND thread_id = $3) OR ($3 IS NULL AND post_id = $2)) AND type = $4
         RETURNING *`,
        [user_id, post_id, thread_id, type]
      );
      
      // Update user stats
      if (result.rows[0] && result.rows[0].type === 'upvote') {
        if (result.rows[0].post_id) {
          await client.query(
            `UPDATE users 
             SET upvote_count = GREATEST(upvote_count - 1, 0)
             WHERE id = (SELECT user_id FROM posts WHERE id = $1)`,
            [result.rows[0].post_id]
          );
        } else if (result.rows[0].thread_id) {
          await client.query(
            `UPDATE users 
             SET upvote_count = GREATEST(upvote_count - 1, 0)
             WHERE id = (SELECT user_id FROM threads WHERE id = $1)`,
            [result.rows[0].thread_id]
          );
        }
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getReactionsForPost(post_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT r.*, u.name as user_name
         FROM reactions r
         JOIN users u ON r.user_id = u.id
         WHERE r.post_id = $1
         ORDER BY r.created_at DESC`,
        [post_id]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getReactionsForThread(thread_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT r.*, u.name as user_name
         FROM reactions r
         JOIN users u ON r.user_id = u.id
         WHERE r.thread_id = $1
         ORDER BY r.created_at DESC`,
        [thread_id]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getUserReaction(user_id, post_id, thread_id, type) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM reactions 
         WHERE user_id = $1 AND (($2 IS NULL AND thread_id = $3) OR ($3 IS NULL AND post_id = $2)) AND type = $4`,
        [user_id, post_id, thread_id, type]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getReactionCounts(post_id, thread_id) {
    const client = await pool.connect();
    try {
      // Handle the case where one of the IDs might be null
      let result;
      if (post_id) {
        result = await client.query(
          `SELECT type, COUNT(*) as count
           FROM reactions
           WHERE post_id = $1
           GROUP BY type`,
          [post_id]
        );
      } else if (thread_id) {
        result = await client.query(
          `SELECT type, COUNT(*) as count
           FROM reactions
           WHERE thread_id = $1
           GROUP BY type`,
          [thread_id]
        );
      } else {
        result = { rows: [] };
      }
      return result.rows;
    } finally {
      client.release();
    }
  }
}