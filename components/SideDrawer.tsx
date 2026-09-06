'use client'

import Link from "next/link";
import { User, Settings, LogOut, X, LogIn, Home, Building, Tag, Mail, ShieldCheck, Info } from "lucide-react";
import { useEffect } from "react";
import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";

interface SideDrawerProps {
    isOpen?: boolean;
    onClose?: () => void;
    userId?: string;
    userRole?: 'admin' | 'user';
}

export default function SideDrawer({ isOpen = true, onClose, userId, userRole }: SideDrawerProps) {
    const { handleSignOut } = useSignOut();

    const mainNavLinks = [
        { title: 'Buy', link: '/buy', icon: Home },
        { title: 'Rent', link: '/rent', icon: Building },
        { title: 'Contact Us', link: '/contact', icon: Mail },
        { title: 'About Us', link: '/about', icon: Info },
    ];

    const userNavLinks = [
        { title: 'Profile', link: '/profile', icon: User },
        { title: 'Settings', link: '/settings', icon: Settings },
        { title: 'Admin', link: '/admin', icon: ShieldCheck }
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
                onClick={onClose}
            />

            <aside className={`md:hidden fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-white text-gray-900 z-50 p-6 flex flex-col justify-between shadow-2xl transition-all border-l border-gray-100 ${
                isOpen ? "animate-in slide-in-from-right" : "animate-out slide-out-to-right"
            }`}>
                <div className="space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span 
                            className="text-2xl font-black text-gray-900 tracking-wide select-none"
                            style={{ fontFamily: 'rockSalt, cursive' }}
                        >
                            ESTATEA
                        </span>
                        {onClose && (
                            <button 
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <Link
                        href="/sell"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-sm !text-white bg-primary hover:brightness-110 rounded-xl shadow-sm transition-all"
                    >
                        <Tag size={18} />
                        <span>List Property</span>
                    </Link>

                    <nav className="flex flex-col gap-1.5">
                        {mainNavLinks.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={index}
                                    href={item.link} 
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-[#0e6f79]/10 hover:text-[#0e6f79] rounded-xl transition-colors"
                                >
                                    <Icon size={18} className="text-gray-700" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}

                        {userId && (
                            <>
                                <div className="my-2 border-t border-gray-200" />
                                {userNavLinks
                                    .filter(item => item.title !== 'Admin' || userRole === 'admin')
                                    .map((item, index) => {
                                        const Icon = item.icon;
                                        const linkStyle = cn(
                                            item.title === 'Admin' 
                                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                                                : 'text-gray-800 hover:bg-[#0e6f79]/10 hover:text-[#0e6f79]'
                                        );
                                        return (
                                            <Link 
                                                key={index}
                                                href={item.link} 
                                                onClick={onClose}
                                                className={`${linkStyle} flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors`}
                                            >
                                                <Icon size={18} className={item.title === 'Admin' ? 'text-blue-600' : 'text-gray-700'} />
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                })}
                            </>
                        )}
                    </nav>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    {userId ? (
                        <button 
                            type="button"
                            onClick={() => {
                                onClose?.();
                                handleSignOut(userId);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <Link 
                            href="/sign-in" 
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl transition-colors shadow-sm"
                        >
                            <LogIn size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}