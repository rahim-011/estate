import ChangePasswordForm from "@/components/ChangePasswordForm";
import TwoFactorAuth from "@/components/TwoFactorAuth";



export default function Privacy(){
    return(
        <div className="w-full max-w-4xl flex flex-col gap-4">
            <h1 className="text-black font-semibold text-3xl">Privacy & Security</h1>
            <div className="flex flex-col gap-4 mt-4">
                <ChangePasswordForm/>
                <TwoFactorAuth/>
            </div>
        </div>
        
    )
}