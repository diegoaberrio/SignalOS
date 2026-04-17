import { successResponse } from "../../utils/api-response.js";
import { getDashboardSummary } from "./dashboard.service.js";

export const getDashboardSummaryController = async (req, res, next) => {
  try {
    const summary = await getDashboardSummary();

    return successResponse({
      res,
      message: "Dashboard summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};