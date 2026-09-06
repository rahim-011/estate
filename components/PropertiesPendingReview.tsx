'use client'

import { PendingListings } from "@/app/(admin)/admin/page";
import { Check,LoaderCircle,X } from "lucide-react";
import { ConfirmDeleteModal } from "./DeletePropertyModel";
import { useState } from "react";
import { toast } from "sonner";
import { acceptPropertyRequests } from "@/lib/services/admin.service";
import { useRouter } from "next/navigation";


interface PropertiesPendingReviewProps {
  pendingListingsReview: PendingListings[];
}

export default function PropertiesPendingReview({
  pendingListingsReview,
}: PropertiesPendingReviewProps){
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [selectedId,setSelectedId] = useState('');
    const router = useRouter();
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const handleAcceptPendingProperties = async(propertyId:string) =>{
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
    return(
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-black/10 text-black/40 font-medium">
                <tr>
                    <th className="pb-3">Property</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Submitted By</th>
                    <th className="pb-3 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                {pendingListingsReview.map((item,index) => (
                    <tr key={index}>
                    <td className="py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                        item.listingType === 'sale' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                        {item.listingType}
                        </span>
                    </td>
                    <td className="py-4 font-semibold text-gray-900">{item.price.toFixed(2)}</td>
                    <td className="py-4 text-black/60 text-xs">{item.seller.email}</td>
                    <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                        <button disabled={isLoading} className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors cursor-pointer" onClick={()=>handleAcceptPendingProperties(item.id)}>
                         {isLoading && item.id === selectedId ? <LoaderCircle size={18} className="text-white/70 animate-spin"/> : <Check className="w-4 h-4" />}
                        </button>
                        <button className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer" onClick={()=>{setSelectedId(item.id);setIsOpen(true)}}>
                            <X className="w-4 h-4" />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ConfirmDeleteModal onClose={()=>setIsOpen(false)} isOpen={isOpen} propertyId={selectedId}/>
            </div>
    )
}