import request from 'supertest';
import app from '../../src/index.js';
import { pool } from '../../src/db.js';
import { createTestUser, clearTestData, generateTestToken } from '../../test-utils/helpers.js';

describe('Follow API', () => {
  let testUser1;
  let testUser2;
  let authToken1;
  let authToken2;
  
  beforeAll(async () => {
    // Clear any existing test data
    await clearTestData();
    
    // Create test users
    testUser1 = await createTestUser({
      email: 'follower@example.com',
      password: 'FollowerPass123!',
      name: 'Follower User'
    });
    
    testUser2 = await createTestUser({
      email: 'followed@example.com',
      password: 'FollowedPass123!',
      name: 'Followed User'
    });
    
    // Generate auth tokens
    authToken1 = generateTestToken(testUser1);
    authToken2 = generateTestToken(testUser2);
  });
  
  afterAll(async () => {
    // Clean up test data
    await clearTestData();
    
    // Close database connection
    await pool.end();
  });
  
  describe('POST /api/community/follow/:userId', () => {
    it('should follow a user', async () => {
      const res = await request(app)
        .post(`/api/community/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.follower_id).toBe(testUser1.id);
      expect(res.body.data.followed_id).toBe(testUser2.id);
    });
    
    it('should return 400 when trying to follow yourself', async () => {
      await request(app)
        .post(`/api/community/follow/${testUser1.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(400);
    });
    
    it('should return 401 without authentication', async () => {
      await request(app)
        .post(`/api/community/follow/${testUser2.id}`)
        .expect(401);
    });
  });
  
  describe('DELETE /api/community/follow/:userId', () => {
    it('should unfollow a user', async () => {
      // First follow the user
      await request(app)
        .post(`/api/community/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(201);
      
      // Then unfollow
      const res = await request(app)
        .delete(`/api/community/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Unfollowed successfully');
    });
    
    it('should return 404 when trying to unfollow a user not being followed', async () => {
      await request(app)
        .delete(`/api/community/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(404);
    });
  });
  
  describe('GET /api/community/follow/followers/:userId', () => {
    it('should get followers for a user', async () => {
      // Follow the user first
      await request(app)
        .post(`/api/community/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(201);
      
      const res = await request(app)
        .get(`/api/community/follow/followers/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(testUser1.id);
    });
  });
  
  describe('GET /api/community/follow/following/:userId', () => {
    it('should get following for a user', async () => {
      const res = await request(app)
        .get(`/api/community/follow/following/${testUser1.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(testUser2.id);
    });
  });
  
  describe('GET /api/community/follow/is-following/:userId', () => {
    it('should check if user is following another user', async () => {
      const res = await request(app)
        .get(`/api/community/follow/is-following/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.isFollowing).toBe(true);
    });
  });
  
  describe('GET /api/community/follow/stats/:userId', () => {
    it('should get follow stats for a user', async () => {
      const res = await request(app)
        .get(`/api/community/follow/stats/${testUser2.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('followerCount');
      expect(res.body.data).toHaveProperty('followingCount');
      expect(res.body.data.followerCount).toBe(1);
    });
  });
});