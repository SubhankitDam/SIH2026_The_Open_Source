import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
