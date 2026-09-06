'use client'

import { toast } from "sonner";
import { ToursStatuses } from "@prisma/client";
import { useTransition } from "react";
import { changeTourStatus } from "@/lib/services/admin.service";


export default function TourSelect({status,tourId}:{status:ToursStatuses,tourId:string}){
    const [isPending,startTransisiton] = useTransition();
    const handleChangeStatus =(newStatus:ToursStatuses,propertyId:string) =>{
        toast.dismiss();
        const toastId = toast.loading('Changing property status...');
        startTransisiton(async ()=>{
        try{
            const res = await changeTourStatus(newStatus,propertyId);
            if(!res.success){
            toast.error(res.error,{id:toastId});
            return;
            }
            toast.success(res.message,{id:toastId});
        }
        catch(error){
            toast.error('Something went wrong',{id:toastId})
        }
    })
    }
    return(
        <select
            disabled={isPending}
            value={status}
            onChange={(e) => handleChangeStatus(e.target.value as ToursStatuses,tourId)}
            className="text-xs px-2.5 py-2 border border-black/15 rounded-lg bg-white font-medium text-gray-800 focus:outline-none focus:border-black/40 cursor-pointer shadow-sm hover:border-black/30 transition-colors"
            >
            <option value="pending">pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
        </select>
    )
}