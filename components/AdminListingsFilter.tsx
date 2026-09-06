'use client'

import React, { useEffect, useState} from "react"
import { Search,Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce";


export default function AdminListingsFilter(){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') || '';


    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
    const [debounceSearch] = useDebounce(searchTerm,500);

    const updateUrl  = (updatedParams:{type?:string,search?:string}) =>{
        const params = new URLSearchParams(searchParams);
        if (updatedParams.type !== undefined){
            if (updatedParams.type.trim() && updatedParams.type !== 'allTypes'){
                params.set('type',updatedParams.type)
            }else {
                params.delete('type');
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
                placeholder="Search by title or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/15 rounded-xl text-sm focus:outline-none focus:border-black/40"
            />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter className="w-4 h-4 text-black/40" />
            <select
                value={initialType}
                onChange={(e)=>updateUrl({type:e.target.value})}
                className="border border-black/15 rounded-xl text-sm px-3 py-2 bg-white focus:outline-none focus:border-black/40"
            >
                <option value="allTypes">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
            </select>
            </div>
        </div>
    )
}