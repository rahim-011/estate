"use client";

import { UserTourItem } from "@/lib/services/tour.service";
import Image from "next/image";
import { Calendar, Clock, Video, UserCheck, User } from "lucide-react";

interface TourViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: UserTourItem | null;
}

export function TourViewModal({ isOpen, onClose, tour }: TourViewModalProps) {
  if (!isOpen || !tour) return null;

  const displayImage = tour.property.image || "";
  const isVideo = tour.type === "videoCall";

  const dateObj = new Date(tour.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-600 text-white";
      case "completed":
        return "bg-blue-600 text-white";
      case "cancelled":
        return "bg-rose-600 text-white";
      default:
        return "bg-amber-500 text-white";
    }
  };

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
              alt={tour.property.name}
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
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider ${getStatusBadgeColor(
                tour.status
              )}`}
            >
              {tour.status}
            </span>
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-xs uppercase tracking-wider ${
                isVideo ? "bg-indigo-600" : "bg-slate-900"
              }`}
            >
              {isVideo ? "Video Tour" : "In-Person"}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto bg-white text-slate-900">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                  {tour.property.price.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80">
                  DZD
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-snug">
              {tour.property.name}
            </h2>

            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 pt-0.5">
              <span className="text-rose-500">📍</span>
              <span className="capitalize">
                {tour.property.address}, {tour.property.wilaya}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Calendar size={14} className="text-slate-500" />
                {formattedDate}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Date
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Clock size={14} className="text-slate-500" />
                {formattedTime}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Time
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1 capitalize">
                {isVideo ? (
                  <Video size={14} className="text-indigo-600" />
                ) : (
                  <UserCheck size={14} className="text-slate-800" />
                )}
                {isVideo ? "Video" : "In-Person"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Tour Type
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-slate-900 rounded-full" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Assigned Agent
              </h3>
            </div>
            <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center gap-3.5">
              {tour.agent.image ? (
                <img
                  src={tour.agent.image}
                  alt={tour.agent.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-200/70 flex items-center justify-center shrink-0 text-slate-600">
                  <User size={20} />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {tour.agent.name}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {tour.agent.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}