import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .trim()
    .email("email must be a valid email"),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(1, "password is required"),
});