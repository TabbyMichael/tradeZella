import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, createTestCategory, createTestThread, createTestPost, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Reactions API', () => {
  let testUser;
  let authToken;
  let testCategory;
  let testThread;
  let testPost;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create test user
    testUser = await createTestUser({
      email: 'reactionuser@example.com',
      password: 'ReactionPass123!',
      name: 'Reaction User'
    });
    
    // Generate auth token
    authToken = generateTestToken(testUser);
    
    // Create test category
    testCategory = await createTestCategory({
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    });
    
    // Create test thread
    testThread = await createTestThread({
      category_id: testCategory.id,
      user_id: testUser.id,
      title: 'Test Thread',
      content: 'Test thread content'
    });
    
    // Create test post
    testPost = await createTestPost({
      thread_id: testThread.id,
      user_id: testUser.id,
      content: 'Test post content'
    });
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('POST /api/community/reactions', () => {
    it('should add a reaction to a post', async () => {
      const reactionData = {
        targetId: testPost.id,
        targetType: 'post',
        type: 'like'
      };
      
      const res = await request(app)
        .post('/api/community/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.user_id).toBe(testUser.id);
      expect(res.body.data.post_id).toBe(testPost.id);
      expect(res.body.data.type).toBe('like');
    });
    
    it('should add a reaction to a thread', async () => {
      const reactionData = {
        targetId: testThread.id,
        targetType: 'thread',
        type: 'upvote'
      };
      
      const res = await request(app)
        .post('/api/community/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.user_id).toBe(testUser.id);
      expect(res.body.data.thread_id).toBe(testThread.id);
      expect(res.body.data.type).toBe('upvote');
    });
    
    it('should return 401 without authentication', async () => {
      const reactionData = {
        targetId: testPost.id,
        targetType: 'post',
        type: 'like'
      };
      
      await request(app)
        .post('/api/community/reactions')
        .send(reactionData)
        .expect(401);
    });
  });
  
  describe('PUT /api/community/reactions', () => {
    it('should toggle a reaction', async () => {
      const reactionData = {
        targetId: testPost.id,
        targetType: 'post',
        type: 'heart'
      };
      
      // First toggle - should add reaction
      const res1 = await request(app)
        .put('/api/community/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(200);
      
      expect(res1.body.success).toBe(true);
      expect(res1.body.data.action).toBe('added');
      
      // Second toggle - should remove reaction
      const res2 = await request(app)
        .put('/api/community/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(200);
      
      expect(res2.body.success).toBe(true);
      expect(res2.body.data.action).toBe('removed');
    });
  });
  
  describe('GET /api/community/reactions/post/:postId', () => {
    it('should get reactions for a post', async () => {
      // Add a reaction first
      await request(app)
        .post('/api/community/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetId: testPost.id,
          targetType: 'post',
          type: 'laugh'
        });
      
      const res = await request(app)
        .get(`/api/community/reactions/post/${testPost.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
  
  describe('GET /api/community/reactions/thread/:threadId', () => {
    it('should get reactions for a thread', async () => {
      const res = await request(app)
        .get(`/api/community/reactions/thread/${testThread.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});