"use client";

import { changeUserPassword } from "@/lib/services/user.service";
import { changePasswordSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Input } from "@base-ui/react";
import { FieldLabel, FieldError } from "./ui/field";
import { LoaderCircle } from "lucide-react";

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const [errorMsg, setErrorMsg] = useState('');
    const form = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    });
    const { isSubmitting,isDirty } = form.formState;
    
    const onSubmit = async (values: ChangePasswordValues) => {
        const toastId = toast.loading('Changing your password...');
        try {
            const result = await changeUserPassword(values);
            if (!result.success) {
                setErrorMsg(result.error ?? 'Feiled to connect');
                toast.dismiss(toastId);
                return;
            }
            toast.success(result.message, { id: toastId });
            form.reset()
        } catch (error) {
            setErrorMsg('Internal server error');
            toast.dismiss(toastId);
        }
    };

    const inputStyles = "w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        
                        <Controller
                            control={form.control}
                            name="currentPassword"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <FieldLabel htmlFor="currentPassword">
                                        Current Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="currentPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className={inputStyles}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]" />
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="newPassword"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <FieldLabel htmlFor="newPassword">
                                        New Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className={inputStyles}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]" />
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-2">
                                    <FieldLabel htmlFor="confirmNewPassword">
                                        Confirm New Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="confirmNewPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className={inputStyles}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]" />
                                    )}
                                </div>
                            )}
                        />

                        <div className="pt-2">
                            <button
                                disabled={!isDirty || isSubmitting}
                                type="submit"
                                className={`bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center min-w-42 ${!isDirty ? 'opacity-70' : ''}`}
                            >
                                {isSubmitting ? <LoaderCircle size={18} className="text-white/70 animate-spin"/> :'Update Password'}
                            </button>
                        </div>
                        {errorMsg && <p className="text-red-500 text-[0.85rem] mt-2">{errorMsg}</p>}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}