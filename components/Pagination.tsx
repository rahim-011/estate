'use client'

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";




type  PaginationProps = {
    currentPage:number,
    totalPages:number
}

export default function Pagination({totalPages,currentPage}:PaginationProps){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const handlePagination = (value:string) =>{
        const params = new URLSearchParams(searchParams);
        params.set('page',value);

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname ;
        router.push(newUrl,{scroll:false})
    }
    return(
        <div className="flex items-center gap-4 mt-5">
            {Array.from({length:totalPages}).map((_,index)=>{
                const pageNumber = index + 1;
                const bgClass = cn(pageNumber == currentPage ? 'bg-primary text-white' : 'text-black')
                return(
                    <span className={`px-5 py-3 rounded-full ${bgClass} font-bold cursor-pointer hover:brightness-110 transition-all`} key={pageNumber} onClick={()=>handlePagination(pageNumber.toString())}>{pageNumber}</span>
                )
            })}
            {currentPage < totalPages &&<span className="text-primary"><ChevronRight size={25} strokeWidth={3}/></span>}
        </div>
    )
}