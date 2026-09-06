import z from "zod";



export const contactSchema = z.object({
    name: z.string().min(2,{message:'Name must be at least 2 characters'}),
    email: z.email({message:'Invalid email address'}),
    phoneNumber: z.string().min(10,'Invalid phone number'),
    message: z.string().min(10,{message:'Message must be at least 10 characters'})
})