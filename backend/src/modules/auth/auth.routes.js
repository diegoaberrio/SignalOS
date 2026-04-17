import { Router } from "express";

import { loginController, meController } from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, meController);

export default router;