'use client'

import BasicInfos from "@/components/BasicInfos"
import KeyFeatures from "@/components/KeyFeatures"
import MediaPhotos from "@/components/MediaPhotos"
import PropertyDescription from "@/components/ProperyDescription"
import SellContactForm from "@/components/SellContactForm"
import PropertyInfos from "@/components/ProperyInfos"
import { sellSchema } from "@/schemas/sellSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { FieldErrors } from "react-hook-form"
import { addPropertiy } from "@/lib/services/property.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PropertieStatuses, useUserStore } from "@/store/userStore"
import { LoaderCircle } from "lucide-react"
import { deleteImagesFromCloudinary } from "@/lib/services/cloudinary.service"


export type sellProperetyInput= z.input<typeof sellSchema>
export type sellProperetyOutput= z.output<typeof sellSchema>

export default function sellDetails(){
    const router = useRouter();
    const {switchPropertieStatus} = useUserStore();
    const onError = (errors:FieldErrors<sellProperetyInput>)=>{
        console.log('Validation error',errors)
    }
    const form = useForm<sellProperetyInput,any,sellProperetyOutput>({
        resolver: zodResolver(sellSchema),
        defaultValues:{
            propertyTitle: '',
            propertyWilaya: undefined,
            propertyAddress: '',
            propertyType: '',
            listingType: '',
            price: undefined,
            bedRooms: undefined,
            bathRooms: undefined,
            squareFootage: undefined,
            lotSize: undefined,
            builtYear: undefined,
            parkingType: '',
            furnishing: '',
            airConditioning: false,
            inUnitLaundry: false,
            balconyPatio: false,
            petFriendly: false,
            pool: false,
            fireplace: false,
            smartHomeFeatures: false,
            walkInClosets: false,
            securitySystem: false,
            properetyDescription: '',
            photos: [],
            video: '',
            virtualTourVideo: '',
            email: '',
            fullName: '',
            phoneNumber: '',
            preferredContactMethod: ''
        }
    })
    const {formState:{isDirty,isSubmitting}} = form;

    const onSubmit = async (values: sellProperetyOutput) => {
        toast.dismiss();
        const toastId = toast.loading("Hang tight! We're processing your property submission...");
        try{
            const res = await addPropertiy(values);
            toast.dismiss(toastId);
            if (!res.success){
                toast.error('Failed to add the property try again');
                await deleteImagesFromCloudinary(values.photos);
                form.setValue("photos" as any,[]);
                return
            }
            toast.success(res.message,{id:toastId});
            form.reset(values);
            switchPropertieStatus(PropertieStatuses.pending)
            router.push('/profile');
        }       
        catch(error){
            toast.error('Something went wrong!',{id:toastId});
            console.log(error)
        }
    }
    return(
        <main className="flex flex-col gap-5 min-h-screen">
            <div className="bg-primary h-20 w-full"></div>
            <div className="p-4 md:p-6 lg:p-10 flex flex-col gap-5">
                <h1 className="text-[1.5rem] font-semibold text-black">List Your Property</h1>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit,onError)} className="flex flex-col gap-5">
                        <BasicInfos/>
                        <PropertyInfos/>
                        <KeyFeatures/>
                        <PropertyDescription/>
                        <MediaPhotos/>
                        <SellContactForm/>
                        <button disabled={!isDirty || isSubmitting} type="submit" className={`${!isDirty ? 'opacity-70' : ''} text-white font-semibold text-[0.9rem] rounded-lg bg-primary px-5 py-3 hover:brightness-110 cursor-pointer mt-3 md:self-end transition-all flex items-center justify-center min-w-42`}>{isSubmitting ? <LoaderCircle size={18} className="text-white/70 animate-spin"/> : 'Publish Listing'}</button>
                    </form>
                </FormProvider>
            </div>
        </main>
    )
}