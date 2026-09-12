'use server'

import { FurnishingOptions, ListingTypes, ParkingTypes, PreferredContactMethods, Prisma, PropertieStatuses, PropertyTypes, Wilaya } from "@prisma/client";
import { prisma } from "../prisma";
import { famousWilayas } from "../constants";
import { verifyUserSession } from "./user.service";
import { cleanCachedDashboardStatistics, verifyUserPermission } from "./admin.service";
import { Actions } from "../auth";
import { sellSchema } from "@/schemas/sellSchema";
import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";






type FilterParams = {
    wilaya?: Wilaya;
    page?: number;
    homeType?: PropertyTypes;
    type: "sale" | "rent";
    priceRange?: string,
    bedRooms?: number,
    bathRooms?: number,
    sortBy?: "price_asc" | "price_desc" | "newest" | "featured" | "area_desc";
};


    function getPriceCondition(priceRange:string){
        switch (priceRange){
            case "0-5000000":{
                return {lte:5000000}
            }
            case "5000000-10000000":{
                return {lte:10000000 , gte:5000000}
            }
            case "10000000-20000000":{
                return {lte:20000000,gte:10000000}
            }
            case "20000000-50000000":{
                return {lte:50000000, gte:20000000}
            }
            case "50000000-max":{
                return {gte: 50000000}
            }
            default:{
                return undefined
            }
        }
    }



export async function getAllListings(params:FilterParams){
    try{
        const limit = 10;
    const currentPage = Math.max(params?.page || 1, 1);
    const skip = (currentPage - 1) * limit;
    const isValidWilaya = (value:string) =>{
        if (!value) return false;
        const trimmed = value.trim();
        return Object.values(Wilaya).includes(trimmed as Wilaya);
    }
    const validateWilaya = isValidWilaya(params.wilaya as Wilaya) ? params.wilaya?.trim() as Wilaya : undefined;

    const priceCondition = getPriceCondition(params.priceRange ?? '');
    const whereClause: Prisma.PropertyWhereInput = {
        listingType: params.type,
        wilaya: validateWilaya,
        ...(
            params.homeType !== 'all' ? 
                {propertyType: params.homeType} : {}
        ),
        ...(
            params.bedRooms || params.bathRooms ?
                {
                    Property_Details:{
                        bathRooms: params.bathRooms,
                        bedRooms: params.bedRooms
                    }
                }
            : {}
        ),
        price: priceCondition
    }

    let orderClause: Prisma.PropertyOrderByWithRelationInput[];
    switch (params.sortBy) {
        case 'price_asc':
            orderClause = [{ price: 'asc' },{created_at:'desc'}];
            break;
        case 'price_desc':
            orderClause = [{ price: 'desc' },{created_at:'desc'}];
            break;
        case 'area_desc':
            orderClause = [{ Property_Details: { areaSurface: 'desc' } },{created_at:'desc'}];
            break;
        case 'featured':
        case 'newest':
        default:
            orderClause = [{ created_at: 'desc' }];
            break;
    }


    const [totalListings,pageListings] = await Promise.all([
        prisma.property.count({
            where: whereClause
        }),
        prisma.property.findMany({
            take:limit,
            skip:skip,
            where: whereClause,
            orderBy:orderClause,
            include:{
                Property_Details:{
                    select:{
                        bathRooms: true,
                        bedRooms: true,
                        areaSurface: true,
                    }
                },
                seller:{
                    select:{
                        location:true,
                        name:true,
                        email:true,
                        image:true,
                    }
                },
                Media:{
                    select:{
                        photosSrcs: true,
                    }
                }
            }
        })
    ]);
    const totalPages = Math.ceil(totalListings / limit);
    const formattedListings = pageListings.map((listing) => ({
        ...listing,
        price: listing.price.toNumber(),
    }))
    return {
        pageListings:formattedListings,
        totalPages,
        currentPage
    }
    }
    catch(error){
        console.error('getAllListings failed:', error);
    throw error;
    }
}

