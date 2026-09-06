import { PreferredContactMethods } from "@prisma/client";
import MapView from "./MapView";
import SellerContact from "./SellerContact";

export interface SellerContactData {
    contactInfos: {
        id?: string;
        email?: string;
        phone: string | null;
        preferredContactMethod: PreferredContactMethods | null;
        created_at: Date | null;
        updated_at: Date | null;
        userId?: string;
        fullName: string;
        property_id?: string;
    } | null;
    avatar?: string | null;
}

export interface SellerDetailsProps {
    sellerContact: SellerContactData | null;
    listings?: any;
}

export default function SellerDetails({ sellerContact, listings = [] }: SellerDetailsProps) {
    if (!sellerContact) {
        return null;
    }

    const MapViewComponent = MapView as any;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
            <MapViewComponent listings={listings} />
            <SellerContact sellerContact={sellerContact} />
        </div>
    );
}