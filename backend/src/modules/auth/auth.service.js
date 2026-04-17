import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import {
  findInternalUserByEmail,
  findInternalUserById,
  updateInternalUserLastLogin,
} from "./auth.repository.js";

export const loginInternalUser = async ({ email, password }) => {
  const user = await findInternalUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("User is not active");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  await updateInternalUserLastLogin(user.id);

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role_code,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      status: user.status,
      client_account_id: user.client_account_id,
      role: {
        code: user.role_code,
        name: user.role_name,
      },
    },
  };
};

export const getAuthenticatedUserProfile = async (userId) => {
  const user = await findInternalUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    status: user.status,
    client_account_id: user.client_account_id,
    last_login_at: user.last_login_at,
    role: {
      code: user.role_code,
      name: user.role_name,
    },
  };
};