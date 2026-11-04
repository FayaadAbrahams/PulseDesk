import * as z from "zod";

export const RegisterSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email address" }),
    name: z
      .string({ message: "Please enter your full name and surname" })
      .min(3, { message: "Please enter your full name and surname" }),
    password: z
      .string({ message: "Please enter a password" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one capital letter",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
