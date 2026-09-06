'use client'

import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "@base-ui/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { propertyTypeOptions, WILAYAS } from "@/lib/constants";

export default function BasicInfos(){
    const {control} = useFormContext<sellProperetyOutput>();

    const [isListingDropOpen, setIsListingDropOpen] = useState<boolean>(false);
    const [isPropretyDropOpen, setIsPropretyDropOpen] = useState<boolean>(false);
    const [isWilayaDropOpen, setIsWilayaDropOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);



    const listingTypes = [
        { value: "sale", label: "Sale" },
        { value: "rent", label: "Rent" },
    ];


    useEffect(()=>{
        const handleClickOutSide = (e: MouseEvent) =>{
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)){
                setIsPropretyDropOpen(false);
                setIsListingDropOpen(false);
                setIsWilayaDropOpen(false);
            }
        }
        document.addEventListener('mousedown',handleClickOutSide);
        return () => document.removeEventListener('mousedown',handleClickOutSide)
    },[])

    return(
        <div className="flex flex-col gap-4">
            <h2 className="text-black font-semibold text-[1.2rem]">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" ref={dropDownRef}>
                <div className="flex flex-col gap-2">
                    <Controller
                    control={control}
                    name="propertyTitle"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Property Title</FieldLabel>
                            <Input {...field}
                            value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g, 'Modern 3BR Townhouse in Midtown Atlanta'"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>

                    <Controller
                    control={control}
                    name="propertyWilaya"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Wilaya</FieldLabel>
                            <div className="relative flex flex-col gap-2">
                                <div 
                                    className={`${!field.value ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border border-black/35 hover:border-black/70 px-3.5 text-sm cursor-pointer select-none transition-all`} 
                                    onClick={() => {
                                    setIsWilayaDropOpen(prev => !prev); 
                                    setIsListingDropOpen(false); 
                                    setIsPropretyDropOpen(false);
                                    }}
                                >
                                    {!field.value 
                                    ? 'Select Wilaya' 
                                    : WILAYAS.find(w => w.value === field.value)?.label || field.value}
                                    <ChevronDown size={16} className="absolute right-3 text-black/60"/>
                                </div>

                                {isWilayaDropOpen && (
                                    <div className="absolute top-13 z-30 w-full border border-black/15 rounded-lg bg-white max-h-56 overflow-y-auto shadow-md">
                                    <ul className="flex flex-col py-1">
                                        {WILAYAS.map((w) => (
                                        <li 
                                            key={w.value}
                                            className="text-black/90 text-[0.9rem] px-3 py-2 cursor-pointer hover:bg-black/5 transition-all" 
                                            onClick={() => {
                                            field.onChange(w.value);
                                            setIsWilayaDropOpen(false);
                                            }} 
                                        >
                                            {w.label}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                )}
                                </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
            
                    <Controller
                    control={control}
                    name="propertyAddress"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Property Address</FieldLabel>
                            <Input {...field} 
                            value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="Street, City, District"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>

                    <Controller
                    control={control}
                    name="listingType"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Listing Type</FieldLabel>
                            <div className="relative flex flex-col gap-2">
                                <div className={`${!field.value ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border border-black/35 hover:border-black/70 px-3.5 text-sm cursor-pointer select-none transition-all`} onClick={()=>{setIsListingDropOpen(prev => !prev); setIsWilayaDropOpen(false); setIsPropretyDropOpen(false);}}>
                                    {!field.value ? 'For Sale | For Rent' : field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                                    <ChevronDown size={16} className="absolute right-3 text-black/60"/>
                                </div>
                                {isListingDropOpen && <div className="absolute top-13 z-20 w-full border border-black/15 rounded-lg bg-white shadow-md">
                                    <ul className="flex flex-col py-1">
                                        {listingTypes.map((type,index)=>(
                                            <li className="text-black/90 text-[0.9rem] px-3 py-2 cursor-pointer hover:bg-black/5 transition-all" onClick={()=>{setIsListingDropOpen(false);field.onChange(type.value)}} key={index}>{type.label}</li>
                                        ))}
                                    </ul>
                                </div>}
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                </div>

                <div className="flex flex-col gap-2">
                    <Controller
                    control={control}
                    name="price"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Price / Rent</FieldLabel>
                            <Input {...field} 
                            value={field.value ?? ''} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="Asking price or monthly rent"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>

                    <Controller
                    control={control}
                    name="propertyType"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Property Type</FieldLabel>
                            <div className="relative flex flex-col gap-2">
                                <div className={`${!field.value ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border transition-all border-black/35 hover:border-black/70 px-3.5 text-sm cursor-pointer select-none`} onClick={()=>{setIsPropretyDropOpen(prev => !prev); setIsWilayaDropOpen(false); setIsListingDropOpen(false);}}>
                                    {!field.value ? 'Single-Family, Townhouse, Apartment, Land, etc.' : field.value.charAt(0).toUpperCase()+ field.value.slice(1) }
                                    <ChevronDown size={16} className="absolute right-3 text-black/60"/>
                                </div>
                                {isPropretyDropOpen && <div className="absolute top-13 z-20 w-full border border-black/15 rounded-lg bg-white shadow-md">
                                    <ul className="flex flex-col py-1">
                                        {propertyTypeOptions.map((type,index)=>(
                                            <li className="text-black/90 text-[0.9rem] px-3 py-2 cursor-pointer hover:bg-black/5 transition-all" onClick={()=>{field.onChange(type.value);setIsPropretyDropOpen(false);}} key={index}>{type.label}</li>
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