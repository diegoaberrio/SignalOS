import { pool } from "../../config/db.js";

export const findActiveZones = async ({ level = null, parentZoneId = null }) => {
  let query = `
    SELECT
      id,
      code,
      name,
      parent_zone_id,
      level,
      is_active
    FROM zones
    WHERE is_active = TRUE
  `;

  const values = [];
  let paramIndex = 1;

  if (level) {
    query += ` AND level = $${paramIndex}`;
    values.push(level);
    paramIndex++;
  }

  if (parentZoneId) {
    query += ` AND parent_zone_id = $${paramIndex}`;
    values.push(parentZoneId);
    paramIndex++;
  }

  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, values);
  return result.rows;
};

export const findActiveSectors = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      is_active
    FROM sectors
    WHERE is_active = TRUE
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const findActiveIntentions = async () => {
  const query = `
    SELECT
      id,
      code,
      name,
      description,
      is_active
    FROM interaction_intentions
    WHERE is_active = TRUE
    ORDER BY id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};