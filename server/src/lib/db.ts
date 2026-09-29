import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getDb(): any {
  if (!fs.existsSync(DB_FILE)) {
    // If db.json doesn't exist in server/data, check if it exists in server/data or initialize
    const altFile = path.join(process.cwd(), 'server', 'data', 'db.json');
    if (fs.existsSync(altFile)) {
      return JSON.parse(fs.readFileSync(altFile, 'utf-8'));
    }
    return { releases: [], users: [], payouts: [], royalty_transactions: [], royalty_statements: [] };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { releases: [], users: [], payouts: [], royalty_transactions: [], royalty_statements: [] };
  }
}

export function saveDb(data: any): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  // Also keep root copy synchronized
  const altFile = path.join(process.cwd(), 'server', 'data', 'db.json');
  try {
    fs.writeFileSync(altFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}
