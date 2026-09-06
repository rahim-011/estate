'use client'

import { resetPasswordSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { Input } from "@base-ui/react";
import { FieldError } from "@/components/ui/field";




type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword(){

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues:{
            password: '',
            confirmPassword: '',
        }
    })

    const onSubmit = async(values: ResetPasswordValues) =>{
        
    }

    return(
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50/50">
            <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl flex">
                
                <div className="w-full lg:w-1/2 relative bg-gray-100 h-48 sm:h-64 lg:h-auto min-h-[200px]">
                    <Image
                        src="/image/resetpasswordImg.webp"
                        alt="Reset Password Illustration"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-5 sm:p-12 md:py-16 flex flex-col justify-center">
                    <Link
                        href="/verify-code"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-8 transition-colors w-fit"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl whitespace-nowrap md:text-[1.6rem] font-bold text-gray-900 mb-3">Create New Password</h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Your new password must be different from previously used passwords.
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                New Password
                            </label>

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <Input
                                                {...field}
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all ${
                                                    fieldState.invalid
                                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                                                }`}
                                            />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                Confirm Password
                            </label>

                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                            <Input
                                                {...field}
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all ${
                                                    fieldState.invalid
                                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                                                }`}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} className="text-red-500 text-["/>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full mt-4 py-4 px-4 bg-teal-800 hover:bg-teal-900 text-white font-medium text-base rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Resetting Password...</span>
                                </>
                            ) : (
                                <span>Reset Password</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}