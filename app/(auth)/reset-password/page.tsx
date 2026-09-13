import LoadingSpinner from "@/components/LoadingSpinner";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Suspense } from "react";



export default function ResetPasswordPage(){
    return(
        <Suspense fallback={<LoadingSpinner/>}>
            <ResetPasswordForm/>
        </Suspense>
    )
}