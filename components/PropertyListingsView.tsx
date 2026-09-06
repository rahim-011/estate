'use client';

import { useState } from "react";
import Listings from "@/components/Listings";
import MapView from "./MapView";
import Pagination from "./Pagination";
import { ListingInfos } from "@/lib/services/property.service";
import EmptyListings from "./EmptyListings";
import { Agent } from "@prisma/client";

type PropertyListingsViewProps = {
  data: {
    currentPage: number;
    pageListings: ListingInfos[];
    totalPages: number;
  };
  agents: Agent[]
};

export default function PropertyListingsView({ data,agents }: PropertyListingsViewProps) {
  const { currentPage, pageListings, totalPages } = data;
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const activeWilaya = pageListings[0]?.wilaya;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1fr] gap-6 border-t border-black/10 min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm text-black transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>🗺️</span> {isMapExpanded ? "Hide Map" : "Show Map"}
          </span>
          <span className="text-xs">{isMapExpanded ? "▲" : "▼"}</span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:h-full md:sticky md:top-6 rounded-2xl border border-black/10 shadow-sm ${
            isMapExpanded ? "h-[350px]" : "h-0 md:h-auto"
          }`}
        >
          <MapView listings={pageListings} />
        </div>
      </div>

      {pageListings.length > 0 ? (
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 pb-2 border-b border-black/10">
              <h1 className="text-xl md:text-2xl text-black font-bold tracking-tight">
                {activeWilaya ? `Real Estate in ${activeWilaya}` : "Properties for Sale"}
              </h1>
              <span className="text-sm font-medium text-black/60">
                {pageListings.length} {pageListings.length === 1 ? "result" : "results"} found
              </span>
            </div>
            <Listings pageListings={pageListings} agents={agents}/>
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      ) : (
        <EmptyListings />
      )}
    </div>
  );
}