import { successResponse } from "../../utils/api-response.js";
import { submitPublicInteraction } from "./public-interactions.service.js";

export const submitPublicInteractionController = async (req, res, next) => {
  try {
    const payload = {
      ...req.validatedData,
      ip_address: req.ip || null,
      user_agent: req.headers["user-agent"] || null,
    };

    const result = await submitPublicInteraction(payload);

    return successResponse({
      res,
      statusCode: 201,
      message: "Interaction submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};