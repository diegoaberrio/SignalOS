import { Router } from "express";
import {
  getZonesController,
  getSectorsController,
  getIntentionsController,
} from "./catalog.controller.js";

const router = Router();

router.get("/zones", getZonesController);
router.get("/sectors", getSectorsController);
router.get("/intentions", getIntentionsController);

export default router;