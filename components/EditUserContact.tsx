'use client'

import { userContactSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "@base-ui/react";
import  {  useState } from "react";
import { ChevronDown, LoaderCircle, X } from "lucide-react";
import { BlockScroll } from "@/lib/utils";
import { ChangeUserContactInfos } from "@/lib/services/user.service";
import { toast } from "sonner";
import { PreferredContactMethods } from "@prisma/client";


export type UserContactValues = z.infer<typeof userContactSchema>;

interface EditUserContactProps {
    isOpen: boolean;
    onClose: () => void;
    userContactInfos?:{
        location?:string
        contactInfo?:{
            email:string
            phone:string
            preferredContactMethod: PreferredContactMethods
        }
    }
}

const contactOptions = [
    {label:'Email',value:'email'},
    {label:'SMS',value:'sms'},
    {label:'Phone',value:'phone'},
    {label:'WhatsApp',value:'whatsApp'},
];

export default function EditUserContact({ isOpen, onClose,userContactInfos }: EditUserContactProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errorMsg,setErrorMsg] = useState('');

    const contactInfo = userContactInfos?.contactInfo;
    const form = useForm<UserContactValues>({
        resolver: zodResolver(userContactSchema),
        defaultValues: {
            location: userContactInfos?.location || '',
            email: contactInfo?.email|| '',
            phone: contactInfo?.phone || '',
            preferredContact: contactInfo?.preferredContactMethod ||  'phone'
        }
    });
    const {formState:{isDirty,isSubmitting}} = form;
    const onSubmit = async (values: UserContactValues) => {
        const toastId = toast.loading('Changing user contact infos...');
        setErrorMsg('');
        try{
            const result = await ChangeUserContactInfos(values);
            if (!result.success){
                setErrorMsg(result.error ?? 'Failed to connect');
                toast.dismiss(toastId);
                return
            }
            toast.success(result.message,{id:toastId});
            form.reset(values);
            onClose();
        }
        catch(error){
            setErrorMsg('Internal server error');
            toast.dismiss(toastId);
        }
    }

    BlockScroll(isOpen);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg flex flex-col gap-6 shadow-2xl relative border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h1 className="text-2xl font-bold text-black">Edit Contact Information</h1>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                        <X size={22} />
                    </button>
                </div>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-800">
                                        Email Address
                                    </FieldLabel>
                                    <Input 
                                        {...field}
                                        type="email"
                                        placeholder="enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="phone"
                            render={({ field, fieldState }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-800">
                                        Phone Number
                                    </FieldLabel>
                                    <Input 
                                        {...field}
                                        type="tel"
                                        placeholder="enter your phone number"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="location"
                            render={({ field, fieldState }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-800">
                                        Location
                                    </FieldLabel>
                                    <Input 
                                        {...field}
                                        placeholder="city, country"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="preferredContact"
                            render={({ field, fieldState }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-800">
                                        Preferred Contact Method
                                    </FieldLabel>
                                    
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                                            className="w-full flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                        >
                                            <span>{field.value || "Select method"}</span>
                                            <ChevronDown 
                                                size={18} 
                                                className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden flex flex-col py-1">
                                                {contactOptions.map((option,index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => {
                                                            field.onChange(option.value);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-2.5 text-sm text-left hover:bg-primary/10 transition-colors cursor-pointer ${
                                                            field.value === option.value ? 'font-semibold text-primary bg-primary/5' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!isDirty || isSubmitting}
                                type="submit"
                                className={`flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:brightness-110 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer min-w-42 ${!isDirty ? 'opacity-70' : ''}`}
                            >
                                {isSubmitting ? <LoaderCircle size={18} className="text-white/70 animate-spin"/> :'Save Changes'}
                            </button>
                        </div>
                    </form>
                    {errorMsg && <p className="text-red-500 text-[0.85rem]">{errorMsg}</p>}
                </FormProvider>
            </div>
        </div>
    );
}