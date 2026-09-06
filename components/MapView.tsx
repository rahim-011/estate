'use client';

import dynamic from 'next/dynamic';
import { ListingInfos } from '@/lib/services/property.service';

const MapContent = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] bg-gray-100 animate-pulse rounded-2xl" />,
});

export default function MapView({ listings }: { listings: ListingInfos[] }) {
  return <MapContent listings={listings} />;
}