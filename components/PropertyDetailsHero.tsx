'use client'

import { BlockScroll, cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import RequestTourModal from "./TourModel"
import { AgentsList } from "@/lib/services/agent.service"
import { ListingInfos } from "@/lib/services/property.service"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

type PropertyDetailsHeroProps = {
    agents: AgentsList
    requestedProperty: ListingInfos
}

export default function PropertyDetailsHero({ agents, requestedProperty }: PropertyDetailsHeroProps) {
    const photosSrcs = requestedProperty.Media?.photosSrcs;
    const router = useRouter();

    if (!photosSrcs || photosSrcs.length === 0) {
        return null;
    }

    const [isOpen, setIsOpen] = useState<boolean>(false);
    BlockScroll(isOpen);

    const photosLength = photosSrcs.length;
    const gridClass = cn(photosLength > 2 ? 'grid-cols-2' : 'grid-cols-1');
    const {data:session} = authClient.useSession();

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-[450px] lg:h-[520px]">
                <div className="relative h-[280px] sm:h-[360px] md:h-full w-full">
                    <Image
                        alt="main property view"
                        src={photosSrcs[0]}
                        loading="eager"
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        fill
                    />
                </div>

                {photosLength > 1 && (
                    <div className={`grid ${gridClass} gap-3 h-full`}>
                        {photosSrcs.slice(1, 5).map((src, index) => (
                            <div 
                                className={`relative w-full ${
                                    photosLength <= 2 
                                        ? 'h-[200px] md:h-full' 
                                        : 'h-36 sm:h-44 md:h-full'
                                }`} 
                                key={index}
                            >
                                <Image
                                    alt={`property view ${index + 2}`}
                                    src={src}
                                    loading="eager"
                                    className="object-cover rounded-xl"
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    fill
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

    
                <button 
                    className="bg-primary hover:brightness-110 text-white font-semibold rounded-lg px-5 py-3 cursor-pointer transition-all self-start w-48" 
                    onClick={() => {session ? setIsOpen(true) : router.push('/sign-in'),{scroll:false}}}
                >
                    Book tour
                </button>


            <RequestTourModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                agents={agents} 
                requestedProperty={requestedProperty} 
            />
        </div>
    )
}