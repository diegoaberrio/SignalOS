import { pool } from "../../config/db.js";

export const findInternalUserByEmail = async (email) => {
  const query = `
    SELECT
      iu.id,
      iu.client_account_id,
      iu.role_id,
      iu.full_name,
      iu.email,
      iu.password_hash,
      iu.status,
      iu.last_login_at,
      r.code AS role_code,
      r.name AS role_name
    FROM internal_users iu
    INNER JOIN roles r ON r.id = iu.role_id
    WHERE iu.email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const findInternalUserById = async (userId) => {
  const query = `
    SELECT
      iu.id,
      iu.client_account_id,
      iu.role_id,
      iu.full_name,
      iu.email,
      iu.status,
      iu.last_login_at,
      r.code AS role_code,
      r.name AS role_name
    FROM internal_users iu
    INNER JOIN roles r ON r.id = iu.role_id
    WHERE iu.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

export const updateInternalUserLastLogin = async (userId) => {
  const query = `
    UPDATE internal_users
    SET last_login_at = NOW()
    WHERE id = $1
  `;

  await pool.query(query, [userId]);
};