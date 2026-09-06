'use client'

import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "./ui/field"
import { Input } from "@base-ui/react"
import { UserProfileValues } from "./EditUserProfile"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export default function UserContactForm(){
    const {control} = useFormContext<UserProfileValues | any>();
    const [currentContactMethod,setCurrentContactMethod] = useState('');
    const [isContactMethodDropOpen,setIsContactMethodDropOpen] = useState<boolean>(false);
    const closeDropRef = useRef<HTMLDivElement>(null);
    const contactMethods = [
        {value: 'call' , label: 'Call'},
        {value: 'text' , label: 'Text'},
        {value: 'email', label: 'Email'}
    ]

    useEffect(()=>{
        function handleCloseDrop(e:MouseEvent){
            if (closeDropRef.current && !closeDropRef.current.contains(e.target as Node)){
                setIsContactMethodDropOpen(false)
            }
        }
        document.addEventListener('mousedown',handleCloseDrop);
        return () => document.removeEventListener('mousedown',handleCloseDrop)
    },[])
    return(
        <div className="flex flex-col gap-4 mt-3">
            <h2 className="text-[1.2rem] text-black font-semibold">Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Controller
                    control={control}
                    name="fullName"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Full Name</FieldLabel>
                            <Input {...field} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g., Samantha Lee"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="phoneNumber"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Phone Number</FieldLabel>
                            <Input {...field} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g., (204) 539201303"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                </div>
                <div className="flex flex-col gap-2" >
                    <Controller
                    control={control}
                    name="email"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Email Address</FieldLabel>
                            <Input {...field} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem]' placeholder="e.g., samantha@exemple.com"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={control}
                    name="preferredContactMethod"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-[1rem]">Preferred Contact Method</FieldLabel>
                            <div className="relative flex flex-col gap-2" ref={closeDropRef}>
                                <div className={`${currentContactMethod == '' ? 'text-black/60' : ''} h-12 w-full flex items-center justify-between rounded-lg border border-black/35 hover:border-black/70  px-3.5 text-sm cursor-pointer select-none transition-all`} onClick={()=>setIsContactMethodDropOpen(prev => !prev)}>
                                    {currentContactMethod == '' ? 'Call | Text | Email' : currentContactMethod.charAt(0).toUpperCase() + currentContactMethod.slice(1)}
                                    <ChevronDown size={16} className="absolute right-2  text-black/60"/>
                                    
                                </div>
                                {isContactMethodDropOpen && <div className="absolute top-12 w-full border border-black/15 rounded-b-lg bg-white z-20">
                                    <ul className="flex flex-col gap-2">
                                        {contactMethods.map((type,index)=>(
                                            <li className="text-black/90 text-[0.9rem] p-3 cursor-pointer hover:bg-black/5 transition-all" onClick={()=>{setCurrentContactMethod(type.value);setIsContactMethodDropOpen(false);field.onChange(type.value)}} key={index}>{type.label}</li>
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