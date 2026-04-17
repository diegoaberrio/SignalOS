import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getCompaniesController,
  getCompanyByIdController,
  getCompanyInteractionsController,
} from "./companies.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getCompaniesController);
router.get("/:id", getCompanyByIdController);
router.get("/:id/interactions", getCompanyInteractionsController);

export default router;