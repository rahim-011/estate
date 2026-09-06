import z, { literal } from "zod";




export const contactSchema = z.object({
    email: z.email({message:'Invalid email address'}),
    phone: z.string().min(10,{message:'Invalid phone number'}),
    location: z.string().min(1,{message:'Location cannot be empty'}),
})


export const userContactSchema = z.object({
    email: z.email({message:'Invalid email address'}),
    location: z.string().min(2,{message:'Location must be at least 2 characters'}).or(literal('')).optional(),
    phone: z.string().min(10,{message:'Invalid phone number'}).or(literal('')).optional(),
    preferredContact: z.enum(["phone", "sms", "whatsApp", "email"], {
    message: "Please select a valid contact method",
    }),
})



export const userProfileSchema = z.object({
    fullName: z.string().min(5,{message:'Full name must be at least 5 characters'}),
    pfpImage: z.union([
        z.string(),
        z.instanceof(File) 
    ])
})


export const accountSettingsSchema = z.object({
    fullName: z.string().min(5,{message:'Full name must be at least 5 characters'}).optional(),
    location: z.string().min(2,{message:'Location must be at least 2 characters'}).or(z.literal('')).optional(),
    email: z.email({message:'Invalid email address'}).optional(),
}) 


export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8,{message:'Password must be at least 8 characters'}),
    newPassword: z.string().min(8,{message:'New password must be at least 8 characters'}),
    confirmNewPassword: z.string()
})
.refine((data) => data.currentPassword !== data.newPassword,{
    path: ['newPassword'],
    message: 'No changes detected'
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords do not match',
})


export const otpCodeSchema = z.object({
    otpCode: z
        .string()
        .length(6, { message: 'OTP Code must be exactly 6 digits' })
        .regex(/^\d+$/, { message: 'OTP Code must contain numbers only' }),
});


export const forgotPasswordSchema = z.object({
    email: z.email({message:'Invalid email address'})
})

export const resetPasswordSchema = z.object({
    password: z.string().min(8,{message:'Password must be at least 8 characters'}),
    confirmPassword: z.string(),
})
.refine((data) => data.confirmPassword === data.password,{
    path:['confirmPassword'],
    message:'Passwords do not match'
})