import { successResponse } from "../../utils/api-response.js";
import {
  getZones,
  getSectors,
  getIntentions,
} from "./catalog.service.js";

export const getZonesController = async (req, res, next) => {
  try {
    const { level, parent_zone_id: parentZoneId } = req.query;

    const zones = await getZones({
      level: level || null,
      parentZoneId: parentZoneId ? Number(parentZoneId) : null,
    });

    return successResponse({
      res,
      message: "Zones retrieved successfully",
      data: zones,
    });
  } catch (error) {
    next(error);
  }
};

export const getSectorsController = async (req, res, next) => {
  try {
    const sectors = await getSectors();

    return successResponse({
      res,
      message: "Sectors retrieved successfully",
      data: sectors,
    });
  } catch (error) {
    next(error);
  }
};

export const getIntentionsController = async (req, res, next) => {
  try {
    const intentions = await getIntentions();

    return successResponse({
      res,
      message: "Intentions retrieved successfully",
      data: intentions,
    });
  } catch (error) {
    next(error);
  }
};