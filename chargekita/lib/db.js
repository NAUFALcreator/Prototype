import { Pool } from "pg";

// Satu koneksi pool dipakai ulang di semua request (praktik standar di Next.js + Vercel)
let pool;

export function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  const client = db();
  const res = await client.query(text, params);
  return res.rows;
}
