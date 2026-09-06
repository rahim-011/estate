'use client'


import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel,FieldError } from "./ui/field";
import {  Input } from "@base-ui/react";
import { Link2, Upload,X } from "lucide-react";
import React, { useState } from "react";
import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";
import imageCompression from "browser-image-compression";
import { fileToBase64 } from "@/lib/utils";
import Image from "next/image";


export default function MediaPhotos(){
    const [errorMsg,setErrorMsg] = useState('');
    const {control} = useFormContext<sellProperetyOutput>();


    const uploadToCloudinary = async (file:File):Promise<string> =>{
        const formData = new FormData();
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        formData.append("file",file);
        formData.append("upload_preset",preset ?? '');
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method:'POST',
                body:formData
            }
        );
        if (!res.ok){
            throw new Error('Failed to upload the photo')
        }
        const data = await res.json();
        return data.secure_url;
    }

    const photosUploader =  async(e:React.ChangeEvent<HTMLInputElement>,
    field:{value?: string[],onChange:(value:string[]) => void})=>{
        try{
            const newFiles= Array.from(e.target.files ?? []);
            if(!newFiles|| newFiles.length === 0) return null;
            const options = { maxSizeMB: 0.3, maxWidthOrHeight: 600, useWebWorker: true };
            const compressedFiles = await Promise.all(
                newFiles.map((file) => imageCompression(file, options))
            );
            const uploadedImgUrls = await Promise.all(
                compressedFiles.map(file => uploadToCloudinary(file))
            );
            const currentImages = Array.isArray(field.value) ? field.value : [];
            const combined = [...currentImages, ...uploadedImgUrls].slice(0, 5);
            field.onChange(combined);
        }
        catch(error){
            setErrorMsg('Failed to process images')
        }
    }
    return(
        <div className="flex flex-col gap-5 mt-3">
            <h2 className="text-black text-[1.2rem] font-semibold">Photo & Media Upload</h2>
            <div className="flex flex-col gap-4">
                <Controller
                name="photos"
                control={control}
                render={({field,fieldState})=>{
                    const deleteImgs = (indexToDelete:number) =>{
                        const currentImages = field.value;
                        const filtredImgs = currentImages.filter((_,index) => index !== indexToDelete);
                        field.onChange(filtredImgs)
                    }
                    return(
                        <Field className="flex flex-col gap-2.5">
                            <div className="flex flex-col gap-0.5">
                                <FieldLabel
                                    htmlFor={field.name}
                                    className="text-sm font-semibold text-gray-900 flex flex-wrap items-center gap-1.5"
                                >
                                    Upload Photos{" "}
                                    <span className="text-xs font-normal text-gray-500">
                                        (Max 4 photos, min 1 required)
                                    </span>
                                </FieldLabel>
                                <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                                {Array.isArray(field.value) &&
                                    field.value.map((photoBase64: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-200 bg-slate-100 group"
                                        >
                                            <Image
                                                fill
                                                src={photoBase64}
                                                alt={`uploaded-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            
                                            <button
                                                type="button"
                                                onClick={()=>deleteImgs(index)}
                                                className="absolute top-1.5 right-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors z-20 shadow-sm cursor-pointer"
                                                title="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                {(!field.value || field.value.length < 4) && (
                                    <div className="relative aspect-square sm:w-24 sm:h-24 flex flex-col items-center justify-center border-2 border-dashed border-teal-600/40 hover:border-teal-600 rounded-xl bg-slate-50/50 transition-colors">
                                        <Input
                                            id={field.name}
                                            onChange={(e) => photosUploader(e, field)}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <Upload className="w-6 h-6 text-teal-600 mb-1" />
                                        <span className="text-[10px] font-medium text-gray-500 sm:hidden">Add Photo</span>
                                    </div>
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} className="text-[0.8rem] text-red-500 mt-0.5" />
                            )}
                        </Field>
                    )
                }}
                />
                {errorMsg && <p className="text-red-400 text-[0.85rem]">{errorMsg}</p>}
                <Controller
                control={control}
                name="video"
                render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel className="text-[1.rem]">Upload Video (Optional)</FieldLabel>
                        <div className="relative">
                            <Input {...field} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem] w-full' placeholder="YouTube or Vimeo embed link"/>
                            <Link2 size={18} className="text-primary cursor-pointer hover:brightness-110 absolute right-2 top-1/3"/>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                    </Field>
                )}/>
                <Controller
                control={control}
                name="virtualTourVideo"
                render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel className="text-[1.rem]">Virtual Tour (Optional)</FieldLabel>
                        <div className="relative">
                            <Input {...field} className='ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem] w-full' placeholder="Link to 3D tour on Matterport"/>
                            <Link2 size={18} className="text-primary cursor-pointer hover:brightness-110 absolute right-2 top-1/3"/>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                    </Field>
                )}/>
            </div>
        </div>
    )
}