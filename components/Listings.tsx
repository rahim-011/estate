
import { ListingInfos } from "@/lib/services/property.service"
import ShowListings from "./Listing"
import { Agent
    
 } from "@prisma/client"

export default function Listings({pageListings,agents}:{pageListings:ListingInfos[],agents:Agent[]}){
    
    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto scrollbar-none gap-3">
            {pageListings.map((listing,index)=>(
                <ShowListings listing={listing} key={listing.id} agents={agents}/>
            ))}
        </div>
    )
}