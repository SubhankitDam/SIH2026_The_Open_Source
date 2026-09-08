import { Pool } from "pg";

const pool = new Pool();

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
