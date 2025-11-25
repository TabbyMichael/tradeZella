import { createTestUser, generateTestToken } from './backend/test-utils/helpers.js';
import { pool } from './backend/src/db.js';

async function debugTest() {
  try {
    // Clear any existing test data
    await pool.query('DELETE FROM users');
    
    // Create a test user
    const testUser = await createTestUser({
      email: 'debug@example.com',
      password: 'DebugPass123!',
      name: 'Debug User'
    });
    
    console.log('Created user:', testUser);
    
    // Generate auth token
    const authToken = generateTestToken(testUser);
    console.log('Generated token:', authToken);
    
    // Close database connection
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugTest();