import { getFeaturedListings } from "@/lib/services/property.service";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import EmptyFeaturedListings from "./EmptyFeaturedListings";

export default async function FeaturedListings() {
    const res = await getFeaturedListings();
    if (!res.success || !res.featuredListings) {
        return null;
    }
    const { featuredListings } = res;

    return (
        <div className="w-full flex flex-col gap-6 p-4 md:p-6 lg:p-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-black font-semibold text-lg sm:text-xl md:text-2xl">Featured Listings</h2>
                    <p className="text-black/50 text-xs sm:text-sm">Handpicked homes with standout features and value.</p>
                </div>
                <Link href="/buy" className="text-xs sm:text-sm font-medium text-primary hover:brightness-110 transition-colors shrink-0">
                    See all &rarr;
                </Link>
            </div>

            {featuredListings.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                {featuredListings.map((listing) => {
                    const mainPhoto = listing.Media?.photosSrcs?.[0] || "/image/placeholder.jpg";
                    const formattedWilaya = String(listing.wilaya).charAt(0).toUpperCase() + String(listing.wilaya).slice(1).toLowerCase();
                    const formattedType = String(listing.propertyType).charAt(0).toUpperCase() + String(listing.propertyType).slice(1).toLowerCase();
                    const isRent = String(listing.listingType).toLowerCase() === "rent";

                    return (
                        <Link
                            key={listing.id}
                            href={`/${listing.listingType === 'sale' ? 'buy' : 'rent'}/${listing.id}`}
                            className="group flex flex-col rounded-2xl bg-white border border-black/10 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden w-full"
                        >
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                                <Image
                                    src={mainPhoto}
                                    alt={`${formattedType} in ${formattedWilaya}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white backdrop-blur-md ${isRent ? 'bg-amber-600/90' : 'bg-teal-700/90'}`}>
                                        {isRent ? 'For Rent' : 'For Sale'}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-xs font-medium text-white">
                                    {formattedType}
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 p-4 gap-3">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-teal-700">
                                            {listing.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            DZD{isRent ? '/mo' : ''}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                        {formattedWilaya}
                                    </h3>

                                    {listing.address && (
                                        <p className="flex items-center gap-1 text-xs text-gray-500 line-clamp-1">
                                            <MapPin size={14} className="shrink-0 text-gray-400" />
                                            <span>{listing.address}</span>
                                        </p>
                                    )}
                                </div>

                                {listing.Property_Details && (
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-600 mt-auto gap-2">
                                        {listing.Property_Details.bedRooms !== undefined && (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Bed size={15} className="text-teal-700" />
                                                <span>{listing.Property_Details.bedRooms} Beds</span>
                                            </div>
                                        )}
                                        {listing.Property_Details.bathRooms !== undefined && (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Bath size={15} className="text-teal-700" />
                                                <span>{listing.Property_Details.bathRooms} Baths</span>
                                            </div>
                                        )}
                                        {listing.Property_Details.areaSurface !== undefined && (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Maximize2 size={15} className="text-teal-700" />
                                                <span>{listing.Property_Details.areaSurface} m²</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>):
            <EmptyFeaturedListings/>}
        </div>
    );
}