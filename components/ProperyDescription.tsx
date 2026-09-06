import { sellProperetyOutput } from "@/app/(main)/sell/sell-details/page";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";





export default function PropertyDescription(){
    const {control} = useFormContext<sellProperetyOutput>();
    return(
        <div className="flex flex-col gap-3 mt-3">
            <h2 className="text-[1.2rem] font-semibold text-black">Property Description</h2>
            <Controller
            control={control}
            name="properetyDescription"
            render={({field,fieldState})=>(
                <Field>
                    <textarea {...field} className="ring-0 focus-within:ring-0 placeholder:text-black/60 border border-black/35 rounded-lg p-3 focus-within:border-black/70 outline-none transition-all placeholder:text-[0.85rem] h-30" placeholder="Describe layout, neighborhood, unique features, recent upgrades"></textarea>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-[0.8rem]"/>}
                </Field>
            )}/>
        </div>
    )
}