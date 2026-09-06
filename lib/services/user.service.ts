'use server'

import { redis } from '../redis'
import {cache} from 'react'
import { auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '../prisma'
import { accountSettingsSchema, changePasswordSchema, userProfileSchema,userContactSchema } from '@/schemas/userSchemas'
import type { AccountSettingsValues } from '@/components/AccountSettingsForm'
import { revalidatePath } from 'next/cache'
import { ChangePasswordValues } from '@/components/ChangePasswordForm'
import { UserProfileValues } from '@/components/EditUserProfile'
import cloudinary from '../cloudinary'
import { UserContactValues } from '@/components/EditUserContact'
import { ListingTypes, PropertieStatuses, Wilaya } from '@prisma/client'




export const getCachedUser = cache(async () =>{
    try{
        const session = await verifyUserSession();
        const cacheKey = `estate:user:${session.user.id}`;
        const cashedUser = await redis.get(cacheKey);
        if (cashedUser){
            return cashedUser
        }
        const user = await prisma.user.findUnique({
            where:{
                id: session.user.id
            }
        })
        if (user){
            await redis.set(cacheKey,user,{ex:600})
        }
        return  user
    }
    catch(error:any){
        return {
            success:false,
            error: 'Something went wrong'
        }
    }
})

export const cleanUserCache = async (userId:string | undefined,path:string ) =>{
    try{
        await redis.del(`estate:user:${userId}`);
        revalidatePath(path)
        return {
            success:true
        }
    }
    catch(error){
        return {success:false}
    }
}


export const verifyUserSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session;
});

export const changeAccountSettings =  async (values:AccountSettingsValues)=>{
    try{
        const session = await verifyUserSession();
        const validation = accountSettingsSchema.safeParse(values);
        if (!validation.success){
            return {
                success:false,
                error: 'Invalid form values'
            }
        }
        const userId = session.user.id;
        const currentUser = await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                location:true
            }
        })
        const {fullName,email,location} = validation.data;
        const hasEmailChanged = session.user.email !== email;
        const hasLocationChanged = currentUser?.location !== location;
        const hasNameChanged = session.user.name !== fullName;
        if (!hasEmailChanged && !hasLocationChanged && !hasNameChanged){
            return {
                success:false,
                error:'No changes detected'
            }
        }
        if (email && email !== session?.user.email){
            await auth.api.changeEmail({
                body:{
                    newEmail: email
                },
                headers: await headers()
            })
        }
        if (fullName && hasNameChanged){
            await auth.api.updateUser({
                body:{
                    name: fullName
                },
                headers: await headers()
            })
        }
        if (hasLocationChanged){
            await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    location: location
                }
            })
        }
        const result = await cleanUserCache(userId,'/settings');
        if (!result.success){
            return {
                success:false,
                error: 'Failed to invalidate user cache'
            }
        }
        return {
            success:true,
            message:'User data has been updated successfully'
        }

    }
    catch(error:any){
        return {
            success:false,
            error:'Something went wrong'
        }
    }


}



export const changeUserPassword = async (values:ChangePasswordValues) =>{
    try{
        const session = await verifyUserSession();
        const validation = changePasswordSchema.safeParse(values);
        if (!validation.success){
            return {
                error:'Invalid  form data',
                success:false
            }
        }
        const {currentPassword,newPassword} = validation.data;
        const hasNoChanges = currentPassword === newPassword;
        if (hasNoChanges){
            return{
                success:false,
                error:'No changes detected'
            }
        }
        await auth.api.changePassword({
            body:{
                newPassword: newPassword,
                currentPassword: currentPassword
            },
            headers: await headers()
        })
        const userId = session.user.id;
        const result = await cleanUserCache(userId,'/settings/privacy')
        if (!result.success){
            return {
                success:false,
                error:'Failed to invalidate user cache'
            }
        }
        return{
            success:true,
            message: 'Password has been updated successfully'
        }
    }
    catch(error:any){
        return {
            success:false,
            error :'Something went wrong'
        }
    }  
}