export type ListingInfos = Awaited <
        ReturnType<typeof getAllListings>
    >['pageListings'][number];





export async function getPropertyDetails(id:string){
    try{
        if (!id){
        return {}
    }
    const propertyDetails = await prisma.property.findUnique({
        where:{
            id: id
        },
        include:{
            Media:{
                select:{
                    photosSrcs: true,
                }
            },
            Property_Details:true,
            Key_Features:true,
            seller:{
                select:{
                    contactInfo:true,
                    image:true,
                    location:true,
                    name:true
                }
            }
        }
    })
    if (!propertyDetails){
        return {}
    }
    const formattedPropertyDetails = {...propertyDetails,
        price: propertyDetails.price ?  Number(propertyDetails.price) : 0
    }
    return {
        propertyDetails:formattedPropertyDetails
    }
    }
    catch(error){
        console.log('get Property details error:',error)
        return{
            success:false,
            error:'Internal server error'
        }
    }
}

export type PropertyDetails = Awaited <
        ReturnType<typeof getPropertyDetails>
    >['propertyDetails'];




export async function getPopularLocations(){
    try{
        const limit = 4;
        const popularWilayas:Wilaya[] = [
            Wilaya.batna,
            Wilaya.setif,
            Wilaya.tlemcen,
            Wilaya.oran,
            Wilaya.alger,
            Wilaya.constantine,
            Wilaya.blida
        ];
        const popularLocations = await prisma.property.groupBy({
            by:['wilaya'],
            _count:{
                wilaya: true,
            },
            where:{
                wilaya:{
                    in: popularWilayas
                }
            },
            orderBy:{
                _count:{
                    wilaya:"desc"
                }
            },
            take:limit
        })
        if (popularLocations.length === 0){
            const safePopularWilayas = await prisma.property.findMany({
                distinct:['wilaya'],
                select:{
                    wilaya:true,
                    Media:{
                        select:{
                            photosSrcs:true
                        }
                    }
                },
                orderBy:[
                    {wilaya:'asc'},
                    {created_at:'desc'}
                ],
                take:limit
            })
            const formattedSafeLocations = safePopularWilayas.map(item => ({
                wilaya: item.wilaya,
                imageSrc: item.Media?.photosSrcs?.[0] || '',
                numberOfListings : undefined
            }))
            return{
                success:true,
                popularLocations: formattedSafeLocations
            }
        }
        const formattedPopularLocations = popularLocations.map((item) => ({
            wilaya: item.wilaya,
            numberOfListings: item._count.wilaya,
            imageSrc: famousWilayas[item.wilaya.toLowerCase().replace(/\s+/g, "_")]
        }))
        
        return {
            success:true,
            popularLocations: formattedPopularLocations
        }
    }
    catch(error){
        return {
            success:false,
            popularLocations: [],
            error: 'Internal server error'
        }
    }
    
}

export type  PopularLocations = Awaited <
    ReturnType<typeof getPopularLocations>
>['popularLocations'][number]


export const getFeaturedListings = async () =>{
    try{
        const limit = 4;
        const featuredListings = await prisma.property.findMany({
            take: limit,
            orderBy:{
                created_at:'desc'
            },
            select:{
                Media:{
                    select:{
                        photosSrcs:true,
                    }
                },
                Property_Details:{
                    select:{
                        bedRooms:true,
                        bathRooms:true,
                        areaSurface:true,
                    }
                },
                listingType:true,
                price:true,
                address:true,
                propertyType:true,
                wilaya:true,
                id:true
            }
        })
        const formattedFeaturedListings = featuredListings.map(listing => ({
            ...listing,
            imageSrc: listing.Media?.photosSrcs[0] || undefined,
            price: listing.price ? Number(listing.price) : 0,
            propertyType: listing.propertyType,
            wilaya:listing.wilaya
            
        }))
        return {
            success:true,
            featuredListings: formattedFeaturedListings,
        }
    }
    catch(error){
        return {
            success:false,
            featuredListings: [],
            error: 'Internal server error'
        }
    }
}







