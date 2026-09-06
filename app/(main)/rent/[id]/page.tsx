import PropertyReview from "@/components/PropertyView";



export default async function RentProperty({params}:{params:Promise<{id:string}>}){
    const id = (await params).id;
    if (!id){
        return null
    }
    return(
        <PropertyReview propertyId={id}/>
    )
}