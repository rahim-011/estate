"use client";

import { UserProperty } from "@/lib/services/user.service";
import Image from "next/image";

interface PropertyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: UserProperty | null ;
}

export function PropertyViewModal({ isOpen, onClose, property }: PropertyViewModalProps) {
  if (!isOpen || !property) return null;

  const displayImage = property.Media?.photosSrcs?.[0] || "";
  const isRent = property.listingType?.toLowerCase().includes("rent");

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md shadow-sm border border-slate-200/60 transition-all text-sm font-semibold cursor-pointer"
        >
          ✕
        </button>

        <div className="relative h-52 sm:h-60 w-full bg-slate-100 flex-shrink-0 overflow-hidden">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={property.name}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <span className="text-4xl">🏛️</span>
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                No Preview Available
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200/80 shadow-xs uppercase tracking-wider">
              {property.status}
            </span>
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-xs uppercase tracking-wider ${
                isRent ? "bg-indigo-600" : "bg-emerald-600"
              }`}
            >
              {property.listingType}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto bg-white text-slate-900">
          
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                  {property.price.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80">
                  DZD
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-snug">
              {property.name}
            </h2>

            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 pt-0.5">
              <span className="text-rose-500">📍</span>
              <span className="capitalize">{property.wilaya}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-base font-bold text-slate-900">
                🛏️ {property.Property_Details?.bedRooms ?? "-"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Bedrooms
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-base font-bold text-slate-900">
                🚿 {property.Property_Details?.bathRooms ?? "-"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Bathrooms
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-base font-bold text-slate-900">
                📐 {property.Property_Details?.areaSurface ?? "-"} <span className="text-xs">m²</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Area
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-slate-900 rounded-full" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Description
              </h3>
            </div>
            <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                {property.Property_Details?.description || "No description provided."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}