export const addPropertiy = async (values:sellProperetyOutput) =>{
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.create);
        const sellerId = session.user.id;
        const validation = sellSchema.safeParse(values);
        if (!validation.success){
            return {
                success:false,
                error:'Invalid form data'
            }
        }
        const safeValues = validation.data;
        const propertyInfos = {
            name: safeValues.propertyTitle,
            wilaya: safeValues.propertyWilaya as Wilaya,
            price: safeValues.price,
            propertyType: safeValues.propertyType as PropertyTypes,
            address: safeValues.propertyAddress,
            listingType: safeValues.listingType as ListingTypes,
            seller_id: sellerId
        }
        const propertyDetails = {
            bedRooms: safeValues.bedRooms,
            bathRooms: safeValues.bathRooms,
            areaSurface: safeValues.squareFootage,
            lotSize: safeValues.lotSize || undefined,
            builtYear: safeValues.builtYear,
            parkingType: safeValues.parkingType as ParkingTypes,
            furnishing: safeValues.furnishing as FurnishingOptions || undefined,
            description: safeValues.properetyDescription,
        }
        const keyFeatures = {
            airConditioning: safeValues.airConditioning,
            petFriendly: safeValues.petFriendly,
            pool: safeValues.pool,
            inUnitLaundry: safeValues.inUnitLaundry,
            firePlace: safeValues.fireplace,
            balconyPatio: safeValues.balconyPatio,
            smartHomeFeatures: safeValues.smartHomeFeatures,
            walkInClosets: safeValues.walkInClosets,
            securitySystem: safeValues.securitySystem
        }
        const {photos }= validation.data;
        
        const media = {
            photosSrcs: photos || [],
            videoUrl: safeValues.video || undefined,
            tourVideoUrl: safeValues.virtualTourVideo || undefined
        }
        const userContactInfos = {
            email: safeValues.email,
            phone: safeValues.phoneNumber,
            preferredContactMethod: safeValues.preferredContactMethod as PreferredContactMethods,
        }

        const [,newProperty ] = await prisma.$transaction([
            prisma.user_Contact.upsert({
                where:{
                    userId: sellerId
                },
                create: {...userContactInfos,userId:sellerId},
                update: userContactInfos
            }),
            prisma.property.create({
                data:{
                    ...propertyInfos,
                    Property_Details:{
                        create: propertyDetails,
                    },
                    Media:{
                        create: media
                    },
                    Key_Features:{
                        create: keyFeatures
                    },   
                    
                },
            })
        ])
        const res = await cleanCachedDashboardStatistics('/admin');
        if (!res.success){
            return {
                success:false,
                error: 'Failed to invalidate dashboard stats cache'
            }
        }
        return {
            success:true,
            message: `Your ${newProperty.propertyType.toLowerCase()} \"${newProperty.name}\" has been submitted successfully! It is currently under review and will go live once approved.`
        }  
    }
    catch(error){
        console.log(error)
        return{
            success:false,
            error: 'Internal server error'
        }
    }
}



export const deleteUserProperty = async(propertyId:string) => {
    try{
        const session = await verifyUserSession();
        await verifyUserPermission(session.user.id,Actions.delete);
        const isExist  = await prisma.property.findFirst({
            where:{
                id:propertyId,
                seller:{
                    id:session.user.id
                }
            }
        })
        if (!isExist){
            return {
                success:false,
                error: 'Property does not exist!'
            }
        }
        await prisma.property.update({
            where: {
                id: propertyId
            },
            data: {
                status: PropertieStatuses.expired
            }
        });
        const res = await cleanCachedDashboardStatistics('/admin');
        if (!res.success){
            return{
                success:false,
                error: 'Failed to invalidate dashboard stats cache'
            }
        }
        return{
            success:true,
            message:'Property has been deleted successfully'
        }
    }
    catch(error){
        return{
            success:false,
            error: 'Internal server error'
        }
    }
}