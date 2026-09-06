'use client'

import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


interface ProfileIconProps{
    userId?:string
    avatar:string
    userRole?:'admin' | 'user'
}


export default function ProfileIcon({userId,avatar,userRole}:ProfileIconProps) {

    const {handleSignOut} = useSignOut();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const profileLinks = [
        { title: 'Profile', link: '/profile' },
        { title: 'Settings', link: '/settings' },
        {title:'Admin',link:'/admin'}
    ];
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function closeDropDown(e: MouseEvent) {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', closeDropDown);
        return () => document.removeEventListener('mousedown', closeDropDown);
    }, []);

    if (!userId){
        return null
    }
    return (
        <div className="relative cursor-pointer select-none" ref={dropDownRef}>
            <div className="flex items-center gap-2" onClick={() => setIsOpen(prev => !prev)}>
                <div className="rounded-full h-9 w-9 sm:h-10 sm:w-10 relative overflow-hidden border border-white/20 shadow-sm">
                    <Image
                        alt="profile image"
                        src={avatar || "/image/user.png"}
                        fill
                        sizes="(max-width: 640px) 36px, 40px"
                        className="object-cover"
                        loading="eager"
                    />
                </div>
                <ChevronDown size={18} className={`text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute top-14 right-0 w-48 bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-2.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <ul className="flex flex-col gap-1 w-full">
                        {profileLinks.map((link, index) => {
                            if (link.title === 'Admin' && userRole !== 'admin') return ;
                            const linkStyle = cn(link.title === 'Admin' ? '!text-blue-600 hover:bg-blue-200' : 'hover:!text-[#0e6f79] hover:bg-[#0e6f79]/10  !text-gray-800')
                            return(
                                <Link
                                key={index}
                                href={link.link}
                                onClick={() => setIsOpen(false)}
                                className={` w-full text-left font-medium text-sm transition-all px-3.5 py-2.5 rounded-xl cursor-pointer ${linkStyle}`}
                            >
                                {link.title}
                            </Link>
                            )
                        })}
                    </ul>

                    <div className="pt-2 mt-1 border-t border-gray-100">
                        <button 
                            type="button"
                            onClick={() => {setIsOpen(false);handleSignOut(userId)}}
                            className="w-full text-center text-xs sm:text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors py-2.5 rounded-xl cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}