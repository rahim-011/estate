'use client'

import { X, MapPin, Building2, User, ShieldCheck } from "lucide-react";
import TourForm from "./TourForm";
import { ListingInfos } from "@/lib/services/property.service";
import { AgentsList } from "@/lib/services/agent.service";
import Image from "next/image";

interface RequestTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestedProperty: ListingInfos;
    agents: AgentsList
}

export default function RequestTourModal({ isOpen, onClose, requestedProperty,agents }: RequestTourModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl bg-white rounded-2xl border border-black/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
                    <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-black/80" />
                        <h2 className="text-black font-semibold text-lg">Schedule Property Tour</h2>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="p-1.5 text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-black/10">
                    <div className="md:col-span-5 bg-black/[0.02] p-6 flex flex-col gap-5 justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/10 border border-black/10">
                                <Image
                                    fill
                                    src={requestedProperty.Media?.photosSrcs?.[0] || ''} 
                                    alt={requestedProperty.name} 
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                />
                                <span className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-xs">
                                    For {requestedProperty.listingType.charAt(0) + requestedProperty.listingType.slice(1)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Property Details</span>
                                <h3 className="text-black font-bold text-lg leading-snug">
                                    {requestedProperty.name}
                                </h3>
                                <p className="text-black/60 text-xs flex items-center gap-1">
                                    <MapPin size={14} className="text-black/50 shrink-0" />
                                    {`${requestedProperty.address}, ${requestedProperty.wilaya}`}
                                </p>
                                <p className="text-black font-extrabold text-xl mt-1">
                                    {requestedProperty.price.toFixed(2)} DA
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black/10 flex flex-col gap-3">
                            <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Property Owner</span>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/10 shadow-xs">
                                {requestedProperty.seller?.image ? (
                                    <img 
                                        src={requestedProperty.seller.image} 
                                        alt={requestedProperty.seller.name || 'Seller'} 
                                        className="w-10 h-10 rounded-full object-cover border border-black/10 shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-black font-bold text-sm shrink-0">
                                        <User size={18} />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-semibold text-black truncate">{requestedProperty.seller?.name}</span>
                                        <ShieldCheck size={15} className="text-blue-600 shrink-0" />
                                    </div>
                                    {requestedProperty.seller?.email && (
                                        <span className="text-xs text-black/60 truncate">{requestedProperty.seller.email}</span>
                                    )}
                                    {requestedProperty.seller?.location && (
                                        <span className="text-[0.75rem] text-black/40 truncate">{requestedProperty.seller.location}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-7 p-6">
                        <div className="mb-4">
                            <h4 className="text-black font-semibold text-base">Select Date & Preferred Time</h4>
                            <p className="text-xs text-black/60 mt-0.5">Fill out your details to book an in-person or video walk-through.</p>
                        </div>
                        <TourForm agents={agents ?? []} propertyId={requestedProperty.id}/>
                    </div>
                </div>
            </div>
        </div>
    );
}