'use client'

import { forgotPasswordSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { FieldError } from "@/components/ui/field";

type ForgotPasswordValue = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword(){

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues:{
            email: ''
        }
    })

    const onSubmit = async (value:ForgotPasswordValue)=>{

    }

    return(
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50/50">
            <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl flex overflow-hidden">
                
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
                        href="/sign-in"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-8 transition-colors w-fit"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Sign In</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl whitespace-nowrap md:text-[1.6rem] font-bold text-gray-900 mb-3">Forgot Password?</h1>
                        <p className="text-base text-gray-600 leading-relaxed">
                            Enter your email address and we'll send you a 6-digit verification code.
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Email Address
                            </label>

                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                {...field}
                                                id="email"
                                                type="email"
                                                placeholder="daniel@email.com"
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all ${
                                                    fieldState.invalid
                                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                                                }`}
                                            />
                                        </div>
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>
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
                                    <span>Sending Code...</span>
                                </>
                            ) : (
                                <span>Send Verification Code</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}