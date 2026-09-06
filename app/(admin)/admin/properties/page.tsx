
import {  Plus} from "lucide-react"
import AdminPropertiesFilter from "@/components/AdminPropertiesFilter"
import { getAllProperties, PropertiesList } from "@/lib/services/admin.service"

import AdminProperties from "@/components/AdmiProperties";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyAdminProperties from "@/components/EmptyAdminProperties";


type pageProps= {searchParams:Promise<{status:'active'|'pending'|'expired',search:string}>}

export default async function PropertiesPage({searchParams}:pageProps) {
  const {status,search} = await searchParams; 
  const res = await getAllProperties(status,search);
  if (!res.success){
    return <div>{'Failed to get the properties data'}</div>
  }
  const properties = res.allProperties as PropertiesList || [];
  


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-black/50">Manage all live, pending, expired, listings.</p>
        </div>
        <button className="flex items-center gap-2 bg-veg-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      <AdminPropertiesFilter/>

      <div className="bg-white border border-black/15 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/40 font-medium">
              <tr>
                <th className="pb-3">Property</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <Suspense fallback={<LoadingSpinner/>}>
              {properties.length > 0 ? (<AdminProperties properties={properties}/>):
              <EmptyAdminProperties/>}
            </Suspense>
          </table>
        </div>
      </div>
    </div>
  )
}