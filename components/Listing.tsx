'use client'

import type { ListingInfos } from "@/lib/services/property.service";
import { Bath, Bed, Heart, MessageSquareShare, Ruler } from "lucide-react";
import Image from "next/image";
import RequestTourModal from "./TourModel";
import { useState } from "react";
import { BlockScroll } from "@/lib/utils";
import { AgentsList } from "@/lib/services/agent.service";
import { useRouter } from "next/navigation";





export default function ListingCard({listing,agents}:{listing:ListingInfos,agents:AgentsList}){
    if (!listing || !agents) return null;
    const [isOpen,setIsOpen] = useState<boolean>(false);
    BlockScroll(isOpen)
    const imgSrc = listing?.Media?.photosSrcs[0];
    const {address,price,listingType}  = listing;
    const {bathRooms,bedRooms,areaSurface} = listing.Property_Details || {};
    const router = useRouter();
   
    return(
        <div className="flex flex-col gap-2 rounded-lg border border-black/15 cursor-pointer" onClick={()=>router.push(`/${listing.listingType === 'sale' ? 'buy' : 'rent'}/${listing.id}`)}>
            <div className="relative  w-full h-52 rounded-t-lg">
                <Image
                src={imgSrc || 'undefined.png'}
                alt='listing image'
                loading="eager"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover rounded-t-lg hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="flex flex-col gap-2 p-3">
                <div className="flex flex-col gap-2">
                    <span className="text-black font-semibold text-[1.1rem]">${price.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-black/50 text-[0.8rem]">{address}</span>
                        <span className="text-black/50 text-[0.8rem]">{listingType}</span>
                    </div>
                    <div className="flex items-center shrink-0 gap-1">
                        <span className="text-black/50 text-[0.8rem] flex items-center gap-1 whitespace-nowrap"><Bed size={16}/> {bedRooms} Beds | </span>
                        <span className="text-black/50 text-[0.8rem] flex items-center gap-1 whitespace-nowrap"><Bath size={16}/>{bathRooms} Baths | </span>
                        <span className="text-black/50 text-[0.8rem] flex items-center gap-1 whitespace-nowrap"><Ruler size={16} className="rotate-45"/>{areaSurface} sq ft</span>
                    </div>
                </div>
                <button  className="text-white font-semibold p-3 rounded-2xl bg-primary flex items-center gap-2 justify-center mt-2 hover:brightness-90 transition-all ease-in cursor-pointer" onClick={(e)=>{e.stopPropagation();setIsOpen(true)}}><MessageSquareShare size={17}/> Request to tour</button>
            </div>
            <RequestTourModal onClose={()=>setIsOpen(false)} isOpen={isOpen} requestedProperty={listing} agents={agents ?? []}/>
        </div>
    )
}