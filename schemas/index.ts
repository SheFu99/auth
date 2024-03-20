import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(6, {
        message: 'Password is required'
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email("Email is required"), // Simplified
    password: z.string().min(6, "Password is required and must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    name: z.string().min(3, "Name is required and must be at least 3 characters"),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This attaches the error message to confirmPassword
  });

export type LoginFormDataType = z.infer<typeof LoginSchema>;
