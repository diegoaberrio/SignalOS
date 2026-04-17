import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  updateUserStatusController,
} from "./users.controller.js";
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "./users.schemas.js";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles("admin"));

router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.post("/", validate(createUserSchema), createUserController);
router.patch("/:id", validate(updateUserSchema), updateUserController);
router.patch("/:id/status", validate(updateUserStatusSchema), updateUserStatusController);

export default router;