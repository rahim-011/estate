'use server'

import {cache} from 'react'
import { redis } from '../redis'
import { Actions,auth } from '../auth'
import { headers } from 'next/headers'
import { prisma } from '../prisma'
import { ListingTypes, PropertieStatuses, ToursStatuses } from '@prisma/client'
import { verifyUserSession } from './user.service'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'



export const verifyUserPermission = cache(
  async (userId: string, action: Actions) => {
    const allowedActions = ["create", "update", "delete"];

    if (!allowedActions.includes(action)) {
      throw new Error("Invalid action");
    }

    const { success } = await auth.api.userHasPermission({
      body: {
        userId,
        permissions: {
          property: [action],
        },
      },
      headers: await headers(),
    });

    if (!success) {
      throw new Error("Unauthorized");
    }

    return true;
  }
);


export const getCachedDashboardStatistics = cache (async () =>{
    try{
        const session = await verifyUserSession();
        const cacheKey = `estate:dashboard-statistics`;
        const cachedDashboardStatistics = await redis.get(cacheKey);
        if (cachedDashboardStatistics){
            return cachedDashboardStatistics
        }
        const [totalUsers,totalActiveProperties,totalPendingProperties,totalTourRequests] = await Promise.all([
            prisma.user.count(),
            prisma.property.count({
                where:{
                    status:PropertieStatuses.active
                }
            }),
            prisma.property.count({
                where:{
                    status: PropertieStatuses.pending
                }
            }),
            prisma.tour.count()
        ])
        const dashboardStatistics = {totalUsers,
                totalActiveProperties,
                totalPendingProperties,
                totalTourRequests
            };
        await redis.set(cacheKey,dashboardStatistics,{ex:600})
        return dashboardStatistics
    }
    catch(error){
        return {
            success:false,
            error: 'Internal server error'
        }
    }
})


export const cleanCachedDashboardStatistics = async (path:string) =>{
    try{
        await redis.del(`estate:dashboard-statistics`);
        if (path){
            revalidatePath(path)
        }
        return {
            success:true
        }
    }
    catch(error){
        return{
            success:false
        }
    }
}


export const getPendingDataReview = async () =>{
    try{
        const session = await verifyUserSession();
        const limit = 5;
        const [pendingListingsReview,pendingToursReview] =  await Promise.all([
            prisma.property.findMany({
                where:{
                    status: PropertieStatuses.pending
                },
                select:{
                    id:true,
                    name:true,
                    listingType:true,
                    price:true,
                    seller:{
                        select:{
                            email:true
                        }
                    }
                },
                take:limit,
                orderBy:{
                    created_at:'desc'
                }
            }),
            prisma.tour.findMany({
                where:{
                    status: ToursStatuses.pending
                },
                select:{    
                    status:true,
                    scheduled_at:true,
                    Property:{
                        select:{
                            name:true
                        }
                    },
                    user:{
                        select:{
                            name:true
                        }
                    }
                },
                take:limit,
                orderBy:{
                    created_at:'desc'
                }
            })
        ])
        const formattedListingsReview = pendingListingsReview.map(item => ({
            ...item,
            price: item.price ? Number(item.price) : 0
        })) 
        const formattedToursReview = pendingToursReview.map(item => ({
            ...item,
            scheduled_at: item.scheduled_at ? item.scheduled_at.toISOString() : undefined
        })) 
        return {
            success:true,
            pendingListingsReview:formattedListingsReview,
            pendingToursReview:formattedToursReview
        }
    }
    catch(error){
    console.log('Pending listings function error:', error);
    return {
        success:false,
        error: error instanceof Error ? error.message : 'Internal server error'
    }
}
}



export const getPendingListings = async (filterType:ListingTypes,search:string) =>{
    try{
        const session = await verifyUserSession();
        const WhereClause:Prisma.PropertyWhereInput = {
            status: PropertieStatuses.pending, 
            ...(
                filterType === 'rent' ? {listingType:ListingTypes.rent} : filterType === 'sale' ? {listingType:ListingTypes.sale} : undefined
            ),
            ...(
                search && {
                    OR:[
                        {name:{contains:search,mode:'insensitive'}},
                        {seller:{email:{contains:search,mode:'insensitive'}}}
                    ]
                }
            )
        }
        const pendingListings = await prisma.property.findMany({
            where:WhereClause,
            select:{
                id:true,
                name:true,
                wilaya:true,
                address:true,
                listingType:true,
                price:true,
                status:true,
                seller:{
                    select:{
                        email:true
                    }
                },
                Property_Details:{
                    select:{
                        description:true,
                        bathRooms:true,
                        bedRooms:true,
                        areaSurface:true
                    }
                },
                Media:{
                    select:{
                        photosSrcs:true
                    }
                },
                created_at:true
            }
        });
        const formattedPendingListings = pendingListings.map(listing => ({
            ...listing,
            price: listing.price ? Number(listing.price) : 0,
            date: listing.created_at ? listing.created_at.toString() : undefined,
            email: listing.seller.email,
            image: listing.Media?.photosSrcs[0]?.toString(),
        }))
        return {
            pendingListings:formattedPendingListings,
            success:true
        }
    }
    catch(error){
        return {
            success:false,
            error:'Internal server error'
        }
    }
}



