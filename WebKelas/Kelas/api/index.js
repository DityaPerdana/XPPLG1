import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join('/tmp', 'datakelas.db'); // Use /tmp for Vercel

export function getDb() {
  return new Database(dbPath);
}
