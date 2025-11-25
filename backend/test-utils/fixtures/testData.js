export const testUsers = [
  {
    id: 1,
    email: 'user1@test.com',
    name: 'Test User 1',
    password: 'SecurePass123!',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@test.com',
    name: 'Admin User',
    password: 'AdminPass123!',
    role: 'admin'
  }
];

export const testCategories = [
  {
    id: 1,
    name: 'General Discussion',
    slug: 'general',
    description: 'General trading discussions'
  },
  {
    id: 2,
    name: 'Technical Analysis',
    slug: 'technical',
    description: 'Technical analysis discussions'
  }
];

export const testThreads = [
  {
    id: 1,
    category_id: 1,
    user_id: 1,
    title: 'Test Thread 1',
    content: 'This is the content of test thread 1'
  },
  {
    id: 2,
    category_id: 2,
    user_id: 2,
    title: 'Test Thread 2',
    content: 'This is the content of test thread 2'
  }
];

export const testPosts = [
  {
    id: 1,
    thread_id: 1,
    user_id: 1,
    content: 'This is a test post'
  },
  {
    id: 2,
    thread_id: 1,
    user_id: 2,
    content: 'This is another test post'
  }
];

export const testTrades = [
  {
    id: 1,
    userId: 1,
    symbol: 'AAPL',
    direction: 'LONG',
    size: 100,
    entryPrice: 150.00
  },
  {
    id: 2,
    userId: 1,
    symbol: 'GOOGL',
    direction: 'SHORT',
    size: 50,
    entryPrice: 2500.00
  }
];