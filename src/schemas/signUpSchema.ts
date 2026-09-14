import { z } from "zod";

export const usernameValidation = z.string()
.min(2, "Username Must be atleast 2 character long")
.max(20, "Username Must be no longer than 20 character")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain Special character")




export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Please Enter a valid email ID" }),
    password: z.string().min(6, { message: "Password must be 6 character long" })
})