export const getAllProperties = async(filterStatus:PropertieStatuses,search:string) =>{
    try{
        const session = await verifyUserSession();
        const whereClause:Prisma.PropertyWhereInput = {
            ...(
                filterStatus === 'active' ? {status:PropertieStatuses.active} : filterStatus === 'expired' ? {status:PropertieStatuses.expired} :
                filterStatus === 'pending' ? 
                {status:PropertieStatuses.pending} : {} 
            ),
            ...(
                search && {
                    OR:[
                        {name:{contains:search,mode:'insensitive'}},
                        {address:{contains:search,mode:'insensitive'}}
                    ]
                }
            )
        }
        const allProperties = await prisma.property.findMany({
            where:whereClause,
            select:{
                Media:{
                    select:{
                        photosSrcs:true
                    }
                },
                name:true,
                address:true,
                wilaya:true,
                listingType:true,
                price:true,
                status:true,
                id:true
            }
        });
        const formattedProperties = allProperties.map(item => ({
            ...item,
            image: item.Media?.photosSrcs[0].toString(),
            price: item.price ? Number(item.price) : 0
        }));
        return {
            success:true,
            allProperties:formattedProperties
        }
    }
    catch(error){
        return{
            success:false,
            error: 'Internal server error'
        }
    }
}
export type PropertiesList = Awaited<
    ReturnType<typeof getAllProperties>
>['allProperties']


export const changePropertyStatus = async(newStatus:PropertieStatuses,propertyId:string) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.update);
        const currentProperty = await prisma.property.findUnique({
            where:{
                id:propertyId
            },
            select:{status:true}
        })
        const normalizedStatus = newStatus.toLowerCase() as PropertieStatuses;
        if (currentProperty?.status === newStatus){
            return{
                success:true,
                message:'Property status is already up to date'
            }
        }
        await prisma.property.update({
            where:{
                id:propertyId
            },
            data:{
                status: normalizedStatus
            }
        })
        return {
            success:true,
            message: `Property status has been updated successfully to ${newStatus}`
        }
    }
    catch(error){
        return {
            success:false,
            error:'Internal server error'
        }
    }
}



export const getAllTours = async (status:ToursStatuses | 'allStatuses',search:string) =>{
    try{
        const session = verifyUserSession();
        const whereClause:Prisma.TourWhereInput = {
            ...(
                status === 'allStatuses' ? undefined : {status:status} 
            ),
            ...(search ? {
                OR:[
                    {Property:{name:{contains:search,mode:'insensitive'}}},
                    {user:{contactInfo:{email:{contains:search,mode:'insensitive'}}}}
                ]
            }:{})
        }
        const allTours = await prisma.tour.findMany({
            where: whereClause,
            select:{
                id:true,
                status:true,
                scheduled_at:true,
                user:{
                    select:{
                        contactInfo:{
                            select:{
                                phone:true,
                                email:true
                            }
                        },
                        name:true,
                    },
                },
                Property:{
                    select:{
                        name:true,
                        propertyType:true,
                        Media:{
                            select:{
                                photosSrcs:true
                            }
                        }
                    },
                },
            }  
        })
        const formattedTours = allTours.map(tour => ({
            ...tour,
            clientName: tour.user.name,
            scheduled_at: tour.scheduled_at ? tour.scheduled_at.toString() : undefined,
            phone:tour.user.contactInfo?.phone,
            email:tour.user.contactInfo?.email,
            name:tour.Property.name,
            propertyType: tour.Property.propertyType,
            image: tour.Property.Media?.photosSrcs[0].toString() ?? undefined
        }))
        return {
            success:true,
            allTours:formattedTours
        }
    }
    catch(error){
        return {
            success:false,
            error: 'Internal server error'
        }
    }
}

export type ToursList = Awaited<
    ReturnType<typeof getAllTours>
>['allTours']




export const changeTourStatus = async(newStatus:ToursStatuses,tourId:string) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.update);
        const currentTour = await prisma.tour.findUnique({
            where:{
                id:tourId
            },
            select:{status:true}
        })
        if (currentTour?.status === newStatus){
            return{
                success:true,
                message:'Property status is already up to date'
            }
        }
        await prisma.tour.update({
            where:{
                id:tourId
            },
            data:{
                status: newStatus
            }
        })
        return {
            success:true,
            message: `Tour status has been updated successfully to ${newStatus}`
        }
    }
    catch(error){
        return {
            success:false,
            error:'Internal server error'
        }
    }
}



export const acceptPropertyRequests = async(propertyId:string) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.update);
        const isExist = await prisma.property.findFirst({
            where:{
                id:propertyId
            }
        })
        if (!isExist){
            return{
                success:false,
                error:'Property does not exist!'
            }
        }
        await prisma.property.update({
            where:{
                id:propertyId
            },
            data:{
                status:'active'
            }
        })
        const res = await cleanCachedDashboardStatistics('/admin');
        if (!res.success){
            return {
                success:false,
                error: 'Failed to invalidate dashboard stats cache'
            }
        }
        return{
            success:true,
            message:'User proeprty has been accepted!'
        }
    }
    catch(error){

    }
}
