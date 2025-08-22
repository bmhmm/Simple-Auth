import { z } from "zod";

export const authSchema = z
  .object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // This is a conditional validation for the sign-up form
      if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type AuthData = z.infer<typeof authSchema>;