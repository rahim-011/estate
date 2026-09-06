import FilterMethods from "@/components/FilterMethods"
import LoadingSpinner from "@/components/LoadingSpinner";
import PropertyListingsView from "@/components/PropertyListingsView"
import { FilterPageProps } from "@/lib/constants"
import { getAllListings } from "@/lib/services/property.service";
import { Suspense } from "react";
import { getAgents } from "@/lib/services/agent.service";

export default async function Rent({searchParams}:FilterPageProps){
    const params = await searchParams;
    const filters = ({
        ...params,
        type: 'rent' as const,
        homeType: params.homeType || 'all',
        page: params.page ? Number(params.page) : 1,
        bedRooms: params.beds ? Number(params.beds) : undefined,
        bathrooms: params.baths ? Number(params.baths) : undefined,
        sortBy: params.sort || 'newest'
    })
    const data =  await getAllListings(filters);
    const agentsRes = await getAgents();
    const agents = agentsRes.success ? agentsRes.agents : [];
    return(
        <main className="min-h-screen flex flex-col w-full">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 h-20"></div>
            <FilterMethods/>
            <Suspense fallback={<LoadingSpinner/>}>
            <PropertyListingsView data={data} agents={agents ?? [] as any}/></Suspense>
        </main>
    )
}