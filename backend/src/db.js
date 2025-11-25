import pkg from 'pg';
const { Pool } = pkg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tradezella',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Function to get a database connection
export async function getDb() {
  return pool;
}

// Function to initialize the database with required tables
export async function initDb() {
  const client = await pool.connect();
  
  try {
    // Create users table (keeping existing structure)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        googleId TEXT,
        passwordResetToken TEXT,
        passwordResetExpires TIMESTAMP,
        role VARCHAR(50) DEFAULT 'user',
        is_banned BOOLEAN DEFAULT false,
        ban_reason TEXT,
        banned_until TIMESTAMP,
        bio TEXT,
        avatar_url VARCHAR(500),
        location VARCHAR(255),
        website VARCHAR(500),
        twitter_handle VARCHAR(100),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trades table (keeping existing structure)
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        userId INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        direction TEXT NOT NULL,
        size REAL NOT NULL,
        entryPrice REAL NOT NULL,
        exitPrice REAL,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Export the pool for direct queries when needed
export { pool };