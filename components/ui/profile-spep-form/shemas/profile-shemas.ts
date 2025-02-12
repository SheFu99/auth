import { z } from "zod"

export const shortNameSchema = z
  .string()
  .min(3, { message: "Short name must be at least 3 characters long" })
  .max(15, { message: "Short name must be at most 15 characters long" })
  .regex(/^[a-zA-Z0-9_]+$/, { message: "Short name can only contain letters, numbers, and underscores" })

export const phoneNumberSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })

export const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url({ message: "Invalid URL format" }),
})

export const profileSchema = z.object({
  shortName: shortNameSchema,
  phoneNumber: phoneNumberSchema,
  isPublic: z.boolean(),
  socialLinks: z.array(socialLinkSchema),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export type ProfileFormData = z.infer<typeof profileSchema>

