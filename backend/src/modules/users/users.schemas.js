import { z } from "zod";

export const createUserSchema = z.object({
  client_account_id: z.number().int().positive().optional().nullable(),
  role_id: z.number({ required_error: "role_id is required" }).int().positive(),
  full_name: z
    .string({ required_error: "full_name is required" })
    .trim()
    .min(2, "full_name must have at least 2 characters")
    .max(150, "full_name must not exceed 150 characters"),
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email("email must be a valid email"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must have at least 8 characters")
    .max(100, "password must not exceed 100 characters"),
  status: z
    .enum(["active", "inactive", "disabled"])
    .optional()
    .default("active"),
});

export const updateUserSchema = z.object({
  client_account_id: z.number().int().positive().optional().nullable(),
  role_id: z.number().int().positive().optional(),
  full_name: z
    .string()
    .trim()
    .min(2, "full_name must have at least 2 characters")
    .max(150, "full_name must not exceed 150 characters")
    .optional(),
  email: z.string().trim().email("email must be a valid email").optional(),
  password: z
    .string()
    .min(8, "password must have at least 8 characters")
    .max(100, "password must not exceed 100 characters")
    .optional(),
  status: z.enum(["active", "inactive", "disabled"]).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["active", "inactive", "disabled"], {
    required_error: "status is required",
  }),
});