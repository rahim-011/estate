
import {  Check, X, Eye, Clock } from "lucide-react"
import { getPendingListings } from "@/lib/services/admin.service"
import { ListingTypes } from "@prisma/client";
import AdminListingsFilter from "@/components/AdminListingsFilter";
import ShowPendingListings from "@/components/ShowPendingListings";
import EmptyPendingProperties from "@/components/EmptyPendingProperties";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";





type PageProps = {
  searchParams: Promise<{ type?: string; search?: string }>;
};
export default async function PendingListingsPage({searchParams}:PageProps) {
  

  const search = (await searchParams).search;  
  const type = (await searchParams).type;
  const res = await getPendingListings(type as ListingTypes,search as string);
  if (!res.success){
    return <div>{res.error}</div>
  }
  const pendingListings = res.pendingListings ?? [];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Listings</h1>
          <p className="text-sm text-black/50">Review and verify user submitted property listings before publishing.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Clock className="w-4 h-4" />
          <span>{pendingListings.length} Pending Approval</span>
        </div>
      </div>
      <AdminListingsFilter/>
      <div className="bg-white border border-black/15 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/40 font-medium">
              <tr>
                <th className="pb-3">Property</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Submitted By</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            {pendingListings.length > 0 ? (
              <Suspense fallback={<LoadingSpinner/>}>
                  <ShowPendingListings pendingListings={pendingListings}/>
              </Suspense>
              ): <EmptyPendingProperties colSpan={6}/>}
          </table>
        </div>
      </div>
    </div>
  )
}