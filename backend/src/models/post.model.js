import { pool } from '../db.js';

export class PostModel {
  static async create({ thread_id, user_id, parent_post_id, content }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO posts (thread_id, user_id, parent_post_id, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [thread_id, user_id, parent_post_id, content]
      );
      
      // Update the reply count in the thread
      await client.query(
        `UPDATE threads
         SET reply_count = reply_count + 1, last_activity_at = NOW()
         WHERE id = $1`,
        [thread_id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByThreadId(thread_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT p.*, u.name as author_name
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.thread_id = $1
         ORDER BY p.created_at ASC`,
        [thread_id]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT p.*, u.name as author_name
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, { content }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE posts
         SET content = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [content, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      // Get the thread_id before deleting the post
      const postResult = await client.query('SELECT thread_id FROM posts WHERE id = $1', [id]);
      const thread_id = postResult.rows[0]?.thread_id;
      
      const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
      
      // Decrement the reply count in the thread
      if (thread_id) {
        await client.query(
          `UPDATE threads
           SET reply_count = GREATEST(reply_count - 1, 0)
           WHERE id = $1`,
          [thread_id]
        );
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async markAsBestAnswer(id) {
    const client = await pool.connect();
    try {
      // First unmark any existing best answers for this thread
      const postResult = await client.query('SELECT thread_id FROM posts WHERE id = $1', [id]);
      const thread_id = postResult.rows[0]?.thread_id;
      
      if (thread_id) {
        await client.query(
          `UPDATE posts
           SET is_best_answer = false
           WHERE thread_id = $1`,
          [thread_id]
        );
      }
      
      // Mark this post as the best answer
      const result = await client.query(
        `UPDATE posts
         SET is_best_answer = true
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}