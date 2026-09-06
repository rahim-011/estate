'use client'

import Image from "next/image";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function HeroHome() {
    const [currentKey, setCurrentKey] = useState<'/buy' | '/rent'>('/buy');

    return (
        <div className="relative h-150 w-full flex items-center justify-center left-0 top-0">
            <Image 
                src='/image/heroImage.jpg' 
                alt="hero img"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/60" />

            <div className="relative z-10 flex flex-col items-center text-center text-white px-4 max-w-3xl w-full">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
                    Find your next home
                </h1>
                <p className="text-sm md:text-base text-gray-200 mb-6">
                    Browse thousands of listings or pick up where you left off.
                </p>

                <div className="flex items-center gap-1 mb-3 bg-black/40 p-1.5 rounded-full backdrop-blur-md border border-white/20">
                    <button 
                        type="button" 
                        onClick={() => setCurrentKey('/buy')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                            currentKey === '/buy' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-white hover:bg-white/10'
                        }`}
                    >
                        Buy
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setCurrentKey('/rent')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                            currentKey === '/rent' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-white hover:bg-white/10'
                        }`}
                    >
                        Rent
                    </button>
                </div>
                <SearchBar targetPath={currentKey} />
            </div>
        </div>
    );
}