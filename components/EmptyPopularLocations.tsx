import { MapPin, Compass } from "lucide-react";

export default function EmptyPopularLocations() {
    return (
        <div className="w-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-black/10 rounded-2xl bg-gray-50/50 py-12">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 text-teal-700 mb-3 shrink-0">
                <MapPin size={26} />
                <Compass size={14} className="absolute -bottom-1 -right-1 text-teal-700 bg-white rounded-full p-0.5 border border-teal-100 shadow-xs" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                No popular locations available
            </h3>
            <p className="text-xs text-gray-500 max-w-xs">
                Featured regions will automatically populate as active listings grow.
            </p>
        </div>
    );
}