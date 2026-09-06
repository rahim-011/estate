import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";
import { useFormContext } from "react-hook-form"
import { Field,FieldLabel,FieldError } from "./ui/field";
import { Input } from "@base-ui/react";
import { Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";


export default function PropertyInfos(){
    const {control} = useFormContext<sellProperetyOutput>();
    const [isParkingDropOpen,setIsParkingDropOpen] = useState<boolean>(false);
    const [isFurnishingDropOpen,setIsFurnishingDropOpen] = useState<boolean>(false);
    const [currentFurnishingType,setCurrentFurnishingType] = useState('');
    const dropDownRef = useRef<HTMLDivElement>(null);
    const parkingTypes = [
        { value: "garage", label: "Garage" },
        { value: "covered", label: "Covered Parking" },
        { value: "street", label: "Street Parking" },
        { value: "driveway", label: "Driveway" },
        { value: "carport", label: "Carport" },
        { value: "none", label: "No Parking" },
    ];
    const furnishingTypes = [
        { value: "fullFurnished", label: "Furnished" },
        { value: "semiFurnished", label: "Semi-Furnished" },
        { value: "unfurnished", label: "Unfurnished" },
    ]

    useEffect(()=>{
        const handleClickOutSide = (e: MouseEvent)=>{
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)){
                setIsParkingDropOpen(false);
                setIsFurnishingDropOpen(false);
            }
        }
        document.addEventListener('mousedown',handleClickOutSide);
        return () => document.removeEventListener('mousedown',handleClickOutSide)
    },[])
    return(
        <div className="flex flex-col gap-4 mt-4" ref={dropDownRef}>
            <h2 className="text-black font-semibold text-[1.2rem]">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <Controller
                    control={control}
                    name="bedRooms"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Number of Bedrooms</FieldLabel>
                            <Input  {...field} value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g,3"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="bathRooms"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Number of Bathrooms</FieldLabel>
                            <Input {...field} value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g, 2"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="squareFootage"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Square Footage</FieldLabel>
                            <Input {...field} value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g, 1,750 sq ft"/>
                            
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="lotSize"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Lot Size(optional)</FieldLabel>
                            <Input {...field} value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g, 0.25 acres or 10,000 sq ft"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                </div>
                <div className="flex flex-col gap-2">
                    <Controller
                    control={control}
                    name="builtYear"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Year Built</FieldLabel>
                            <Input {...field} value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g, 2015"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="parkingType"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Parking Type / Spaces</FieldLabel>
                            <div className="relative flex flex-col gap-2 z-2">
                                <div className={`${field.value == '' ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border transition-all border-black/35 hover:border-black/70 px-3.5 text-sm cursor-pointer select-none`} onClick={()=>setIsParkingDropOpen(prev => !prev)}>
                                    {field.value == '' ? 'Single-Family, Townhouse, Apartment, Land, etc.' : field.value.charAt(0).toUpperCase()+ field.value.slice(1) }
                                    <ChevronDown size={16} className="absolute right-2  text-black/60"/>
                                </div>
                                {isParkingDropOpen && <div className="absolute top-12 w-full border border-black/15 rounded-b-lg bg-white">
                                    <ul className="flex flex-col gap-2">
                                        {parkingTypes.map((type,index)=>(
                                            <li className="text-black/90 text-[0.9rem] p-3 cursor-pointer hover:bg-black/5 transition-all" onClick={()=>{field.onChange(type.value);setIsParkingDropOpen(false)}} key={index}>{type.label}</li>
                                        ))}
                                    </ul>
                                </div>}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="furnishing"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Furnishing (optional)</FieldLabel>
                            <div className="relative flex flex-col gap-2">
                                <div className={`${currentFurnishingType == '' ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border transition-all border-black/35 hover:border-black/70 px-3.5 text-sm cursor-pointer select-none`} onClick={()=>setIsFurnishingDropOpen(prev => !prev)}>
                                    {currentFurnishingType == '' ? 'Single-Family, Townhouse, Apartment, Land, etc.' : currentFurnishingType.charAt(0).toUpperCase()+ currentFurnishingType.slice(1) }
                                    <ChevronDown size={16} className="absolute right-2  text-black/60"/>
                                </div>
                                {isFurnishingDropOpen && <div className="absolute top-12 w-full border border-black/15 rounded-b-lg bg-white">
                                    <ul className="flex flex-col gap-2">
                                        {furnishingTypes.map((type,index)=>(
                                            <li className="text-black/90 text-[0.9rem] p-3 cursor-pointer hover:bg-black/5 transition-all" onClick={()=>{setCurrentFurnishingType(type.value);setIsFurnishingDropOpen(false)}} key={index}>{type.label}</li>
                                        ))}
                                    </ul>
                                </div>}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                </div>
            </div>
        </div>
    )
}