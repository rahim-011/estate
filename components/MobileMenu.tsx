'use client';

import { useState } from "react";
import { TextAlignJustify } from "lucide-react";
import SideDrawer from "./SideDrawer";

export default function MobileMenu({userId,userRole}:{userId?:string,userRole?:'admin'|'user'}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <TextAlignJustify
                size={20}
                className="md:hidden cursor-pointer transition-transform text-white"
                onClick={() => setIsOpen(true)}
            />
            <SideDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} userId={userId} userRole={userRole}/>
        </>
    );
}