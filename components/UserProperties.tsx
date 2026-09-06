'use client'

import { UserProperty } from "@/lib/services/user.service";
import PropertieStatusSwitches from "./PropertieStatusSwitches";
import ShowProfileProperties from "./ShowProfileProperties";
import EmptyProfileProperties from "./EmptyProfileProperties";
import { useUserStore } from "@/store/userStore";
import { Building2, Clock, CalendarX } from "lucide-react";

interface UserPropertiesProps {
    userProperties: UserProperty[];
}

export default function UserProperties({ userProperties }: UserPropertiesProps) {

    const { currentPropertieStatus } = useUserStore();
    const filteredProperties = (userProperties ?? []).filter(
        (property) => property.status === currentPropertieStatus
    );
    const title =
        currentPropertieStatus === "active"
            ? "No Active Listings"
            : currentPropertieStatus === "pending"
            ? "No Pending Approvals"
            : currentPropertieStatus === "expired"
            ? "No Expired Listings"
            : "No Properties Found";

    const description =
        currentPropertieStatus === "active"
            ? "You don't have any live or published property listings at the moment."
            : currentPropertieStatus === "pending"
            ? "There are no property listings currently undergoing review or waiting for approval."
            : currentPropertieStatus === "expired"
            ? "None of your properties have passed their active listing period."
            : "There are no listings available in this section.";

    const icon =
        currentPropertieStatus === "active"
            ? Building2
            : currentPropertieStatus === "pending"
            ? Clock
            : CalendarX;

    const actionLabel = currentPropertieStatus === "active" ? "List a Property" : undefined;
    const actionHref = currentPropertieStatus === "active" ? "/list-property" : undefined;


    return (
        <div className="flex flex-col gap-4 w-full mt-3">
            <h3 className="text-black font-semibold text-[1.2rem]">My Properties</h3>
            
            <div className="flex flex-col gap-4 w-full">
                <PropertieStatusSwitches />
                {filteredProperties.length > 0 ? (
                    <ShowProfileProperties userProperties={filteredProperties} />
                    
                ) : (
                    <EmptyProfileProperties 
                        title={title} 
                        description={description} 
                        icon={icon} 
                        actionLabel={actionLabel} 
                        actionHref={actionHref} 
                    />
                )}       
            </div>
        </div>
    );
}