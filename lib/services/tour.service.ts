'use server'

import { TourFormValues } from "@/components/TourForm"
import { verifyUserSession } from "./user.service"
import { cleanCachedDashboardStatistics, verifyUserPermission } from "./admin.service";
import { Actions } from "../auth";
import { tourSchema } from "@/schemas/tourSchema";
import { ToursStatuses, TourTypes, Wilaya } from "@prisma/client";





export const createTourRequest = async (values:TourFormValues,propertyId:string) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.create);
        const validation = tourSchema.safeParse(values);
        if (!validation.success){
            return{
                success:false,
                error:'Invalid form data!'
            }
        }
        const {agent_id,scheduledAt} = validation.data;
        const tourType = validation.data.tourType as TourTypes;
        const isExist = await prisma?.agent.findUnique({
            where:{
                id: agent_id
            }
        })
        if (!isExist){
            return {
                success:false,
                error: 'Agent does not exist!'
            }
        }

        await prisma?.tour.create({
            data:{
                type: tourType,
                scheduled_at: scheduledAt,
                agent_id: agent_id,
                user_id: session.user.id,
                property_id: propertyId
            }
        })
        const res = await cleanCachedDashboardStatistics('/admin');
        if (!res.success){
            return{
                success:false,
                error:'Failed to invalidate dashboard stats cache'
            }
        }
        return{
            success:true,
            message:'Your tour request has been sended successfuly and its under review!'
        }
    }
    catch(error){
        return {
            success:false,
            error:'Internal server error'
        }
    }
}



export const getUserTours = async() =>{
    try{
        const session = await verifyUserSession();
        const userId = session.user.id;
        const userTours = await prisma?.tour.findMany({
            where:{
                user_id: userId
            },
            select:{
                id:true,
                type:true,
                status:true,
                scheduled_at:true,
                created_at:true,
                Property:{
                    select:{
                        id:true,
                        name:true,
                        address:true,
                        wilaya:true,
                        price:true,
                        Media:{
                            select:{
                                photosSrcs:true
                            }
                        },
                    }
                },
                Agent:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        image:true,
                    }
                }
            }
        })
        const formattedUserTours = userTours?.map(item => ({
            ...item,
            scheduledAt: item.scheduled_at ? item.scheduled_at.toISOString() : '',
            createdAt: item.created_at ? item.created_at.toISOString() : '',
            property: {
                id: item.Property.id,
                name: item.Property.name,
                address: item.Property.address,
                wilaya: item.Property.wilaya,
                price: item.Property.price ? Number(item.Property.price) : 0,
                image: item.Property.Media?.photosSrcs?.[0] ?? null,
            },
            agent: {
                id: item.Agent.id,
                name: item.Agent.name,
                email: item.Agent.email,
                image: item.Agent.image ?? null,
            }
        }));
        return {
            success:true,
            userTours:formattedUserTours
        }
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}
export type UserTourItem = {
    id: string;
    type: TourTypes | null;
    status: ToursStatuses;
    scheduledAt: string;
    createdAt: string;
    property: {
        id: string;
        name: string;
        address: string;
        wilaya: Wilaya;
        price: number;
        image: string | null;
    };
    agent: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}



export const cancelUserTour = async(tourId:string) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.delete);
        const isExist = await prisma?.tour.findUnique({
            where:{
                id:tourId
            }
        })
        if (!isExist){
            return{
                success:false,
                error:'Tour does not exist!'
            }
        }
        if (isExist.user_id !== session.user.id){
            return{
                success:false,
                error: 'Unauthorized opertation!'
            }
        }
        await prisma?.tour.update({
            where:{
                id:tourId
            },
            data:{
                status:ToursStatuses.cancelled
            }
        })
        const res = await cleanCachedDashboardStatistics('/admin');
        if (!res.success){
            return{
                success:false,
                error:'Failed to invalidate deshboard stats cache'
            }
        }
        return {
            success:true,
            message:'Your tour has been cancelled successfuly'
        }
    }
    catch(error){
        return{
            success:false,
            error:'Internal server error'
        }
    }
}