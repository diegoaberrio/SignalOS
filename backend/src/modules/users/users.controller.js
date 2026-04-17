import { successResponse } from "../../utils/api-response.js";
import {
  getUsers,
  getUserById,
  createInternalUser,
  updateInternalUser,
  updateInternalUserStatus,
} from "./users.service.js";

export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();

    return successResponse({
      res,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserById(Number(req.params.id));

    return successResponse({
      res,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (req, res, next) => {
  try {
    const user = await createInternalUser(req.validatedData);

    return successResponse({
      res,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateInternalUser(Number(req.params.id), req.validatedData);

    return successResponse({
      res,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (req, res, next) => {
  try {
    const user = await updateInternalUserStatus(
      Number(req.params.id),
      req.validatedData.status
    );

    return successResponse({
      res,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};