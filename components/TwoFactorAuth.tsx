"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import TwoFactorModal from "./TwoFactorModel";
import { BlockScroll } from "@/lib/utils";
import { disableTwoFactor } from "@/lib/services/twoFactor.service";
import { toast } from "sonner";

export default function TwoFactorAuth() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    const [errMsg,setErrMsg] = useState('');
    const handleToggle = async () => {
        setErrMsg('');
        if (isEnabled){
            try{
                setIsEnabled(false)
                const res = await disableTwoFactor();
                if (!res.success && res.error){
                    setErrMsg(res.error);
                    setIsEnabled(true)
                    return
                }
                toast.success(res.message);
            }
            catch(error){
                setErrMsg('Something went wrong please try again');
                setIsEnabled(true)
            }
        }else{
            setIsOpen(true)
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl pt-6 border-t border-gray-100">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication (2FA)</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Add an extra layer of security to your account using an authenticator app.
                </p>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isEnabled ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}>
                        {isEnabled ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            {isEnabled ? "2FA is Enabled" : "2FA is Disabled"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {isEnabled ? "Your account is currently protected with 2FA." : "Enable 2FA to increase your account security."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isEnabled ? "bg-primary" : "bg-gray-300"
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                </button>
            </div>
            {errMsg && <p className="text-red-500 text-[0.85rem] text-center justify-self-center">{errMsg}</p>}
            <TwoFactorModal onClose={()=>setIsOpen(false)} isOpen={isOpen} onSuccess={()=>setIsEnabled(true)}/>
        </div>
    );
}