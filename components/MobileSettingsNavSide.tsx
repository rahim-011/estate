'use client'

import Link from "next/link";
import { User, Lock, LogOut } from "lucide-react";
import { useState } from "react";

export default function SettingsNavMobile() {
    const [activeLink, setActiveLink] = useState('/settings');

    return (
        <nav className="w-full flex items-center justify-between gap-2 border border-black/15 rounded-2xl p-2 bg-white shadow mb-6 lg:hidden ">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Link
                    onClick={() => setActiveLink('/settings')}
                    href="/settings"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                        activeLink === "/settings"
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                    <User size={18} />
                    <span className="text-xs sm:text-sm">Account Settings</span>
                </Link>

                <Link
                    onClick={() => setActiveLink('privacy')}
                    href="/settings/privacy"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                        activeLink === "privacy"
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                    <Lock size={18} />
                    <span className="text-xs sm:text-sm">Privacy & Security</span>
                </Link>
            </div>

            <button
                type="button"
                className="flex items-center justify-center p-2.5 rounded-xl text-red-500 bg-red-200/50 hover:bg-red-200/80 hover:text-red-600 transition-all duration-200 shrink-0 cursor-pointer"
                aria-label="Logout"
            >
                <LogOut size={18} />
            </button>
        </nav>
    );
}