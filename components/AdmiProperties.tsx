'use client'

import { PropertiesList } from "@/lib/services/admin.service";
import StatusSelect from "@/components/PropertyStatusSelect";
import {  Eye, Trash2 } from "lucide-react"
import { useState } from "react";
import { ConfirmDeleteModal } from "./DeletePropertyModel";
import { BlockScroll } from "@/lib/utils";
import { PendingListingItem } from "./ShowPendingListings";

import { UserProperty } from "@/lib/services/user.service";
import { PropertyViewModal } from "./ViewPropertyModel";


interface AdminPropertiesProps{
    properties:PropertiesList
}

export default function AdminProperties({properties}:AdminPropertiesProps){
    if (!properties){
        return null
    }
    
    const [isDeleteOpen,setIsDeleteOpen] = useState<boolean>(false);
    const [isViewOpen,setIsViewOpen] = useState<boolean>(false);
    BlockScroll(isDeleteOpen || isViewOpen);
    const [selectedId,setSelectedId] = useState('');
    const [selectedProperty,setSelectedProperty] = useState<UserProperty |Partial<PendingListingItem>| null>(null);

    BlockScroll(isDeleteOpen || isViewOpen);
    const getStatusBadge = (status: string) => {
    switch (status) {
        case "Active":
        return "bg-emerald-100 text-emerald-800"
        case "Pending":
        return "bg-amber-100 text-amber-800"
        case "Expired":
        return "bg-rose-100 text-rose-800"
        default:
        return "bg-gray-100 text-gray-700"
    }
    }
    const handleViewProperty = (propertyId:string) =>{
        const targetProperty = properties.find(item => item.id === propertyId);
        if (!targetProperty){
            return null
        }
        setSelectedProperty(targetProperty);
        setIsViewOpen(true);
    }
    return(
        <>
            <tbody className="divide-y divide-black/5">
                {properties.map((item) => (
                <tr key={item.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-4">
                    <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-black/10" />
                        <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-black/50">{item.wilaya}</p>
                        </div>
                    </div>
                    </td>
                    <td className="py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                        item.listingType === 'sale' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                        {item.listingType}
                    </span>
                    </td>
                    <td className="py-4 font-semibold text-gray-900">{item.price.toFixed(2)}</td>
                    <td className="py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                    </span>
                    </td>
                    <td className="py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                        <StatusSelect propertyId={item.id} status={item.status}/>
                        <button 
                        className="p-2 text-slate-600 bg-slate-100/80 hover:bg-slate-900 hover:text-white rounded-xl border border-slate-200/60 shadow-xs hover:shadow-md active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer" 
                        onClick={() => handleViewProperty(item.id)} 
                        title="View Details"
                        >
                        <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer" onClick={()=>{setIsDeleteOpen(true);setSelectedId(item.id)}} title="Delete Property">
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            <ConfirmDeleteModal onClose={()=>setIsDeleteOpen(false)} isOpen={isDeleteOpen} propertyId={selectedId}/>
            <PropertyViewModal onClose={()=>setIsViewOpen(false)} isOpen={isViewOpen} property={selectedProperty as UserProperty}/>
        </>
    )
}