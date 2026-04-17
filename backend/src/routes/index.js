import { Router } from "express";
import { successResponse } from "../utils/api-response.js";
import catalogRoutes from "../modules/catalog/catalog.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import companiesRoutes from "../modules/companies/companies.routes.js";
import publicInteractionsRoutes from "../modules/public-interactions/public-interactions.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import usersRoutes from "../modules/users/users.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  return successResponse({
    res,
    message: "SignalOS API is running",
    data: {
      service: "signalos-backend",
      status: "ok",
    },
  });
});

router.get("/", (req, res) => {
  return successResponse({
    res,
    message: "Welcome to SignalOS API",
    data: {
      version: "v1",
    },
  });
});

router.use("/public/catalogs", catalogRoutes);
router.use("/public/interactions", publicInteractionsRoutes);
router.use("/auth", authRoutes);
router.use("/companies", companiesRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", usersRoutes);

export default router;