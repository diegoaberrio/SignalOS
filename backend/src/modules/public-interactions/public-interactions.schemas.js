import { z } from "zod";

const interactionEventSchema = z.object({
  event_type: z
    .string({ required_error: "event_type is required" })
    .trim()
    .min(1, "event_type is required"),
  event_value: z.string().trim().max(255).optional().nullable(),
  event_order: z.number().int().positive().optional(),
});

export const createPublicInteractionSchema = z.object({
  company_name: z
    .string({ required_error: "company_name is required" })
    .trim()
    .min(2, "company_name must have at least 2 characters")
    .max(200, "company_name must not exceed 200 characters"),

  website: z.string().trim().max(255).optional().nullable(),
  business_email: z.string().trim().email("business_email must be valid").optional().nullable(),
  business_phone: z.string().trim().max(30).optional().nullable(),
  contact_person_name: z.string().trim().max(150).optional().nullable(),

  representative_name: z.string().trim().max(150).optional().nullable(),
  representative_email: z
    .string()
    .trim()
    .email("representative_email must be valid")
    .optional()
    .nullable(),
  representative_phone: z.string().trim().max(30).optional().nullable(),

  sector_id: z.number({ required_error: "sector_id is required" }).int().positive(),
  consulted_zone_id: z.number({ required_error: "consulted_zone_id is required" }).int().positive(),
  intention_id: z.number({ required_error: "intention_id is required" }).int().positive(),

  source_channel: z
    .enum(["web", "landing", "campaign", "direct", "other"])
    .optional()
    .default("web"),

  source_referrer: z.string().trim().optional().nullable(),
  source_campaign: z.string().trim().max(150).optional().nullable(),

  language_code: z.string().trim().max(10).optional().nullable(),

  device_type: z
    .enum(["desktop", "mobile", "tablet", "other"])
    .optional()
    .nullable(),

  session_identifier: z.string().trim().max(100).optional().nullable(),

  consent_accepted: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the consent notice",
    }),
  }),

  events: z.array(interactionEventSchema).optional().default([]),
}).superRefine((data, ctx) => {
  const hasAnyContact =
    !!data.business_email ||
    !!data.business_phone ||
    !!data.representative_email ||
    !!data.representative_phone;

  if (!hasAnyContact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["business_email"],
      message:
        "At least one contact method is required: business_email, business_phone, representative_email or representative_phone",
    });
  }
});