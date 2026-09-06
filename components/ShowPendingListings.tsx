'use client'

import { BlockScroll } from "@/lib/utils";
import { ListingTypes, Wilaya } from "@prisma/client";
import {  Check, X, Eye, LoaderCircle } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";
import { acceptPropertyRequests } from "@/lib/services/admin.service";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "./DeletePropertyModel";
import { PropertyViewModal } from "./ViewPropertyModel";
import { UserProperty } from "@/lib/services/user.service";



interface PendingListingsProps {
  pendingListings: PendingListingItem[];
}
export type PendingListingItem = {
  id: string;
  name: string;
  price: number;
  email: string;
  address: string;
  listingType: ListingTypes;
  wilaya: Wilaya;
  image?: string;
  date?: string;
  created_at: Date | null;
  Media: any;
  seller: any;
};

export default function ShowPendingListings({pendingListings}:PendingListingsProps){
    const router = useRouter();
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [isDeleteOpen,setIsDeleteOpen] = useState<boolean>(false);
    const [isViewOpen,setIsViewOpen] = useState<boolean>(false);
    BlockScroll(isDeleteOpen || isViewOpen);
    const [selectedId,setSelectedId] = useState('');
    const [selectedProperty,setSelectedProperty] = useState<UserProperty |PendingListingItem| null>(null);


    const handleAcceptListingRequest = async(propertyId:string) =>{
        setIsLoading(true);
        setSelectedId(propertyId);
        const toastId = toast.loading('Accepting the property request...');
        try{    
            const res = await acceptPropertyRequests(propertyId);
            if (!res?.success){
                toast.error('Failed to accept this property!',{id:toastId})
                return
            }
            toast.success(res.message,{id:toastId});
            router.push('/admin/properties');
        }
        catch(error){
            toast.error('Something went wrong',{id:toastId})
        }
        finally{
            setIsLoading(false);
        }
    }
    const handleViewProperty = (propertyId:string) =>{
        const targetProperty = pendingListings.find(item => item.id === propertyId);
        if (!targetProperty){
            return null
        }
        setSelectedProperty(targetProperty);
        setIsViewOpen(true);
    }
    return(
        <>
        <tbody className="divide-y divide-black/5">
            {pendingListings.map((item,index) => (
            <tr key={index} className="hover:bg-black/[0.02] transition-colors">
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
                <td className="py-4 text-black/60 text-xs">{item.email}</td>
                <td className="py-4 text-black/50 text-xs">{item.date}</td>
                <td className="py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer" onClick={()=>handleViewProperty(item.id)} title="View Details">
                    <Eye className="w-4 h-4" />
                    </button>
                    <button disabled={isLoading} className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors cursor-pointer" title="Approve" onClick={()=>{handleAcceptListingRequest(item.id);setSelectedId(item.id)}}>
                    {isLoading && (item.id === selectedId) ? <LoaderCircle size={18} className="text-white animate-spin"/> :<Check className="w-4 h-4" />}
                    </button>
                    <button className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer" onClick={()=>{setIsDeleteOpen(true);setSelectedId(item.id)}} title="Reject">
                    <X className="w-4 h-4" />
                    </button>
                </div>
                </td>
            </tr>
            ))}
        </tbody>
        <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={()=>setIsDeleteOpen(false)} propertyId={selectedId}/>
        <PropertyViewModal isOpen={isViewOpen} onClose={()=>setIsViewOpen(false)} property={selectedProperty as UserProperty}/>
        </>
    )
}