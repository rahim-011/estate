"use client";

import { useEffect, useState } from "react";
import { otpCodeSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
import z from "zod";
import { X, Copy, Check, Loader2 } from "lucide-react";
import { Input } from "@base-ui/react";
import { FieldError } from "./ui/field";
import Image from "next/image";
import { generateSecretQrCode, verifyUserOtpCode } from "@/lib/services/twoFactor.service";
import { toast } from "sonner";

export type TwoAuthValues = z.infer<typeof otpCodeSchema>;

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
    const [copied, setCopied] = useState(false);
    const [secretKey, setSecretKey] = useState<string>("");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [errMsg, setErrMsg] = useState<string>("");

    const form = useForm<TwoAuthValues>({
        resolver: zodResolver(otpCodeSchema),
        defaultValues: {
            otpCode: "",
        },
    });
    
    const { formState: { isDirty, isSubmitting } } = form;

    useEffect(() => {
        if (!isOpen) return;

        const handleAuthFunction = async () => {
            setErrMsg('');
            try {
                const res = await generateSecretQrCode();
                if (!res.success) {
                    setErrMsg('Failed to generate the QRCode');
                }
                const { secret, qrUrl } = res;
                if (secret && qrUrl) {
                    setQrCode(qrUrl);
                    setSecretKey(secret);
                    form.setValue('otpCode', '');
                }
            } catch (error) {
                setErrMsg('Failed to generate the QRCode');
            }
        };
        
        handleAuthFunction();
    }, [isOpen, form]);

    const handleCopyKey = () => {
        navigator.clipboard.writeText(secretKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onSubmit = async (values: TwoAuthValues) => {
        setErrMsg("");
        try {
            const res = await verifyUserOtpCode(values);
            if (!res.success && res.error){
                setErrMsg(res.error);
                form.reset();
                return;
            }
            toast.success(res.message);
            onSuccess();
            onClose();
        } catch (error) {
            setErrMsg("Something went wrong, please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                        Set Up Two-Factor Authentication
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 py-5">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                        <div className="w-40 h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden">
                            {!qrCode ? ( 
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Loader2 size={32} className="animate-spin text-primary" />
                                    <span className="text-xs text-center">Generating QR code...</span>
                                </div>
                            ) : (
                                <Image 
                                    alt="2FA QR Code"
                                    src={qrCode}
                                    fill
                                    sizes="160px"
                                    unoptimized
                                    className="object-contain p-2" 
                                />
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 text-center px-2 leading-relaxed">
                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).
                    </p>

                    <div className="w-full flex items-center justify-between bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                        <span className="text-xs font-mono font-semibold text-gray-700 tracking-wider">
                            {secretKey}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopyKey}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <FormProvider {...form}>  
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Controller
                            name="otpCode"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const hasError = Boolean(errMsg || fieldState.error);
                                return (
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="otpCode" className="text-xs font-semibold text-gray-800">
                                            Enter 6-digit Code
                                        </label>
                                        <Input
                                            {...field}
                                            id="otpCode"
                                            type="text"
                                            maxLength={6}
                                            placeholder="000000"
                                            onChange={(e) => {
                                                if (errMsg) setErrMsg("");
                                                field.onChange(e.target.value.replace(/\D/g, ""));
                                            }}
                                            className={`w-full px-4 py-3 text-center text-xl font-mono tracking-[0.5em] rounded-xl border text-gray-900 placeholder:text-gray-300 placeholder:tracking-normal focus:outline-none focus:ring-2 transition-all ${
                                                hasError
                                                    ? "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                                            }`}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                                    </div>
                                );
                            }}
                        />

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-1/2 py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!isDirty || isSubmitting}
                                type="submit"
                                className="w-1/2 py-3 px-4 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Verifying...</span> 
                                    </>
                                ) : "Verify & Enable"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
                {errMsg && <p className="text-red-500 text-[0.85rem] mt-3 text-center justify-self-center">{errMsg}</p>}
            </div>
        </div>
    );
}