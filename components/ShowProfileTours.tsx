'use client'

import { BlockScroll } from "@/lib/utils";
import { UserTourItem } from "@/lib/services/tour.service";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { TourViewModal } from "./ViewTourModel";
import { ConfirmDeleteModal } from "./DeleteTourModel";

interface ShowProfileToursProps {
    userTours: UserTourItem[];
}

export default function ShowProfileTours({ userTours }: ShowProfileToursProps) {
    const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false);
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
    BlockScroll(isViewOpen || isCancelOpen);

    const [selectedId, setSelectedId] = useState('');
    const [selectedTour, setSelectedTour] = useState<UserTourItem | null>(null);

    const handleTargetTour = (targetId: string) => {
        const targetTour = userTours.find(item => item.id === targetId);
        if (!targetTour) {
            return null;
        }
        setSelectedTour(targetTour);
        setIsViewOpen(true);
    };

    return (
        <div className="flex flex-col gap-4 w-full border p-3 border-black/15 rounded-xl md:max-w-[70%]">
            {userTours.map((tour, index) => {
                const dateObj = new Date(tour.scheduledAt);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                const tourInfos = [
                    { label: 'date', value: formattedDate },
                    { label: 'time', value: formattedTime },
                    { label: 'type', value: tour.type === 'videoCall' ? 'Video' : 'In-Person' },
                    { label: 'status', value: tour.status }
                ];

                return (
                    <div className="flex gap-3 sm:gap-4 py-2 border-b border-gray-100 last:border-0 w-full overflow-y-auto max-h-100" key={tour.id || index}>
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 shrink-0">
                            <Image
                                alt="property image"
                                src={tour.property.image ?? '/undefined.png'}
                                fill
                                sizes="(min-width: 768px) 128px, (min-width: 640px) 112px, 96px"
                                className="object-cover rounded-xl"
                            />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-black font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                                        {tour.property.name}
                                    </h4>
                                    <span className="text-primary font-bold text-sm sm:text-base md:text-[1.1rem] shrink-0">
                                        {tour.property.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {tourInfos.map((info, i) => (
                                        <span key={i}>
                                            {info.value} {info.label}{i !== tourInfos.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => handleTargetTour(tour.id)} 
                                    className="bg-primary text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full hover:brightness-110 transition-all shrink-0 cursor-pointer"
                                >
                                    View Details
                                </button>

                                <button 
                                    className="border border-red-500 text-red-500 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer shrink-0" 
                                    onClick={() => { setSelectedId(tour.id); setIsCancelOpen(true); }}
                                >
                                    <Trash2 size={14} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            <TourViewModal onClose={() => setIsViewOpen(false)} isOpen={isViewOpen} tour={selectedTour} />
            <ConfirmDeleteModal onClose={() => setIsCancelOpen(false)} isOpen={isCancelOpen} tourId={selectedId} />
        </div>
    );
}