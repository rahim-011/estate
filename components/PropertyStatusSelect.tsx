'use client'

import { toast } from "sonner";
import { PropertieStatuses } from "@prisma/client";
import { useState, useTransition } from "react";
import { changePropertyStatus } from "@/lib/services/admin.service";


export default function StatusSelect({propertyId,status}:{propertyId:string,status:string}){
    const [isPending,startTransisiton] = useTransition();
    const [selectedStatus,setSelectedStatus] = useState<PropertieStatuses>(status as PropertieStatuses);
    const statuses = [
        {label:'Expired',value:PropertieStatuses.expired},
        {label:'Pending',value:PropertieStatuses.pending},
        {label:'Active',value:PropertieStatuses.active}
    ]
    const handleChangeStatus =(newStatus:PropertieStatuses,propertyId:string) =>{
        toast.dismiss();
        const toastId = toast.loading('Changing property status...');
        setSelectedStatus(newStatus);
        startTransisiton(async ()=>{
        try{
            const res = await changePropertyStatus(newStatus.toLowerCase() as PropertieStatuses,propertyId);
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
            value={selectedStatus}
            onChange={(e)=>handleChangeStatus(e.target.value as PropertieStatuses,propertyId)}
            className="text-xs px-2.5 py-2 border border-black/15 rounded-lg bg-white font-medium text-gray-800 focus:outline-none focus:border-black/40 cursor-pointer shadow-sm hover:border-black/30 transition-colors"
            >
            {statuses.map((item,index)=>(
                <option key={index} value={item.value}>{item.label}</option>
            ))}
            
        </select>
    )
}