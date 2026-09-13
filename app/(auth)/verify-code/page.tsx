import LoadingSpinner from "@/components/LoadingSpinner";
import VerifyOTPCodeForm from "@/components/VerifyOTPCodeForm";
import { Suspense } from "react";


export default function VerifyOTPCodePage(){
    return(
        <Suspense fallback={<LoadingSpinner/>}>
            <VerifyOTPCodeForm/>
        </Suspense>
    )
}