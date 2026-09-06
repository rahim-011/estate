'use client'

import Link from "next/link";
import { User, Lock, LogOut } from "lucide-react";
import { useState } from "react";


export default function SettingsNavSide() {

    const [activeLink,setActiveLink] = useState('/settings');
    return (
        <aside className="w-full max-w-xs hidden lg:flex flex-col gap-2 border border-black/15 rounded-lg p-4 max-h-[400px] shadow sticky top-24 justify-between shrink-0">
            <div className="flex flex-col gap-4">
                <Link
                onClick={()=>setActiveLink('/settings')}
                href="/settings"
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                    activeLink === "/settings"
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-gray-800 hover:bg-gray-100"
                }`}
            >
                <User size={20} />
                <span className="text-sm">Account Settings</span>
                </Link>

                <Link
                    onClick={()=>setActiveLink('privacy')}
                    href="/settings/privacy"
                    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                        activeLink === "privacy"
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                    <Lock size={20} />
                    <span className="text-sm">Privacy & Security</span>
                </Link>
            </div>
            

            <button
                type="button"
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium text-red-500 bg-red-200/50 hover:bg-red-200/80 hover:text-red-600 transition-all duration-200 w-full text-left cursor-pointer mt-40"
            >
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
            </button>
        </aside>
    );
}