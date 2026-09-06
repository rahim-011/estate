'use client'

import { useRef, useState } from "react"
import { Calendar, ChevronDown } from "lucide-react";



export default function TourSchedule(){

    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState({ label: "In person", value: "in-person" });
    const inputRef = useRef<HTMLInputElement>(null);
    const handleContainerClick = () =>{
        inputRef.current?.showPicker()
    }
    const options = [
        { label: "In person", value: "in-person" },
        { label: "Virtual", value: "virtual" },
    ];
    return(
        <div className="flex flex-col gap-5 border p-4 border-black/15 rounded-lg">
            <h5 className="text-[1.2rem] text-black font-semibold">Schedule a Tour</h5>
            <div className="grid grid-cols-[1fr_0.8fr] gap-3">
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm focus-within:border-primary" onClick={handleContainerClick}>
                    <div className="flex items-center gap-2.5 w-full">
                    <Calendar size={18} className="text-teal-700 shrink-0" />
                    <input
                        ref={inputRef}
                        type="date"
                        defaultValue="2025-07-20"
                        className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    </div>
                </div>

                <div className="relative w-full">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full border border-gray-200 rounded-lg px-3 py-3 bg-white text-gray-900 text-sm font-medium cursor-pointer shadow-sm select-none"
                    >
                        <span>{selected.label}</span>
                        <ChevronDown
                        size={18}
                        className={`text-gray-900 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                        {options.map((option) => (
                            <div
                            key={option.value}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                selected.value === option.value
                                ? "bg-gray-100 font-semibold text-primary"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                            >
                            {option.label}
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
            <button className="self-start px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition-all mt-3 cursor-pointer md:mt-9">Book a Tour</button>
        </div>
    )
}