'use client'

import React, { useEffect, useState} from "react"
import { Search,Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce";
import { ToursStatuses } from "@prisma/client";


export default function AdminToursFilter (){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get('status') || '';


    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
    const [debounceSearch] = useDebounce(searchTerm,500);

    const updateUrl  = (updatedParams:{status?:string,search?:string}) =>{
        const params = new URLSearchParams(searchParams);
        if (updatedParams.status !== undefined){
            if (updatedParams.status.trim() && updatedParams.status !== 'allstatuses'){
                params.set('status',updatedParams.status)
            }else {
                params.delete('status');
            }
        }
        if (updatedParams.search !== undefined){
            if (updatedParams.search.trim()){
                params.set('q',updatedParams.search);
                setSearchTerm(updatedParams.search)
            }else {
                params.delete('q')
                setSearchTerm('');
            }
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl,{scroll:false})
    }

    useEffect(()=>{
        if (debounceSearch!== (searchParams.get('q') || '')){
            updateUrl({search:debounceSearch})
        }
    },[debounceSearch])
    return(
        <div className="bg-white border border-black/15 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                type="text"
                placeholder="Search client, phone, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/15 rounded-xl text-sm focus:outline-none focus:border-black/40"
                />
            </div>
    
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="w-4 h-4 text-black/40" />
                <select
                value={initialStatus}
                onChange={(e) => updateUrl({status:e.target.value as ToursStatuses})}
                className="border border-black/15 rounded-xl text-sm px-3 py-2 bg-white focus:outline-none focus:border-black/40"
                >
                <option value="allstatuses">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    )
}



