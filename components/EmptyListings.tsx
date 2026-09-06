import { Building2, SearchX } from "lucide-react";
import Link from "next/link";

export default function EmptyListings() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 w-full h-full flex-1 min-h-[calc(100vh-200px)]">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 text-teal-700 mb-5 shrink-0">
                <Building2 size={38} />
                <SearchX size={20} className="absolute -bottom-1 -right-1 text-teal-700 bg-white rounded-full p-0.5 border border-teal-100 shadow-xs" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No properties found
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                We couldn't find any listings matching your current criteria. Try adjusting your filters or search location.
            </p>

            <Link
                href="/buy"
                className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors rounded-xl shadow-xs"
            >
                Reset Filters
            </Link>
        </div>
    );
}