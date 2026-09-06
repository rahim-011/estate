'use client'

import { contactSchema } from "@/schemas/contactSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller,  FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { Field, FieldLabel,FieldError } from "./ui/field";
import { Input } from "@base-ui/react";
import { handleContactForm } from "@/lib/services/contact.service";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";


export type ContactFormValues = z.input<typeof contactSchema>;


export default function ContactForm(){
    const [loading,setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues:{
            name:'',
            email:'',
            phoneNumber:'',
            message:''
        }
    })

    const {formState:{isDirty,isSubmitting}} = form;
    const onSubmit = async (values: ContactFormValues) =>{
        setIsLoading(true);
        const toastId = toast.loading('Sending your message...');
        const res = await handleContactForm(values);
        console.log(res);
        setIsLoading(false);
        if (!res.success){
            return toast.error(res.error || 'Something went wrong',{
                id:toastId,
            })
        }
        toast.success(res.message,{
            id:toastId
        })
        form.reset({
            name: '',
            email: '',
            message: '',
            phoneNumber: '',
        })
    }
    return(
        <div className="rounded-lg shadow border border-black/15 p-3 flex items-center justify-center">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full p-3">
                    <Controller
                    control={form.control}
                    name="name"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-black text-[0.9rem]">Name</FieldLabel>
                            <Input type="text" {...field} className="focus-within:ring-0 ring-0 border border-black/10 rounded-lg p-3 placeholder:text-black/40" placeholder="Enter Your Name"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="!text-red-500 text-[0.75rem"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={form.control}
                    name="email"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-black text-[0.9rem]">Email </FieldLabel>
                            <Input type="email" {...field} className="focus-within:ring-0 ring-0 border border-black/10 rounded-lg p-3 placeholder:text-black/40" placeholder="Enter Your Email"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="!text-red-500 text-[0.75rem"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={form.control}
                    name="phoneNumber"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-black text-[0.9rem]">Phone Number</FieldLabel>
                            <Input type="text" {...field} className="focus-within:ring-0 ring-0 border border-black/10 rounded-lg p-3 placeholder:text-black/40" placeholder="Enter Your Number"/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="!text-red-500 text-[0.75rem"/>}
                        </Field>
                    )}/>
                    <Controller
                    control={form.control}
                    name="message"
                    render={({field,fieldState})=>(
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-black text-[0.9rem]">Enter Your Message</FieldLabel>
                            <textarea className="focus-within:ring-0 ring-0 border border-black/10 rounded-lg p-3 placeholder:text-black/40" placeholder="Enter Your Name" {...field}/>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="!text-red-500 text-[0.75rem"/>}
                        </Field>
                    )}/>
                    <button disabled={!isDirty || isSubmitting} type="submit" className={`text-white font-semibold w-full text-center rounded-lg bg-blue-500 hover:brightness-110 cursor-pointer p-3 mt-4 transition-all flex items-center justify-center ${!isDirty ? 'opacity-70' : ''}`}>{isSubmitting ? <LoaderCircle size={18} className="text-white/50 animate-spin"/> : 'Send Enquiry'}</button>
                </form>
            </FormProvider>
        </div>
    )
}