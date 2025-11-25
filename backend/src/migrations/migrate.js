import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Read all .sql files in the migrations directory
    const migrationDir = path.join(__dirname);
    const files = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${files.length} migration files`);
    
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split the file into individual statements (simple approach)
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
            console.log('Statement executed successfully');
          } catch (err) {
            console.error('Error executing statement:', err);
            console.error('Statement:', statement);
            throw err;
          }
        }
      }
      
      console.log(`Completed migration: ${file}\n`);
    }
    
    console.log('All migrations completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  });
}

export default runMigrations;