export async function changeUserInfos(values:UserProfileValues){
    try{
        const session = await verifyUserSession();
        const validation = userProfileSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error: 'Invalid form data'
            }
        }
        const {fullName,pfpImage} = validation.data;
        const userId = session.user.id;
        const currentUser = await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                image: true
            }
        })
        const hasNoChanges = (currentUser?.image === pfpImage && fullName === session.user.name);
        if (hasNoChanges){
            return {
                success:false,
                error: 'No changed detected'
            }
        }
        await auth.api.updateUser({
            body:{
                name: fullName
            },
            headers: await headers()
        })
        let finalImageUrl = pfpImage ?? currentUser?.image ;
        const isNewBase64 = typeof pfpImage === "string" && pfpImage.startsWith("data:image");

        if (isNewBase64) {
            const upload = await cloudinary.uploader.upload(pfpImage, {
                folder: "state/users/avatars",
                resource_type: 'image'
            });
            finalImageUrl = upload.secure_url;
        }

        
        await prisma.user.update({
            where: { id: userId },
            data: { image: finalImageUrl.toString() }
        });
        const result = await cleanUserCache(userId,'/profile');
        if(!result.success){
            return{
                success:false,
                error: 'Failed to invalidate user cache'
            }
        }
        return {
            success: true,
            message: 'User info updated successfully',
            pfpImgSrc: finalImageUrl
        };
    }
    catch(error:any){
        return {
            success:false,
            error: 'Something went wrong'
        }
    }
}





export const ChangeUserContactInfos  = async (values:UserContactValues) =>{
    try{
        const session = await verifyUserSession();
        const validation = userContactSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error: 'Invalid form data'
            }
        }
        const {email,preferredContact,location,phone} = validation.data;
        const userId = session.user.id;
        const currentContactInfos = await prisma.user_Contact.findUnique({
            where:{
                userId: userId
            },
            select:{
                email:true,
                phone: true,
                preferredContactMethod:true,
                user:{
                    select:{
                        location:true
                    }
                }
            }
            
        })
        const hasNoChanges = currentContactInfos?.email === email && currentContactInfos?.phone === phone && preferredContact === currentContactInfos?.preferredContactMethod && location === currentContactInfos?.user?.location;
        if (hasNoChanges){
            return {
                success:false,
                error: 'No changes detected'
            }
        }

        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                location:location,
                contactInfo:{
                    upsert:{
                        create:{
                            email,
                            phone,
                            preferredContactMethod:preferredContact
                        },
                        update:{
                            email,
                            phone,
                            preferredContactMethod:preferredContact
                        }
                    }
                }
            },
        })
        const result = await clearContactInfosCache(userId,'/profile');
        if (!result.success){
            return {
                success:false,
                error:'Failed to invalidate user contact infos cache'
            }
        }
        return {
            success:true,
            message: 'User contact infos has been updated successfully'
        }
    }
    catch(error){
        return{
            success:false,
            error: 'Internal server error'
        }
    }
}

export const getCachedContactInfos = cache(async () =>{
    try{    
        const session = await verifyUserSession();
        const userId = session.user.id;
        const cacheKey = `estate:contact-infos:${userId}`;
        const cachedContactInfos = await redis.get(cacheKey);
        if (cachedContactInfos){
            return cachedContactInfos
        }

        const userContactInfos = await prisma.user.findUnique({
            where:{
                id: userId
            },
            select:{
                location:true,
                contactInfo:{
                    select:{
                        preferredContactMethod:true,
                        email:true,
                        phone: true
                    }
                }
            }
        })
        if (userContactInfos){
            await redis.set(cacheKey,userContactInfos,{ex:600})
        }
        return userContactInfos
    }
    catch(error){
        return {
            success:false,
            error: 'Internal server error'
        }
    }
})


export const clearContactInfosCache = async (userId:string,path:string) =>{
    try{
        await redis.del(`estate:contact-infos:${userId}`);
        if (path){
            revalidatePath(path)
        }
        return {
            success:true
        }
    }
    catch(error){
        return {
            success:false
        }
    }
}



export const getUserProperties = async () =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const userProperties = await prisma.property.findMany({
            where:{
                seller_id: userId
            },
            select:{
                name:true,
                wilaya:true,
                address:true,
                price:true,
                status:true,
                id:true,
                listingType:true,
                Media:{
                    select:{
                        photosSrcs:true
                    }
                },
                Property_Details:{
                    select:{
                        bathRooms:true,
                        bedRooms:true,
                        areaSurface:true,
                        description:true
                    }
                }
            }
        })
        const formattedData = userProperties.map(item => ({
            ...item,
            price: item.price ? Number(item.price) : 0
        }))
        return {
            success:true,
            userProperties:formattedData
        }
    }
    catch(error){
        return{
            success:false,
            error: 'Internal server error',
            userProperties:[]
        }
    }
}

export type UserProperty = {
  name: string;
  id:string;
  listingType: ListingTypes;
  address: string;
  wilaya: Wilaya;
  price: number;
  status:PropertieStatuses ;
  Media: { photosSrcs: string[] } | null;
  Property_Details: { bedRooms: number; bathRooms: number; areaSurface: number;description: string; } | null;
};




