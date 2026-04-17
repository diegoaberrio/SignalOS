import { successResponse } from "../../utils/api-response.js";
import {
  loginInternalUser,
  getAuthenticatedUserProfile,
} from "./auth.service.js";

export const loginController = async (req, res, next) => {
  try {
    const result = await loginInternalUser(req.validatedData);

    return successResponse({
      res,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const meController = async (req, res, next) => {
  try {
    const profile = await getAuthenticatedUserProfile(req.user.id);

    return successResponse({
      res,
      message: "Authenticated user retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};