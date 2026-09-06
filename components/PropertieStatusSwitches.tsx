'use client'

import { cn } from "@/lib/utils"
import { PropertieStatuses, useUserStore } from "@/store/userStore"






export default function PropertieStatusSwitches(){
    const switches = [
        {label:'Active',value:PropertieStatuses.active},
        {label:'Pending',value:PropertieStatuses.pending},
        {label:'Expired',value:PropertieStatuses.expired}
    ]
    const {switchPropertieStatus,currentPropertieStatus} = useUserStore(); 
    return(
        <div className="flex items-center gap-3">
            {switches.map((p,index) =>{
                const bgClass = cn(currentPropertieStatus === p.value ? 'bg-primary hover:brightness-115 text-white' : 'text-black')
                return(
                    <button className={`${bgClass} rounded-lg px-5 py-3 transition-all text-[0.85rem] cursor-pointer`} key={index} onClick={()=>switchPropertieStatus(p.value)}>
                        {p.label}
                    </button>
                )})}
        </div>
    )
}