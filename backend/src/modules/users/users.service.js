import bcrypt from "bcryptjs";
import {
  findUsers,
  findUserById,
  findUserByEmail,
  findRoleById,
  createUser,
  updateUser,
  updateUserStatus,
} from "./users.repository.js";

const mapUser = (user) => ({
  id: Number(user.id),
  full_name: user.full_name,
  email: user.email,
  status: user.status,
  client_account_id: user.client_account_id ? Number(user.client_account_id) : null,
  last_login_at: user.last_login_at,
  created_at: user.created_at,
  updated_at: user.updated_at,
  role: {
    id: Number(user.role_id),
    code: user.role_code,
    name: user.role_name,
  },
});

export const getUsers = async () => {
  const users = await findUsers();
  return users.map(mapUser);
};

export const getUserById = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return mapUser(user);
};

export const createInternalUser = async (data) => {
  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    error.errors = [
      {
        field: "email",
        code: "DUPLICATE",
        message: "Email already exists",
      },
    ];
    throw error;
  }

  const role = await findRoleById(data.role_id);
  if (!role) {
    const error = new Error("Selected role does not exist");
    error.statusCode = 400;
    error.errors = [
      {
        field: "role_id",
        code: "INVALID_REFERENCE",
        message: "Selected role does not exist",
      },
    ];
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const created = await createUser({
    clientAccountId: data.client_account_id ?? null,
    roleId: data.role_id,
    fullName: data.full_name,
    email: data.email,
    passwordHash,
    status: data.status,
  });

  return await getUserById(Number(created.id));
};

export const updateInternalUser = async (userId, data) => {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.email && data.email !== existingUser.email) {
    const emailOwner = await findUserByEmail(data.email);
    if (emailOwner) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      error.errors = [
        {
          field: "email",
          code: "DUPLICATE",
          message: "Email already exists",
        },
      ];
      throw error;
    }
  }

  if (data.role_id) {
    const role = await findRoleById(data.role_id);
    if (!role) {
      const error = new Error("Selected role does not exist");
      error.statusCode = 400;
      error.errors = [
        {
          field: "role_id",
          code: "INVALID_REFERENCE",
          message: "Selected role does not exist",
        },
      ];
      throw error;
    }
  }

  const passwordHash = data.password
    ? await bcrypt.hash(data.password, 10)
    : null;

  await updateUser({
    userId,
    clientAccountId:
      data.client_account_id !== undefined ? data.client_account_id : null,
    roleId: data.role_id ?? null,
    fullName: data.full_name ?? null,
    email: data.email ?? null,
    passwordHash,
    status: data.status ?? null,
  });

  return await getUserById(userId);
};

export const updateInternalUserStatus = async (userId, status) => {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await updateUserStatus({ userId, status });
  return await getUserById(userId);
};