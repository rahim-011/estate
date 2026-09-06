import { TourTypesKeys } from "@/lib/constants";
import z from "zod";




export const tourSchema = z.object({
    tourType: z.enum(TourTypesKeys,{message:'Please select a tour type'}),
    scheduledAt: z.date({message:'Please select tour time'}),
    agent_id: z.string().min(1,{message:'Agent Id is required'})
})