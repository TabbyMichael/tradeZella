import { ReactionModel } from './src/models/reaction.model.js';
import { pool } from './src/db.js';

async function testReactions() {
  const client = await pool.connect();
  
  try {
    // Create a test user
    const userResult = await client.query(
      `INSERT INTO users (email, name, role) 
       VALUES ('test@example.com', 'Test User', 'user') 
       RETURNING *`
    );
    const userId = userResult.rows[0].id;
    
    // Create a test category
    const categoryResult = await client.query(
      `INSERT INTO categories (name, slug, description) 
       VALUES ('Test Category', 'test-category', 'A test category') 
       RETURNING *`
    );
    const categoryId = categoryResult.rows[0].id;
    
    // Create a test thread
    const threadResult = await client.query(
      `INSERT INTO threads (category_id, user_id, title, content) 
       VALUES ($1, $2, 'Test Thread', 'Test content') 
       RETURNING *`,
      [categoryId, userId]
    );
    const threadId = threadResult.rows[0].id;
    
    console.log('Created test data:');
    console.log('User ID:', userId);
    console.log('Category ID:', categoryId);
    console.log('Thread ID:', threadId);
    
    // Try to create a reaction
    try {
      const reaction = await ReactionModel.createReaction({
        user_id: userId,
        post_id: null,
        thread_id: threadId,
        type: 'like'
      });
      console.log('Reaction created successfully:', reaction);
    } catch (error) {
      console.error('Error creating reaction:', error.message);
      console.error('Error stack:', error.stack);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    // Clean up
    await client.query('DELETE FROM reactions');
    await client.query('DELETE FROM threads');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM users');
    client.release();
    process.exit(0);
  }
}

testReactions();