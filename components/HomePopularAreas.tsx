import { getPopularLocations } from "@/lib/services/property.service";
import Image from "next/image";
import Link from "next/link";
import EmptyPopularLocations from "./EmptyPopularLocations";

export default async function HomePopularAreas() {
    const { popularLocations } = await getPopularLocations();

    return (
        <div className="w-full flex flex-col gap-6 p-4 md:p-6 lg:p-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-black font-semibold text-lg sm:text-xl md:text-2xl">Popular Areas</h2>
                    <p className="text-black/50 text-xs sm:text-sm">Top locations with the most in-demand homes.</p>
                </div>
                <Link href="/buy" className="text-xs sm:text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors shrink-0">
                    See all &rarr;
                </Link>
            </div>

            {popularLocations.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                {popularLocations.map((area, index) => (
                    <Link
                        key={index}
                        href={`/buy?wilaya=${area.wilaya}`}
                        className="group relative flex flex-col rounded-2xl overflow-hidden aspect-[4/3] w-full bg-gray-100 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                        <Image 
                            src={area.imageSrc ?? ''}
                            alt={`image of ${area.wilaya} city`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="eager"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-base font-bold text-white line-clamp-1">
                                {String(area.wilaya).charAt(0).toUpperCase() + String(area.wilaya).slice(1).toLowerCase()}
                            </h3>
                            {area.numberOfListings && (
                                <span className="text-xs text-white/80 font-medium">
                                    {area.numberOfListings} Listings
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>):
            <EmptyPopularLocations/>}
        </div>
    );
}