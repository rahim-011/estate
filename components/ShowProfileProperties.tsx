'use client'

import { BlockScroll, filterPropertiesByStatus } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { UserProperty } from "@/lib/services/user.service";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { PropertyViewModal } from "./ViewPropertyModel";
import { ConfirmDeleteModal } from "./DeletePropertyModel";

interface ShowProfilePropertiesProps{
    userProperties: UserProperty[];
}

export default function ShowProfileProperties({userProperties}:ShowProfilePropertiesProps){
    const {currentPropertieStatus} = useUserStore();
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [isDeleteOpen,setIsDeleteOpen] = useState<boolean>(false);
    BlockScroll(isOpen || isDeleteOpen);
    const [selectedId,setSelectedId] = useState('');
    const [selectProperty,setSelectedProperty] = useState<UserProperty | null>(null);
    const filtredProperties = filterPropertiesByStatus(currentPropertieStatus,userProperties);
    const handleTargetProperty = (targetId:string) =>{
        const targetProperty = filtredProperties.find(item => item.id === targetId);
        if (!targetProperty){
            return null
        }
        setSelectedProperty(targetProperty);
        setIsOpen(true);
    }
    return(
        <div className="flex flex-col gap-4 w-full border p-3 border-black/15 rounded-xl md:max-w-[70%] overflow-y-auto max-h-100">
            {filtredProperties.map((propertie, index) =>{
                const houseInfos = [
                    {label:'bed',value:propertie.Property_Details?.bedRooms},
                    {label:'bath',value:propertie.Property_Details?.bathRooms},
                    {label:'sq ft',value:propertie.Property_Details?.areaSurface},
                ]
                return(
                    <div className="flex gap-3 sm:gap-4 py-2 border-b border-gray-100 last:border-0 w-full" key={index}>
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 shrink-0">
                            <Image
                                alt="house image"
                                src={propertie.Media?.photosSrcs[0] ?? 'undefined.png'}
                                fill
                                sizes="(min-width: 768px) 128px, (min-width: 640px) 112px, 96px"
                                className="object-cover rounded-xl"
                            />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-black font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                                        {propertie.name}
                                    </h4>
                                    <span className="text-primary font-bold text-sm sm:text-base md:text-[1.1rem] shrink-0">
                                        {propertie.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {houseInfos.map((info, i) => (
                                        <span key={i}>
                                            {info.value} {info.label}{i !== houseInfos.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2 ">
                                <button
                                    onClick={() => handleTargetProperty(propertie.id)} 
                                    className="bg-primary text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full hover:brightness-110 transition-all shrink-0 cursor-pointer"
                                >
                                    View Details
                                </button>

                                <button className="border border-red-500 text-red-500 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer shrink-0" onClick={()=>{setSelectedId(propertie.id);setIsDeleteOpen(true)}}>
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )})}
            <PropertyViewModal onClose={()=>setIsOpen(false)} isOpen={isOpen} property={selectProperty}/>
            <ConfirmDeleteModal onClose={()=>setIsDeleteOpen(false)} isOpen={isDeleteOpen} propertyId={selectedId}/>
        </div>
    )
}