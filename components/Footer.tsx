import { rockSalt } from "@/lib/fonts"
import Link from "next/link"

export default function Footer() {
    const quickLinks = [
        { title: 'Home', src: '/' },
        { title: 'About Us', src: '/about' },
        { title: 'Contact', src: '/contact' }
    ]

    const supportLinks = [
        { title: 'Rent Property', src: '/rent' },
        { title: 'Buy Property', src: '/buy' },
        { title: 'Sell Property', src: '/sell' }
    ]

    return (
        <footer className="w-full bg-[#1d7b87] text-white py-12 px-6 md:px-16 lg:px-24 mt-10 bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 w-full items-center">
                <div className="flex flex-col sm:flex-row justify-between gap-8 w-full">
                    <div className="self-center">
                        <span className={`${rockSalt.className} text-white text-2xl md:text-3xl`}>ESTATEA</span>
                    </div>

                    <div className="grid grid-cols-2 gap-10 md:gap-20 ">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-white font-semibold text-sm md:text-base">Quick Links</h3>
                            <div className="flex flex-col gap-2.5">
                                {quickLinks.map((link, index) => (
                                    <Link key={index} href={link.src} className="text-white/80 font-normal text-xs md:text-sm hover:text-white transition-colors">
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h3 className="text-white font-semibold text-sm md:text-base">Properties</h3>
                            <div className="flex flex-col gap-2.5">
                                {supportLinks.map((link, index) => (
                                    <Link key={index} href={link.src} className="text-white/80 font-normal text-xs md:text-sm hover:text-white transition-colors">
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-white/20 w-full my-2" />

                <span className="text-white/80 text-xs md:text-sm">
                    &copy; 2025 EstateA All rights reserved.
                </span>
            </div>
        </footer>
    )
}