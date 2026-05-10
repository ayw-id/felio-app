import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(6),
});

export const passwordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(6),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const passwordSubmitSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type PasswordSubmitInput = z.infer<typeof passwordSubmitSchema>;
