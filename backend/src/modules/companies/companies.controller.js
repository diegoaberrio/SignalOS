import { successResponse } from "../../utils/api-response.js";
import {
  getCompanies,
  getCompanyById,
  getCompanyInteractions,
} from "./companies.service.js";

export const getCompaniesController = async (req, res, next) => {
  try {
    const result = await getCompanies(req.query);

    return successResponse({
      res,
      message: "Companies retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyByIdController = async (req, res, next) => {
  try {
    const companyId = Number(req.params.id);
    const company = await getCompanyById(companyId);

    return successResponse({
      res,
      message: "Company retrieved successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyInteractionsController = async (req, res, next) => {
  try {
    const companyId = Number(req.params.id);
    const interactions = await getCompanyInteractions(companyId);

    return successResponse({
      res,
      message: "Company interactions retrieved successfully",
      data: interactions,
    });
  } catch (error) {
    next(error);
  }
};