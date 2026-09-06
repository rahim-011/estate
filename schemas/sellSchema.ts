import z, { literal} from "zod";
import { propertyKeys, WILAYA_KEYS, WILAYAS } from "@/lib/constants";
import { PropertyTypes } from "@prisma/client";


export const sellSchema = z.object({

    //Basic information
    propertyTitle: z.string().min(5,{message:'Property name must be at least 5 characters'}),
    propertyWilaya: z.enum(WILAYA_KEYS,{
        message:'Please select a valid wilaya'
    }),
    propertyAddress: z.string().min(5,{message:'Property address must be at least 5 characters'}),
    listingType: z.string().min(1,{message:'Please select a listing type'}),
    price: z.coerce.number({message:'Price must be a number'}).positive({message:'Price must be positive'}),
    propertyType: z.enum(propertyKeys,{message:'Please select a valid property type'}),

    //Proprety details
    bedRooms: z.coerce.number({message:'Number of bed rooms must be a number'}).positive({message:'Number of bed rooms must be positive'}),
    bathRooms: z.coerce.number({message:'Number of bath rooms must be a number'}).positive({message:'Number of bath rooms must be positive'}),
    squareFootage: z.coerce.number({message:'Square footage must be a number'}).positive({message:'Square footage must be positive'}),
    lotSize: z.coerce.number({message:'Lot size must be a number'}).positive({message:'Lot size must be positive'}).or(literal('')).optional(),
    builtYear: z.coerce.number({message:'Built year must be a number'}).positive({message:'Built year must be positive'}).min(1800,{message:'Invalid built year'}),
    parkingType: z.string().min(2,{message:'Parking type must be at least 2 characters'}),
    furnishing: z.string().min(2,{message:'Furnishing must be at least 2 characters'}).or(literal('')).optional(),


    //Key features
    airConditioning: z.boolean().default(false),
    petFriendly: z.boolean().default(false),
    smartHomeFeatures: z.boolean().default(false),
    inUnitLaundry: z.boolean().default(false),
    pool: z.boolean().default(false),
    walkInClosets: z.boolean().default(false),
    balconyPatio: z.boolean().default(false),
    fireplace: z.boolean().default(false),
    securitySystem: z.boolean().default(false),

    //Proprety description
    properetyDescription: z.string().min(10,{message:'Proprety description must be at least 10 characters'}),

    //photo & media upload 
    photos: z.array(z.string()).min(1, "At least 1 photo is required"),
    video: z.url('Please enter a valid video URL').or(literal('')).optional(),
    virtualTourVideo: z.url('Please enter a valid video URL').or(literal('')).optional(),

    //Contact infos
    fullName: z.string().min(2,{message:'Full name must be at least 2 characters'}),
    email: z.email({message:'Invalid email address'}),
    phoneNumber: z.string().min(10,'Invalid phone number'),
    preferredContactMethod: z.string().min(2,{message:'Contact method must be at least 2 characters'})
})