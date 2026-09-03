import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "The name must be at least 2 characters long").max(23, "the name must not exceed 23 characters"),
    email: z.string().email("Incorrect email format"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(25, "the password must not exceed 25 characters"),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid mail format"),
    password: z.string().min(6, "Password is too short"),

})