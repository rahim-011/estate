'use client'

import {Search, Filter} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'



export default function AdminPropertiesFilter(){

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState("")
    const [searchDebouncer] = useDebounce(searchTerm,500);
    const initialStatus = searchParams.get('status') || '';

    const updateUrl = (updatedParams:{status?:string,search?:string}) =>{
        const params = new URLSearchParams(searchParams);
        if (updatedParams.status !== undefined){
            if (updatedParams.status.trim() || updatedParams.status !== 'allStatuses'){
                params.set('status',updatedParams.status.toString())
            }else {
                params.delete('status')
            }
        }
        if (updatedParams.search !== undefined){
            if (updatedParams.search.trim()){
                params.set('search',updatedParams.search);
                setSearchTerm(updatedParams.search)
            }else {
                params.delete('search');
                setSearchTerm('');
            }
        }

        const queryString = params ? `${pathname}?${params}` : pathname;
        const newUrl = queryString.toString();
        router.push(newUrl,{scroll:false})
    }
    useEffect(()=>{
        if (searchDebouncer !== searchParams.get('search')){
            updateUrl({search:searchDebouncer})
        }
    },[searchDebouncer]);
    return(
        <div className="bg-white border border-black/15 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-black/15 rounded-xl text-sm focus:outline-none focus:border-black/40"
            />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter className="w-4 h-4 text-black/40" />
            <select
                value={initialStatus}
                onChange={(e) => updateUrl({status:e.target.value})}
                className="border border-black/15 rounded-xl text-sm px-3 py-2 bg-white focus:outline-none focus:border-black/40"
            >
                <option value="allStatuses">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
            </select>
            </div>
        </div>
    )
}