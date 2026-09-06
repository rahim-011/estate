import z from "zod";





export const loginSchema = z.object({
    email: z.email({message:'Invalid email address'}),
    password: z.string().min(8,{message:'Password must be at least 8 characters'}),
    rememberMe: z.boolean().default(false)
})



export const signUpSchema = z.object({
    fullName: z.string().min(5,{message:'Full name must be at least 5 characters'}),
    email: z.email({message:'Invalid email address'}),
    password: z.string().min(8,{message:'Password must be at least 8 characters'}),
    confirmPassword: z.string(),
    rememberMe: z.boolean().default(false)
})
.refine((data) => data.password === data.confirmPassword ,{
    path:['confirmPassword'],
    message:"Passwords do not match"
})