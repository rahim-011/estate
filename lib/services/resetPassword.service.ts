'use server'

import { ForgotPasswordValue } from "@/app/(auth)/forgot-password/page"
import { forgotPasswordSchema, otpCodeSchema, resetPasswordSchema } from "@/schemas/userSchemas"
import crypto from 'crypto'
import { sendResetPasswordEmail } from "../mail";
import {prisma} from '../prisma'
import { VerifyCodeValue } from "@/app/(auth)/verify-code/page";
import { auth } from "../auth";
import { ResetPasswordValues } from "@/app/(auth)/reset-password/page";
import bcrypt from  'bcryptjs'
import { cleanUserCache } from "./user.service";

export const generateResetPasswordOtpCode = async (values:ForgotPasswordValue) =>{
    try{
        const validation = forgotPasswordSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error:'Invalid email address!'
            }
        }
        const isValidEmail = await prisma?.user.findUnique({
            where:{
                email:validation.data.email
            }
        })
        if (!isValidEmail){
            return{
                success:false,
                error:'Invalid email address'
            }
        }

        const otpCode = crypto.randomInt(100000,1000000).toString();
        const hashedOtpCode  = crypto.createHash('sha256')
                                .update(otpCode)
                                .digest('hex');
        const expirationMinuts = 5;
        const expiresAt = new Date(Date.now() + expirationMinuts * 60 * 1000);
        await sendResetPasswordEmail(validation.data.email,otpCode);
        await prisma?.resetPasswordTokens.upsert({
            where:{
                user_email:validation.data.email
            },
            create:{
                token: hashedOtpCode,
                expires_at: expiresAt,
                user_email:validation.data.email
            },
            update:{
                token:hashedOtpCode,
                expires_at:expiresAt,
            }
        })
        
        return {
            success:true,
            message:'Please enter a valid email address.'
        }
    }
    catch(error){
        console.log('forget password error:',error)
        return{
            success:false,
            error: 'Internal server error'
        }
    }
}



export const verifyResetPasswordOtpCode = async(value:VerifyCodeValue,userEmail:string)=>{
    try{
        if (!value){
            return{
                success:false,
                error:'Otp Code is required!'
            }
        }
        if (!userEmail){
            return{
                success:false,
                error:'User email is required!'
            }
        }
        const validation = otpCodeSchema.safeParse(value);
        if (!validation.success){
            return{
                success:false,
                error:'Invalid otp code'
            }
        }
        const isValidEmail = await prisma.user.findUnique({
            where:{
                email:userEmail
            }
        });
        if (!isValidEmail){
            return{
                success:false,
                error:'Invalid email address!'
            }
        };
        const currentResetToken =  await prisma.resetPasswordTokens.findUnique({
            where:{
                user_email:userEmail
            }
        });
        if (!currentResetToken){
            return{
                success:false,
                error:'Missed reset password token!'
            }
        }
        const {expires_at,token} = currentResetToken;
        const nowDate = new Date();
        if(expires_at < nowDate){
            return{
                success:false,
                error:'OTP code is expired ask for new one!'
            }
        }
        const hashedUserToken = crypto.createHash('sha256')
                            .update(validation.data.otpCode)
                            .digest('hex');
        if (hashedUserToken !== token){
            return{
                success:false,
                error:'Incorrect otp code'
            }
        }
        await prisma.resetPasswordTokens.delete({
            where:{
                user_email:userEmail
            }
        })
        return {
            success:true,
            message:"OTP verified successfully"
        }

    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}





export const resetUserPassword =  async(userEmail:string,values:ResetPasswordValues) => {
    try{
        const validation = resetPasswordSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error:'Invalida form data!'
            }
        }
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { accounts: true }
        });
        if (!user){
            return{
                success:false,
                error:'Invalid email address!'
            }
        }
        const hashedNewPassword = await bcrypt.hash(validation.data.password,10);
    
        const credentialAccount = user?.accounts.find(acc => acc.providerId === "credential");
        if (credentialAccount) {
            await prisma.account.update({
                where: { id: credentialAccount.id },
                data: {
                    password: hashedNewPassword
                }
            });
        }

        await cleanUserCache(user?.id,'/profile')
        return{
            success:true,
            message:'Your password has changed successfully!'
        }
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}