"use client";

import { accountSettingsSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FieldError } from "@/components/ui/field";
import { changeAccountSettings, cleanUserCache } from "@/lib/services/user.service";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";




export type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;
interface AccountSettingsProps{
    user:{
        name?:string,
        email?:string,
        location?:string,
    }
}

export default function AccountSettingsForm({user}:AccountSettingsProps) {
    const [errorMsg,setErrorMsg] = useState('');
    const form = useForm({
        resolver: zodResolver(accountSettingsSchema),
        defaultValues: {
            fullName: user?.name ||  '',
            email: user?.email || '',
            location: user?.location || ''
        }
    });
    const {formState:{isDirty,isSubmitting}} = form;
    const onSubmit = async (values: AccountSettingsValues) => {
        setErrorMsg('');
        const toastId = toast.loading('Changing your account data...');
        try{
            const result = await changeAccountSettings(values);
            if (!result.success){
                toast.dismiss(toastId);
                setErrorMsg(result.error as any);
                return;
            }
            form.reset(values)
            toast.success(result.message,{id:toastId});
        }
        catch(error){
            toast.error('Something went wrong!',{id:toastId})
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        name="fullName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="fullName" className="text-sm font-semibold text-gray-800">
                                    Full Name
                                </label>
                                <input
                                    {...field}
                                    id="fullName"
                                    type="text"
                                    placeholder="daniel cena"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>
                            </div>
                        )}
                    />

                    <Controller
                        name="location"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="location" className="text-sm font-semibold text-gray-800">
                                    Location
                                </label>
                                <input
                                    {...field}
                                    id="location"
                                    type="text"
                                    placeholder="Atlanta, GA"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>
                            </div>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                                    Email
                                </label>
                                <input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="daniel@email.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>
                            </div>
                        )}
                    />
                </div>


                    <button
                        type="submit"
                        className={`bg-primary text-white font-medium px-6 py-3 min-w-[140px] rounded-lg hover:brightness-110 transition-colors cursor-pointer flex items-center justify-center mt-2 ${!isDirty ? 'opacity-65' : ''}`}
                        disabled={!isDirty || isSubmitting}
                    >
                        {isSubmitting ? (
                            <LoaderCircle size={18} className="animate-spin text-white/70" />
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                
                {errorMsg && <p className="text-red-500 text-[0.95rem] mt-2">{errorMsg}</p>}
            </form>
        </div>
    );
}