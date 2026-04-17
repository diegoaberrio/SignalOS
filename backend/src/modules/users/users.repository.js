import { pool } from "../../config/db.js";

export const findUsers = async () => {
  const result = await pool.query(`
    SELECT
      iu.id,
      iu.client_account_id,
      iu.role_id,
      iu.full_name,
      iu.email,
      iu.status,
      iu.last_login_at,
      iu.created_at,
      iu.updated_at,
      r.code AS role_code,
      r.name AS role_name
    FROM internal_users iu
    INNER JOIN roles r ON r.id = iu.role_id
    ORDER BY iu.created_at DESC, iu.id DESC
  `);

  return result.rows;
};

export const findUserById = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        iu.id,
        iu.client_account_id,
        iu.role_id,
        iu.full_name,
        iu.email,
        iu.status,
        iu.last_login_at,
        iu.created_at,
        iu.updated_at,
        r.code AS role_code,
        r.name AS role_name
      FROM internal_users iu
      INNER JOIN roles r ON r.id = iu.role_id
      WHERE iu.id = $1
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
};

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT id, email
      FROM internal_users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
};

export const findRoleById = async (roleId) => {
  const result = await pool.query(
    `
      SELECT id, code, name
      FROM roles
      WHERE id = $1
      LIMIT 1
    `,
    [roleId]
  );

  return result.rows[0] || null;
};

export const createUser = async ({
  clientAccountId,
  roleId,
  fullName,
  email,
  passwordHash,
  status,
}) => {
  const result = await pool.query(
    `
      INSERT INTO internal_users (
        client_account_id,
        role_id,
        full_name,
        email,
        password_hash,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [clientAccountId, roleId, fullName, email, passwordHash, status]
  );

  return result.rows[0];
};

export const updateUser = async ({
  userId,
  clientAccountId,
  roleId,
  fullName,
  email,
  passwordHash,
  status,
}) => {
  const result = await pool.query(
    `
      UPDATE internal_users
      SET
        client_account_id = COALESCE($2, client_account_id),
        role_id = COALESCE($3, role_id),
        full_name = COALESCE($4, full_name),
        email = COALESCE($5, email),
        password_hash = COALESCE($6, password_hash),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [userId, clientAccountId, roleId, fullName, email, passwordHash, status]
  );

  return result.rows[0] || null;
};

export const updateUserStatus = async ({ userId, status }) => {
  const result = await pool.query(
    `
      UPDATE internal_users
      SET
        status = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [userId, status]
  );

  return result.rows[0] || null;
};