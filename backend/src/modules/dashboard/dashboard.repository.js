import { pool } from "../../config/db.js";

export const countTotalCompanies = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::INT AS total
    FROM companies
  `);

  return result.rows[0]?.total || 0;
};

export const countTotalInteractions = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::INT AS total
    FROM public_interactions
  `);

  return result.rows[0]?.total || 0;
};

export const getPriorityBreakdown = async () => {
  const result = await pool.query(`
    SELECT
      current_priority_level,
      COUNT(*)::INT AS total
    FROM companies
    GROUP BY current_priority_level
  `);

  return result.rows;
};

export const getRecentActivity = async (limit = 10) => {
  const result = await pool.query(
    `
      SELECT
        pi.id AS interaction_id,
        pi.submitted_at,
        pi.priority_level_snapshot,
        c.id AS company_id,
        c.company_name
      FROM public_interactions pi
      INNER JOIN companies c ON c.id = pi.company_id
      ORDER BY pi.submitted_at DESC, pi.id DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};