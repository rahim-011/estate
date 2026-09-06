import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyProfileToursProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyProfileTours({
    title,
    description,
    icon: Icon,
    actionLabel,
    actionHref,
}: EmptyProfileToursProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-black/15 rounded-2xl bg-gray-50/50 py-12">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 text-teal-700 mb-3 shrink-0">
                <Icon size={26} />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                {title}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-5 leading-relaxed">
                {description}
            </p>

            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors rounded-xl shadow-xs"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}