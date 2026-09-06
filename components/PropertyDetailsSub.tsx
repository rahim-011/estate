import { Fragment } from "react";
import { Key_Features, Property_Details } from "@prisma/client";
import { Bath, Bed, Check, Ruler } from "lucide-react";

type PropertyDetailsSubProps = Partial<Property_Details> & {
    name: string;
    wilaya: string;
    price: number;
    propertyType: string;
    keyFeatures?: Key_Features | null;
};

export default function PropertyDetailsSub({ propertyInfos }: { propertyInfos: PropertyDetailsSubProps }) {
    const { bedRooms, bathRooms, wilaya, builtYear, areaSurface, description, parkingType, propertyType, keyFeatures, name, price } = propertyInfos;

    const houseDetails = [
        { title: 'Beds', value: bedRooms ?? 0, icon: <Bed size={18} className="text-gray-500" /> },
        { title: 'Baths', value: bathRooms ?? 0, icon: <Bath size={18} className="text-gray-500" /> },
        { title: 'sq ft', value: areaSurface ?? 0, icon: <Ruler size={18} className="text-gray-500 rotate-45" /> }
    ];

    const houseInfos = [
        { title: 'Property Status', value: propertyType?.toLowerCase() === 'sale' ? 'For Sale' : 'For Rent' },
        { title: 'Built Year', value: builtYear || 'N/A' },
        { title: 'Type', value: propertyType || 'N/A' },
        { title: 'Parking', value: parkingType || 'N/A' }
    ];

    const KEY_FEATURES_MAP = [
        { key: 'airConditioning', label: 'Air Conditioning' },
        { key: 'petFriendly', label: 'Pet Friendly' },
        { key: 'smartHomeFeatures', label: 'Smart Home Features' },
        { key: 'inUnitLaundry', label: 'In-Unit Laundry' },
        { key: 'pool', label: 'Pool' },
        { key: 'walkInClosets', label: 'Walk-In Closets' },
        { key: 'balconyPatio', label: 'Balcony / Patio' },
        { key: 'firePlace', label: 'Fireplace' },
        { key: 'securitySystem', label: 'Security System' },
    ] as const;

    const isRent = propertyType?.toLowerCase() !== 'sale';

    return (
        <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                        {name} in {wilaya}
                    </h1>
                    <span className="text-xs sm:text-sm text-gray-500 font-normal">{wilaya}</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 shrink-0">
                    {price ? price.toLocaleString() : '0'}{isRent ? ' DA/month' : ' DA'}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-medium">
                {houseDetails.map((details, index) => (
                    <Fragment key={details.title || index}>
                        <span className="flex items-center gap-1.5">
                            {details.icon} 
                            <span className="text-gray-900 font-semibold">{details.value}</span> 
                            {details.title}
                        </span>
                        {index !== houseDetails.length - 1 && (
                            <span className="text-gray-300">|</span>
                        )}
                    </Fragment>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
                {houseInfos.map((info, index) => (
                    <div 
                        key={index} 
                        className="rounded-xl border border-gray-200/80 p-3 sm:p-4 flex flex-col gap-0.5 items-center justify-center bg-white shadow-xs text-center"
                    >
                        <h3 className="text-sm sm:text-base text-gray-900 font-bold capitalize line-clamp-1">
                            {info.value}
                        </h3>
                        <span className="text-[0.7rem] sm:text-xs text-gray-500 font-medium">
                            {info.title}
                        </span>
                    </div>
                ))}
            </div>

            {description && (
                <div className="w-full bg-gray-50/80 border border-gray-200/60 p-3 h-25 rounded-lg">
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-line">
                        {description}
                    </p>
                </div>
            )}

            <div className="flex items-center flex-wrap gap-2 w-full">
                {KEY_FEATURES_MAP.filter(({ key }) => Boolean(keyFeatures?.[key]))
                    .map(({ key, label }) => (
                        <span 
                            key={key}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-[0.85rem] font-medium border border-gray-200/50"
                        >
                            <Check size={16} className="text-teal-600 stroke-[2.5]" />
                            {label}
                        </span>
                    ))}
            </div>
        </div>
    );
}