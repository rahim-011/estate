'use client'

import { cn } from "@/lib/utils"
import { LayoutDashboard, LogOut, Shield, Clock, Building2, CalendarDays } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export default function AdminSideNav() {
    interface NavLink {
        title: string
        link: string
        icon: React.ReactNode
    }

    const navLinks: NavLink[] = [
        { title: 'Dashboard', link: '/admin', icon: <LayoutDashboard size={17} /> },
        { title: 'Pending Listings', link: '/admin/pending-listings', icon: <Clock size={17} /> },
        { title: 'Properties', link: '/admin/properties', icon: <Building2 size={17} /> },
        { title: 'Tour Requests', link: '/admin/tours', icon: <CalendarDays size={17} /> },
        { title: 'Exit', link: '/', icon: <LogOut size={17} /> },
    ]

    const pathname = usePathname()

    return (
        <div className="w-full flex flex-col border-black/15 rounded-2xl border bg-white overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 p-5 border-b border-black/15">
                <span className="text-primary"><Shield size={20} /></span>
                <h1 className="text-primary font-bold text-lg">Admin Panel</h1>
            </div>

            <div className="p-3">
                <nav>
                    <ul className="flex flex-col gap-2">
                        {navLinks.map((navLink, index) => {
                            const isActive = pathname === navLink.link
                            return (
                                <li key={index}>
                                    <Link
                                        href={navLink.link}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-[10px] text-[0.85rem] font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-black/60 hover:text-black hover:bg-black/5"
                                        )}
                                    >
                                        <span>{navLink.icon}</span>
                                        <span>{navLink.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    )
}