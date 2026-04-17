import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

const isProduction = env.nodeEnv === "production";

export const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export const testDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW() AS current_time");
    return result.rows[0];
  } finally {
    client.release();
  }
};