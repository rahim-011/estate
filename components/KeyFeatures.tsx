import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "./ui/field";
import { Check } from "lucide-react";




export default function KeyFeatures(){
    const {control} = useFormContext<sellProperetyOutput>();
    return(
        <div className="flex flex-col gap-3 mt-3 max-w-[80%]">
            <h2 className="text-[1.2rem] text-black font-semibold">Key Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3">
                    <Controller
                    control={control}
                    name="airConditioning"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Air Conditioning
                            </label>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="inUnitLaundry"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                In-unit Laundry
                            </label>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="balconyPatio"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Balcony / Patio
                            </label>
                        </div>
                    )}
                />
                </div>
                <div className="flex flex-col gap-3">
                    <Controller
                    control={control}
                    name="petFriendly"
                    render={({ field}) => (
                            <div className="flex items-center gap-2">
                                <div
                                    role="checkbox"
                                    tabIndex={0}
                                    aria-checked={field.value}
                                    onClick={() => field.onChange(!field.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === " " || e.key === "Enter") {
                                            e.preventDefault();
                                            field.onChange(!field.value);
                                        }
                                    }}
                                    className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                        field.value
                                            ? "bg-primary border-primary"
                                            : "bg-white border-primary"
                                    }`}
                                >
                                    {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                                <label
                                    htmlFor={field.name}
                                    onClick={() => field.onChange(!field.value)}
                                    className="cursor-pointer text-sm font-medium"
                                >
                                    Pet Friendly
                                </label>
                            </div>
                        )}
                    />
                    <Controller
                    control={control}
                    name="pool"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Pool
                            </label>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="fireplace"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Fireplace
                            </label>
                        </div>
                    )}
                />
                </div>
                <div className="flex flex-col gap-3">
                    <Controller
                    control={control}
                    name="smartHomeFeatures"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Smart Home Features
                            </label>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="walkInClosets"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Walk-in Closets
                            </label>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="securitySystem"
                    render={({ field}) => (
                        <div className="flex items-center gap-2">
                            <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        field.onChange(!field.value);
                                    }
                                }}
                                className={`size-5 shrink-0 rounded-[6px] border cursor-pointer flex items-center justify-center transition-colors ${
                                    field.value
                                        ? "bg-primary border-primary"
                                        : "bg-white border-primary"
                                }`}
                            >
                                {field.value && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <label
                                htmlFor={field.name}
                                onClick={() => field.onChange(!field.value)}
                                className="cursor-pointer text-sm font-medium"
                            >
                                Security System
                            </label>
                        </div>
                    )}
                />
                </div>
            </div>
        </div>
    )
}