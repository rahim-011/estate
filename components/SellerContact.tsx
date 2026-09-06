import { PreferredContactMethods } from "@prisma/client";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface SellerContactProps {
    sellerContact?: {
        contactInfos: {
            id?: string;
            fullName: string;
            email?: string;
            phone?: string | null; 
            preferredContactMethod?: PreferredContactMethods | null;
            created_at?: Date | null;
            updated_at?: Date | null;
            userId?: string;
            property_id?: string;
            location?: string | null;
        } | null;
        avatar?: string | null;
    } | null;
}

export default function SellerContact({ sellerContact }: SellerContactProps) {
    if (!sellerContact || !sellerContact.contactInfos) return null;

    const { contactInfos, avatar } = sellerContact;

    return (
        <div className="p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-6 border border-black/15 rounded-2xl bg-white w-full h-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0">
                        <Image
                            alt="seller avatar"
                            src={avatar || "/image/user.png"}
                            className="object-cover rounded-full border border-gray-100"
                            loading="eager"
                            fill
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h5 className="text-black text-sm sm:text-base font-semibold truncate">
                            {contactInfos.fullName || "Property Agent"}
                        </h5>
                        {contactInfos.location && (
                            <span className="text-black/60 text-xs sm:text-sm truncate">
                                {contactInfos.location}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-xs sm:text-sm text-black/80 font-medium">
                    {contactInfos.phone && (
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-black/50 shrink-0" />
                            <span>Phone: {contactInfos.phone}</span>
                        </div>
                    )}
                    {contactInfos.email && (
                        <div className="flex items-center gap-2 truncate">
                            <Mail size={16} className="text-black/50 shrink-0" />
                            <span className="truncate">Email: {contactInfos.email}</span>
                        </div>
                    )}
                </div>
            </div>

            <a href={`https://wa.me/${contactInfos.phone}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-black text-xs sm:text-sm font-semibold justify-center rounded-xl border border-black/15 p-2.5 sm:p-3 cursor-pointer hover:bg-gray-50 transition-all w-full mt-auto">
                <Mail size={18} className="text-primary shrink-0" />
                Send Message
            </a>
        </div>
    );
}