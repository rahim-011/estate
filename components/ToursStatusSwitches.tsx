'use client'

import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/userStore"
import { ToursStatuses } from "@prisma/client";






export default function ToursStatusSwitches(){
    const switches = [
        {label:'confirmed',value:ToursStatuses.confirmed},
        {label:'Pending',value:ToursStatuses.pending},
        {label:'cancelled',value:ToursStatuses.cancelled},
        {label:'completed',value:ToursStatuses.completed},
    ]
    const {switchTourStatus,currentTourStatus} = useUserStore(); 
    return(
        <div className="flex items-center gap-3">
            {switches.map((p,index) =>{
                const bgClass = cn(currentTourStatus === p.value ? 'bg-primary hover:brightness-115 text-white' : 'text-black')
                return(
                    <button className={`${bgClass} rounded-lg px-5 py-3 transition-all text-[0.85rem] cursor-pointer`} key={index} onClick={()=>switchTourStatus(p.value)}>
                        {p.label}
                    </button>
                )})}
        </div>
    )
}