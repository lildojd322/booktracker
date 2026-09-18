import { z } from "zod"

export const registerSchema = z.object({
    name: z.string()
        .min(2, "The name must be at least 2 characters long")
        .max(23, "the name must not exceed 23 characters")
        .regex(/^[a-zA-Z0-9_]+$/, 'Only English letters, numbers, and underscores are allowed'),
    email: z.string().email("Incorrect email format").min(2, "The email must be at least 2 characters long")
        .max(60, "the email must not exceed 60 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(25, "the password must not exceed 25 characters"),
    repeatPassword: z.string().min(1, 'Please repeat your password')
}).refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ["repeatPassword"]
})


export const loginSchema = z.object({
    email: z.string()
        .email("Invalid mail format")
        .max(100, "Email is too long"),

    password: z.string()
        .min(6, "Password is too short")
        .max(25, "Password must not exceed 25 characters")
})

export const emailSchema = z.object({
    email: z.string().email("Incorrect email format").min(2, "The email must be at least 2 characters long")
        .max(60, "the email must not exceed 60 characters"),
})

const passwordFields = z.object({
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(25, "The password must not exceed 25 characters"),
    repeatPassword: z
        .string()
        .min(1, "Please repeat your password")
})


export const newPasswordSchema = passwordFields.refine(
    (data) => data.password === data.repeatPassword, 
    {
        message: "Passwords do not match",
        path: ["repeatPassword"],
    }
) 


export const backendPasswordResetSchema = passwordFields
    .extend({
        email: z.string().email("Incorrect email format"),
        token: z.string().min(1, "Token is required")
    })
    .refine(
        (data) => data.password === data.repeatPassword, 
        {
            message: "Passwords do not match",
            path: ["repeatPassword"],
        }
    )