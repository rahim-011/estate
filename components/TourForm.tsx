'use client'

import { useEffect, useRef, useState } from "react";
import { tourSchema } from "@/schemas/tourSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import z from "zod";
import { Input } from "@base-ui/react";
import { Field, FieldLabel, FieldError } from "./ui/field";
import { AgentsList } from "@/lib/services/agent.service";
import { User, ChevronDown, Check, LoaderCircle, Video, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { createTourRequest } from "@/lib/services/tour.service";
import { TourTypes } from "@prisma/client";

export type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
    agents: AgentsList;
    propertyId: string;
}

export default function TourForm({ agents, propertyId }: TourFormProps) {
    if (!agents || !propertyId) {
        return null;
    }
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
    const form = useForm<TourFormValues>({
        resolver: zodResolver(tourSchema),
        defaultValues: {
            tourType: '',
            scheduledAt: undefined,
            agent_id: ''
        }
    });
    const { formState: { isDirty, isSubmitting } } = form;

    const onSubmit = async (values: TourFormValues) => {
        const toastId = toast.loading('Submitting your tour request...');
        try {
            const res = await createTourRequest(values, propertyId);
            if (!res.success) {
                toast.error(res.error, { id: toastId });
                return;
            }
            toast.success(res.message, { id: toastId });
            form.reset();
        }
        catch (error) {
            toast.error('Failed to submit your tour!');
        }
    };

    useEffect(() => {
        function closeDropDown(e: MouseEvent) {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
                setIsAgentDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', closeDropDown);
        return () => document.removeEventListener('mousedown', closeDropDown);
    }, []);

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-6">
                <Controller
                    control={form.control}
                    name="tourType"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-sm md:text-base font-semibold text-black">Tour Type</FieldLabel>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <button
                                    type="button"
                                    onClick={() => field.onChange(TourTypes.inPerson)}
                                    className={`flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl border text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                                        field.value === TourTypes.inPerson 
                                            ? "border-black bg-black text-white shadow-md" 
                                            : "border-black/20 bg-black/[0.02] hover:bg-black/5 hover:border-black/40 text-black/80"
                                    }`}
                                >
                                    <UserCheck size={18} className={field.value === TourTypes.inPerson ? "text-white" : "text-black/60"} />
                                    <span>In-Person</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => field.onChange(TourTypes.videoCall)}
                                    className={`flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl border text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                                        field.value === TourTypes.videoCall 
                                            ? "border-black bg-black text-white shadow-md" 
                                            : "border-black/20 bg-black/[0.02] hover:bg-black/5 hover:border-black/40 text-black/80"
                                    }`}
                                >
                                    <Video size={18} className={field.value === TourTypes.videoCall ? "text-white" : "text-black/60"} />
                                    <span>Video Tour</span>
                                </button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-xs md:text-sm mt-1" />}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="scheduledAt"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name} className="text-sm md:text-base font-semibold text-black">Date & Time</FieldLabel>
                            <Input
                                type="datetime-local"
                                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                className='w-full mt-1 ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/20 hover:border-black/40 focus-within:border-black rounded-xl p-3 md:p-3.5 outline-none transition-all text-xs md:text-sm font-medium bg-black/[0.01]'
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-xs md:text-sm mt-1" />}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="agent_id"
                    render={({ field, fieldState }) => {
                        const selectedAgent = agents.find((a) => a.id === field.value);

                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name} className="text-sm md:text-base font-semibold text-black">Assign Agent</FieldLabel>
                                <div className="relative mt-1" ref={dropDownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAgentDropdownOpen((prev) => !prev)}
                                        className="w-full flex items-center justify-between border border-black/20 hover:border-black/40 rounded-xl p-3 md:p-3.5 bg-black/[0.01] outline-none transition-all text-xs md:text-sm cursor-pointer"
                                    >
                                        {selectedAgent ? (
                                            <div className="flex items-center gap-3 min-w-0">
                                                {selectedAgent.image ? (
                                                    <img src={selectedAgent.image} alt={selectedAgent.name} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shrink-0 border border-black/10" />
                                                ) : (
                                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-black">
                                                        <User size={18} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col text-left truncate">
                                                    <span className="font-semibold text-black truncate text-xs md:text-sm">{selectedAgent.name}</span>
                                                    <span className="text-[0.75rem] md:text-xs text-black/50 truncate">{selectedAgent.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-black/60 font-medium">Select an agent</span>
                                        )}
                                        <ChevronDown size={18} className="text-black/60 shrink-0 ml-2" />
                                    </button>

                                    {isAgentDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/15 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1">
                                            {agents.map((agent) => {
                                                const isSelected = agent.id === field.value;
                                                return (
                                                    <button
                                                        key={agent.id}
                                                        type="button"
                                                        onClick={() => {
                                                            field.onChange(agent.id);
                                                            setIsAgentDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center justify-between p-2.5 md:p-3 rounded-lg text-left transition-colors cursor-pointer ${
                                                            isSelected ? 'bg-black/5 font-semibold' : 'hover:bg-black/5'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            {agent.image ? (
                                                                <img src={agent.image} alt={agent.name} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shrink-0 border border-black/10" />
                                                            ) : (
                                                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-black">
                                                                    <User size={18} />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-xs md:text-sm font-semibold text-black truncate">{agent.name}</span>
                                                                <span className="text-[0.75rem] md:text-xs text-black/50 truncate">{agent.email}</span>
                                                            </div>
                                                        </div>
                                                        {isSelected && <Check size={18} className="text-black shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-xs md:text-sm mt-1" />}
                            </Field>
                        );
                    }}
                />

                <button
                    type="submit"
                    disabled={!isDirty || isSubmitting}
                    className={` mt-3 md:mt-4 w-full py-3.5 md:py-4 px-4 bg-black text-white font-semibold text-sm md:text-base rounded-xl hover:bg-black/85 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center shadow-md active:scale-[0.99]`}
                >
                   {isSubmitting ? <LoaderCircle size={20} className="text-white/70 animate-spin" /> : 'Submit Tour Request'}
                </button>
            </form>
        </FormProvider>
    );
}