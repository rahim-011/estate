import PropertyDetails from "@/components/PropertyDetails";
import { getAgents } from "@/lib/services/agent.service";
import { getPropertyDetails } from "@/lib/services/property.service";
import { notFound } from "next/navigation";


interface PropertyViewProps{
    propertyId:string
}

export default async function PropertyReview({propertyId}:PropertyViewProps) {
    const [res, agentsRes] = await Promise.all([getPropertyDetails(propertyId), getAgents()]);

    if (!agentsRes || !agentsRes.success || !agentsRes.agents || !res || !res.propertyDetails) {
        notFound();
    }

    return (
        <main className="min-h-screen flex flex-col gap-3">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 h-20 mb-3" />
            <PropertyDetails propertyDetails={res.propertyDetails} agents={agentsRes.agents} />
        </main>
    );
}