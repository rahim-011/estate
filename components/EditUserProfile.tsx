'use client'

import { userProfileSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller,  FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "@base-ui/react";
import React, { useState } from "react";
import { BlockScroll, fileToBase64 } from "@/lib/utils";
import { Camera, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { changeUserInfos } from "@/lib/services/user.service";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';
import { useRouter } from "next/navigation";

export type UserProfileValues = z.infer<typeof userProfileSchema>;

interface EditUserProfileProps {
    isOpen: boolean;
    onClose: () => void;
    name:string | undefined,
    avatar:string | undefined
}

export default function EditUserProfile({ isOpen, onClose,name,avatar }: EditUserProfileProps) {
    const [errorMsg,setErrorMsg] = useState('');
    const router = useRouter();
    const form = useForm<UserProfileValues>({
        resolver: zodResolver(userProfileSchema),
        values: {
            fullName: name || '',
            pfpImage: avatar || ''
        }
    });
    const currentPfp = form.watch("pfpImage");
    const {isDirty,isSubmitting} = form.formState;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return ;
        try{
            const options = {
                maxSizeMB: 0.3, 
                maxWidthOrHeight: 400, 
                useWebWorker: true,
            };
            const compressedAvatar = await imageCompression(file,options)
            const base64string = await fileToBase64(compressedAvatar);
            form.setValue("pfpImage", base64string, { shouldValidate: true,
                shouldDirty:true,
                shouldTouch:true
            });
        }
        catch(error){
            console.error("Error processing image:", error);
            setErrorMsg("Failed to process image");
        }
    };

    const onSubmit = async (values: UserProfileValues) => {
        const toastId = toast.loading('Changing user infos...');
        setErrorMsg('');
        try{
            const result = await changeUserInfos(values);
            if (!result.success){
                setErrorMsg(result.error ?? 'Failed to connect');
                toast.dismiss(toastId);
                return;
            }
            toast.success(result.message,{id:toastId});
            router.refresh();
            onClose();
        }
        catch(error:any){
            setErrorMsg('Internal server error');
            toast.dismiss(toastId)
        }
    };

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
                    <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                        <X size={22} />
                    </button>
                </div>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <Controller
                            control={form.control}
                            name="pfpImage"
                            render={({ fieldState }) => (
                                <Field className="flex flex-col items-center gap-3">
                                    <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md group cursor-pointer">
                                        <Image
                                            src={currentPfp.toString() || avatar || '/image/user.png'}
                                            alt="Profile preview"
                                            fill
                                            loading="eager"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <label 
                                            htmlFor="pfp-upload" 
                                            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-[2px]"
                                        >
                                            <Camera size={26} />
                                            <span className="text-xs font-medium mt-1">Change</span>
                                        </label>
                                    </div>
                                    
                                    <input
                                        id="pfp-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                            

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="fullName"
                            render={({ field, fieldState }) => (
                                <Field className="flex flex-col gap-2">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-800">
                                        Full Name
                                    </FieldLabel>
                                    <Input 
                                        {...field}
                                        placeholder="Enter your full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />
                                    )}
                                </Field>
                            )}
                        />
                        {errorMsg && <p className="text-red-500 text-[0.85rem] mt-2">{errorMsg}</p>}
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
                                {isSubmitting ?<LoaderCircle size={18} className="text-white animate-spin"/>  : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}