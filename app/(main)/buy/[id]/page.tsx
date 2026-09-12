import PropertyReview from "@/components/PropertyView";


export const dynamic = 'force-dynamic';

export default async function BuyProperty({params}:{params:Promise<{id:string}>}){
    const id = (await params).id;
    if (!id){
        return null
    }
    return(
        <PropertyReview propertyId={id}/>
    )
}