'use client'

import { useState } from "react"
import EditUserContact from "./EditUserContact"
import { PreferredContactMethods } from "@prisma/client";





interface UserContactInfosProps{
    userContactInfos?:{
        location?:string
        contactInfo?:{
            email:string
            phone:string
            preferredContactMethod: PreferredContactMethods
        }
    }
}

export default function UserContactInfos({userContactInfos}:UserContactInfosProps){
    const contactInfo = userContactInfos?.contactInfo;
    const phone = contactInfo?.phone ? contactInfo?.phone : 'Not provided';
    const location = userContactInfos?.location ? userContactInfos?.location : 'Not provided';
    const preferredContactMethod = contactInfo?.preferredContactMethod || 'phone';
    const email =   contactInfo?.email ? contactInfo.email : 'Not provided';

    const contactInfos = [
        { label: 'Email', value: email},
        { label: 'Phone', value: phone },
        { label: 'Location', value: location },
        { label: 'Preferred Contact', value: preferredContactMethod }
    ];
    const [isEditing,setIsEditing] = useState<boolean>(false);
    return(
        <div className="flex flex-col gap-4">
            <h2 className="text-black text-[1.2rem] font-semibold">Contact Inforamtion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-black/15 p-4 md:p-6 rounded-lg">
                {contactInfos.map((info,index)=>(
                    <div className="flex flex-col gap-1" key={index}>
                        <span className="text-[0.85rem] text-black">{info.label}</span>
                        <div className="rounded-lg p-3 w-full h-10 text-black/50 text-[0.8rem] border border-black/13">{info.value}</div>
                    </div>
                ))}
            </div>
            <button className="bg-primary hover:brightness-110 transition-all rounded-lg text-white font-semibold px-5 py-3 self-end mt-4 cursor-pointer text-[0.85rem] md:text-[1rem]" onClick={()=>setIsEditing(true)}>Edit Contact Inforamtions</button>
            <EditUserContact onClose={()=>setIsEditing(false)} isOpen={isEditing} userContactInfos={userContactInfos}/>
        </div>
    )
}