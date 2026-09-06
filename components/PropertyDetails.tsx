import { AgentsList } from "@/lib/services/agent.service";
import PropertyDetailsHero from "./PropertyDetailsHero";
import PropertyDetailsSub from "./PropertyDetailsSub";
import SellerDetails, { SellerContactData } from "./SellerDetails";
import type { PropertyDetails } from "@/lib/services/property.service";

interface PropertyDetailsProps {
    propertyDetails: PropertyDetails;
    agents: AgentsList;
}

export default function PropertyDetails({ propertyDetails, agents }: PropertyDetailsProps) {
    if (!propertyDetails || !propertyDetails.seller || !propertyDetails.Property_Details || !agents) {
        return null;
    }

    const propertyInfos = {
        name: propertyDetails.name,
        wilaya: propertyDetails.wilaya,
        price: propertyDetails.price,
        propertyType: propertyDetails.propertyType,
        keyFeatures: propertyDetails.Key_Features,
        ...propertyDetails.Property_Details
    };

    const sellerContact = {
        contactInfos: {
            ...propertyDetails.seller.contactInfo,
            fullName: propertyDetails.seller.name,
            id: propertyDetails.seller.contactInfo?.id ?? ""
        },
        avatar: propertyDetails.seller.image,
    } as SellerContactData;

    const requestedProperty = {
        id: propertyDetails.id,
        name: propertyDetails.name,
        price: propertyDetails.price,
        address: propertyDetails.address,
        wilaya: propertyDetails.wilaya,
        propertyType: propertyDetails.propertyType,
        listingType: propertyDetails.listingType,
        status: propertyDetails.status,
        seller_id: propertyDetails.seller_id,
        created_at: propertyDetails.created_at ?? null,
        updated_at: propertyDetails.updated_at ?? null,
        Media: propertyDetails.Media ? { photosSrcs: propertyDetails.Media.photosSrcs } : null,
        Property_Details: {
            bedRooms: propertyDetails.Property_Details.bedRooms,
            bathRooms: propertyDetails.Property_Details.bathRooms,
            areaSurface: propertyDetails.Property_Details.areaSurface,
        },
        seller: {
            name: propertyDetails.seller.name,
            email: sellerContact?.contactInfos?.email ?? sellerContact?.contactInfos?.email ?? "",
            image: propertyDetails.seller.image ?? null,
            location: propertyDetails.seller.location ?? null,
        },
    };

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-10">
            <PropertyDetailsHero 
                agents={agents} 
                requestedProperty={requestedProperty} 
            />
            <PropertyDetailsSub propertyInfos={propertyInfos} />
            <SellerDetails sellerContact={sellerContact} />
        </div>
    );
}