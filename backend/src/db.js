import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Configure lowdb to use a JSON file for storage
const adapter = new JSONFile('db.json');
const defaultData = { users: [], trades: [] };
const db = new Low(adapter, defaultData);

export default db;
