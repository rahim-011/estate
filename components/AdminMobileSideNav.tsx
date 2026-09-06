'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LayoutGrid, Clock, Building2, Calendar, LogOut, Menu, X } from "lucide-react";

export default function AdminMobileSideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutGrid },
        { label: "Pending Listings", href: "/admin/pending-listings", icon: Clock },
        { label: "Properties", href: "/admin/properties", icon: Building2 },
        { label: "Tour Requests", href: "/admin/tours", icon: Calendar },
        { label: "Exit", href: "/", icon: LogOut },
    ];

    return (
        <>
            <div className="w-full bg-white border border-black/15 rounded-2xl p-3 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Shield className="text-[#136f73]" size={22} />
                    <h2 className="text-[#136f73] font-bold text-lg leading-none">Admin Panel</h2>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-4 flex flex-col justify-between z-10">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <Shield className="text-[#136f73]" size={22} />
                                    <h2 className="text-[#136f73] font-bold text-lg leading-none">Admin Panel</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1.5">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-colors ${
                                                isActive
                                                    ? "bg-[#136f73] text-white"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}