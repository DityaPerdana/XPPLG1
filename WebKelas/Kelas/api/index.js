import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'datakelas.db'); // Adjust path for Vercel

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function getDb() {
  return openDb();
}
