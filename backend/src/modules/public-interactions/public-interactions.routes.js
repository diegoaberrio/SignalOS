import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPublicInteractionSchema } from "./public-interactions.schemas.js";
import { submitPublicInteractionController } from "./public-interactions.controller.js";

const router = Router();

router.post("/", validate(createPublicInteractionSchema), submitPublicInteractionController);

export default router;