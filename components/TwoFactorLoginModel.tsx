"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { otpCodeSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@base-ui/react";
import { Field, FieldError } from "./ui/field";
import { verifyLoginOtp } from "@/lib/services/twoFactor.service";
import { toast } from "sonner";

type VerifyCodeValues = z.infer<typeof otpCodeSchema>;

interface TwoFactorLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail:string
}

export default function TwoFactorLoginModal({ isOpen, onClose,userEmail }: TwoFactorLoginModalProps) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const form = useForm<VerifyCodeValues>({
        resolver: zodResolver(otpCodeSchema),
        defaultValues: {
            otpCode: "",
        },
    });

    const { formState: { isDirty, isSubmitting } } = form;

    const handleVerify = async (values: VerifyCodeValues) => {
        setError(null);
        try {
            const res = await verifyLoginOtp(values,userEmail);
            if (!res.success && res.error) {
                setError(res.error);
                form.reset();
                return;
            }
            toast.message(res.message);
            router.push('/');
        } catch (err) {
            setError('Something went wrong, please try again.');
        }

    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 relative shadow-2xl animate-in zoom-in-95 duration-200" 
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <ShieldCheck size={28} />
                </div>

                <h2 className="text-xl font-bold text-gray-900">Two-Factor Verification</h2>
                <p className="text-sm text-gray-500">
                    Open your authenticator app and enter the 6-digit code.
                </p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
                        <Controller
                            control={form.control}
                            name="otpCode"
                            render={({ field, fieldState }) => {
                                const hasError = Boolean(error || fieldState.error);
                                return (
                                    <Field>
                                        <Input
                                            {...field}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            onChange={(e) => {
                                                if (error) setError(null);
                                                field.onChange(e.target.value.replace(/\D/g, ""));
                                            }}
                                            className={`w-full text-center tracking-[0.5em] font-mono text-xl py-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                                                hasError
                                                    ? "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                                            }`}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem] mt-1" />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        {error && <p className="text-xs text-red-500 font-medium mt-3">{error}</p>}
                        <button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                            className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Verify Code"}
                        </button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}