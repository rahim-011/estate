'use server'

import QRCode from 'qrcode'
import { verifyUserSession } from "./user.service"
import {generateSecret,generateURI,verify} from 'otplib'
import { TwoAuthValues } from '@/components/TwoFactorModel'
import { otpCodeSchema } from '@/schemas/userSchemas'

export const generateSecretQrCode = async() =>{
    try{
        const session = await verifyUserSession();
        const secret = generateSecret();
        await prisma?.twoFactor.upsert({
            where:{
                user_id:session.user.id
            },
            create:{
                user_id:session.user.id,
                secret:secret
            },
            update:{
                secret
            }
        })
        const serviceName = 'Estate';
        const userEmail = session.user.email;
        const otpAuthuUrl = generateURI({
            secret,
            label:userEmail,
            issuer:serviceName
        });

        const qrUrl = await QRCode.toDataURL(otpAuthuUrl);
        return {
            success:true,
            qrUrl,
            secret
        }
    }
    catch(error){
        return{
            success:false,
            error:'Failed to generate the qroCode'
        }
    }
}


export const verifyUserOtpCode = async (values:TwoAuthValues) =>{
    try{
        const session = await verifyUserSession();
        const validation = otpCodeSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error:'Invalid OTP Code'
            }
        }
        const token = validation.data.otpCode;
        const userId = session.user.id;
        const currentTwoFactor = await prisma?.twoFactor.findUnique({
            where:{
                user_id:userId
            }
        })
        if (!currentTwoFactor?.secret){
            return {
                success: false,
                error: 'No setup found. Please scan the QR code first.'
            }
        }
        if (currentTwoFactor?.is_enabled){
            return{
                success:false,
                error:'Two-Factor Authentication is already enabled'
            }
        }
        const res = await verify({
            token,
            secret: currentTwoFactor.secret
        });
        const isValid = typeof res === 'boolean' ? res : res?.valid;
        if (!isValid){
            return {
                success:false,
                error: 'Incorrect OTP Code'
            }
        }
        await prisma?.twoFactor.update({
            where:{
                user_id:userId
            },
            data:{
                is_enabled:true
            }
        })
        return{
            success:true,
            message:'2FA has been enabled successfully'
        }
    }
    catch(error){
        return {
            success:false,
            error: 'Internal server error'
        }
    }
}


export const disableTwoFactor = async () =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const currentTwoFactor = await prisma?.twoFactor.findFirst({
            where:{
                user_id:userId
            }
        });
        if (!currentTwoFactor?.is_enabled){
            return {
                success:false,
                error:'Two Factor Authentication is already disabled'
            }
        }
        await prisma?.twoFactor.delete({
            where:{
                user_id:userId
            }
        })

        return{
            success:true,
            message:'Two Factor Authentication has been disabled successfully'
        }
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}


export const getTwoFactorStatus = async (userEmail:string) =>{
    try{
        if (!userEmail){
            return {
                success:false,
                isEnabled:false,
                error:'Email is required'
            }
        }
        const currentUser = await prisma?.user.findUnique({
            where:{
                email:userEmail
            },
            select:{
                id:true,
                twoFactor:{
                    select:{is_enabled:true}
                }
            }
        })
        return{
            success:true,
            isEnabled:currentUser?.twoFactor?.is_enabled
        }
    }
    catch(error){
        return {
            success:false,
            error:'Internal server error',
            isEnabled:false
        }
    }
}


export const verifyLoginOtp = async(values:TwoAuthValues,userEmail:string) =>{
    try{
        if (!userEmail){
            return {
                success:false,
                error:'Unauthorized'
            }
        }
        const validation = otpCodeSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error: 'Invalid OTP Code'
            }
        }
        const token = validation.data.otpCode;
        const currentUser  = await prisma?.user.findUnique({
            where:{
                email:userEmail
            },
            select:{
                twoFactor:{
                    select:{
                        secret:true
                    }
                }
            }
        })
        const otpCode = currentUser?.twoFactor?.secret;
        if (!otpCode) {
            return {
                success:false,
                error:'Missed secret code!'
            }
        }
        const res = await verify({
            token,
            secret:otpCode
        })
        const isValid = typeof res === 'boolean' ? res : res?.valid;
        if (!isValid){
            return{
                success:false,
                error: 'Incorrect OTP Code'
            }
        }
        return{
            success:true,
            message:'Login in successfully'
        }
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}