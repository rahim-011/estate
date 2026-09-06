'use client'

import { Edit2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import EditUserProfile from "./EditUserProfile";




interface UserProfileProps{
    user:{
        name?: string 
        location?: string | undefined
        image?: string | undefined
    }   
}

export default function UserProfile({user}:UserProfileProps){

    const [isEditing,setIsEditing] = useState<boolean>(false);
    const name = user.name ?? '';
    const image = user.image;
    const location = user.location || 'Global'
    return(
        <div className="border-black/15 border rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                    <Image
                        alt="user avatar"
                        src={image ?? '/image/user.png'}
                        fill
                        sizes="80px"
                        loading="eager"
                        className="object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-black font-semibold text-[0.9rem]">{name}</span>
                    <span className="text-black/50 text-[0.8rem] flex items-center gap-2"><MapPin size={15}/>{location}</span>
                </div>
            </div>
            <div className="w-full">
                <button className="bg-primary transition-all hover:brightness-110 cursor-pointer text-white flex items-center gap-3 rounded-lg px-5 py-2 font-semibold text-[0.85rem] md:text-[1rem]  justify-self-end" onClick={()=>setIsEditing(true)}><Edit2 size={18}/>Edit Profile</button>
            </div>
            <EditUserProfile
            isOpen={isEditing} onClose={()=>setIsEditing(false)} name={name} avatar={image}/>
        </div>
    )
}