import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(120).trim(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  email: z.string().email().max(255),
  image: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .nullable(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
});
