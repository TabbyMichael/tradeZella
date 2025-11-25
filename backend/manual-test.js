import express from 'express';
import { FollowService } from './src/services/follow.service.js';
import { ReactionService } from './src/services/reaction.service.js';
import { pool } from './src/db.js';

async function runManualTest() {
  console.log('Starting manual test...');
  
  const client = await pool.connect();
  
  try {
    // Clear any existing test data
    await client.query('DELETE FROM reactions');
    await client.query('DELETE FROM follows');
    await client.query('DELETE FROM posts');
    await client.query('DELETE FROM threads');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM users');
    
    // Create test users
    const user1Result = await client.query(
      `INSERT INTO users (email, name, role) 
       VALUES ('user1@example.com', 'User One', 'user') 
       RETURNING *`
    );
    const user1 = user1Result.rows[0];
    
    const user2Result = await client.query(
      `INSERT INTO users (email, name, role) 
       VALUES ('user2@example.com', 'User Two', 'user') 
       RETURNING *`
    );
    const user2 = user2Result.rows[0];
    
    console.log('Created test users:', user1.id, user2.id);
    
    // Test follow functionality
    console.log('\n--- Testing Follow Functionality ---');
    try {
      const follow = await FollowService.followUser(user1.id, user2.id);
      console.log('✓ Follow created:', follow);
      
      const isFollowing = await FollowService.isFollowing(user1.id, user2.id);
      console.log('✓ Is following check:', isFollowing);
      
      const followers = await FollowService.getFollowers(user2.id);
      console.log('✓ Followers retrieved:', followers.length);
      
      const following = await FollowService.getFollowing(user1.id);
      console.log('✓ Following retrieved:', following.length);
      
      const unfollow = await FollowService.unfollowUser(user1.id, user2.id);
      console.log('✓ Unfollow successful:', unfollow ? true : false);
    } catch (error) {
      console.error('✗ Follow test failed:', error.message);
    }
    
    // Create test category and thread for reaction testing
    const categoryResult = await client.query(
      `INSERT INTO categories (name, slug, description) 
       VALUES ('Test Category', 'test-category', 'A test category') 
       RETURNING *`
    );
    const category = categoryResult.rows[0];
    
    const threadResult = await client.query(
      `INSERT INTO threads (category_id, user_id, title, content) 
       VALUES ($1, $2, 'Test Thread', 'Test content') 
       RETURNING *`,
      [category.id, user1.id]
    );
    const thread = threadResult.rows[0];
    
    console.log('\n--- Testing Reaction Functionality ---');
    try {
      // Test adding a reaction to a thread
      const reaction = await ReactionService.addReaction(user2.id, thread.id, 'thread', 'like');
      console.log('✓ Reaction added:', reaction.type);
      
      // Test getting reactions for a thread
      const reactions = await ReactionService.getReactionsForThread(thread.id);
      console.log('✓ Reactions retrieved:', reactions.length);
      
      // Test toggling a reaction
      const toggleResult = await ReactionService.toggleReaction(user2.id, thread.id, 'thread', 'like');
      console.log('✓ Reaction toggled:', toggleResult.action);
      
      // Test reaction counts
      const counts = await ReactionService.getReactionCounts(thread.id, 'thread');
      console.log('✓ Reaction counts:', counts);
    } catch (error) {
      console.error('✗ Reaction test failed:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    console.log('\n--- Manual Test Completed ---');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    // Clean up
    await client.query('DELETE FROM reactions');
    await client.query('DELETE FROM follows');
    await client.query('DELETE FROM posts');
    await client.query('DELETE FROM threads');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM users');
    client.release();
    process.exit(0);
  }
}

runManualTest();