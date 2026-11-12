import { z } from "zod";

export const usernameSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, "Use 3–30 letters, numbers, or underscores.");
export const passwordSchema = z.string().min(8, "Use at least 8 characters.").max(128);
export const signupSchema = z.object({ email: z.string().trim().email().max(255), username: usernameSchema, password: passwordSchema });
export const childSchema = z.object({ nickname: z.string().trim().min(1).max(60), age_group: z.enum(["toddler", "preschool"]), preferences: z.string().trim().max(1000) });
