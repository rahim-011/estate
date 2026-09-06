'use client'

import { Controller, FormProvider, useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/authSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "@base-ui/react";
import { Lock, Mail, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TwoFactorLoginModal from "./TwoFactorLoginModel";
import { getTwoFactorStatus } from "@/lib/services/twoFactor.service";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPass, setShowPass] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    const onSubmit = async (values: LoginFormValues) => {
        const toastId = toast.loading('Signing in ...');
        setErrorMsg('');
        const { email, password, rememberMe } = values;
        try{
            const { error } = await authClient.signIn.email({
                email: email,
                password: password,
                rememberMe: rememberMe,
            });
            if (error) {
                setErrorMsg(error.message ?? 'Failed to connect');
                toast.error('Sign in failed', { id: toastId });
                return;
            }
            const status = await getTwoFactorStatus(values.email);
            if (status.isEnabled){
                setIsOpen(true);
                toast.dismiss(toastId);
                return
            }
            if (!status.success && status.error){
                toast.error('Could not verify 2FA status', { id: toastId });
                return;
            }
            toast.success('Sign in successfully', { id: toastId });
            router.push('/');
            form.reset(values);
            router.refresh();
        }
        catch(error){
            toast.error('An unexpected error occured',{id:toastId})
        }
    }
        

    const handleSocialLogin = async (provider: 'google') => {
        const toastId = toast.loading(`Connecting to ${provider}`);
        const { error } = await authClient.signIn.social({
            provider,
            callbackURL: '/',
        });
        if (error) {
            toast.error('Social sign-in failed', { id: toastId });
            setErrorMsg(error.message ?? 'Failed to connect');
            return;
        }
    };

    return (
        <>
        <div className="w-full max-w-[440px] md:max-w-[550px] bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 flex flex-col gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-black mb-4 sm:mb-6">
                        Login
                    </h2>

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel htmlFor={field.name} className="text-[0.85rem] font-bold text-black block">
                                    Email
                                </FieldLabel>
                                <div className="relative flex items-center">
                                    <Mail size={18} className="absolute left-3.5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        {...field}
                                        placeholder="Enter email address"
                                        className="w-full bg-white text-gray-900 placeholder-gray-400 pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-none outline-none text-[0.8rem] sm:text-sm font-medium shadow-sm"
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} className="text-[0.75rem] text-red-500 mt-1" />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel htmlFor={field.name} className="text-[0.85rem] font-bold text-black block">
                                    Password
                                </FieldLabel>
                                <div className="relative flex items-center transition-all">
                                    <Lock size={18} className="absolute left-3.5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        {...field}
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter Password"
                                        className="w-full bg-white text-gray-900 placeholder-gray-400 pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border-none outline-none text-[0.85rem] sm:text-sm font-medium shadow-sm"
                                    />
                                    {showPass ? (<Eye size={18} className="absolute right-3.5 text-gray-700 cursor-pointer" onClick={() => setShowPass(false)} />) : <EyeOff size={18} className="absolute right-3.5 text-gray-700 cursor-pointer" onClick={() => setShowPass(true)} />}
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} className="text-[0.75rem] text-red-500 mt-1" />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex items-center justify-between text-[0.85rem] pt-1">
                        <Controller
                            name="rememberMe"
                            control={form.control}
                            render={({ field }) => (
                                <label className="flex items-center gap-2 cursor-pointer text-black font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="w-4 h-4 rounded border-gray-400 text-[#0e6f79] focus:ring-0 cursor-pointer"
                                    />
                                    <span>Remember Me</span>
                                </label>
                            )}
                        />
                        <Link href="/forgot-password" className="text-red-500 font-bold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full mt-2 bg-primary hover:brightness-110 text-white font-bold py-3 rounded-full transition-colors text-sm sm:text-base shadow-md cursor-pointer ease-in flex items-center justify-center"
                    >
                        {form.formState.isSubmitting ? <LoaderCircle size={18} className="text-white/70 animate-spin" /> : 'Login'}
                    </button>
                    {errorMsg && <p className="w-full text-center text-red-500 text-[0.9rem]">{errorMsg}</p>}

                    <div className=" my-4 sm:my-5 flex items-center  gap-4">
                        <div className="w-[40%] border-t border-white/60"></div>
                        <span className="bg-transparent px-3 text-[0.85rem] text-black font-semibold whitespace-nowrap">
                            or continue with
                        </span>
                        <div className="w-[40%] border-t border-white/60"></div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer" onClick={() => handleSocialLogin('google')}
                        >
                            <Image
                                src="/image/google.png"
                                alt="Google"
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                        </button>
                    </div>
                    <div className="text-center text-[0.85rem] font-semibold text-gray-900 pt-2">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="font-bold text-white hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </FormProvider>
        </div>
        <TwoFactorLoginModal onClose={()=>setIsOpen(false)} isOpen={isOpen} userEmail={form.getValues().email}/>
        </>
    );
}