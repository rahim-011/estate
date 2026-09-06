'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getWilayaCoords } from '@/lib/utils';
import { ListingInfos } from '@/lib/services/property.service';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapContent({ listings = [] }: { listings?: ListingInfos[] }) {
  const firstWilaya = listings?.[0]?.wilaya;
  const centerCoords = getWilayaCoords(firstWilaya);

  return (
    <MapContainer
      key={firstWilaya || 'default'}
      center={centerCoords}
      zoom={8}
      className="w-full h-full min-h-[400px] rounded-2xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {listings?.map((item, index) => {
        const baseCoords = getWilayaCoords(item.wilaya);
        const lat = baseCoords[0] + (index % 5) * 0.006;
        const lng = baseCoords[1] + (index % 5) * 0.006;

        return (
          <Marker key={item.id || index} position={[lat, lng]} icon={customIcon}>
            <Popup>
              <div className="p-1 text-right">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.address}, {item.wilaya}</p>
                <p className="text-sm font-semibold text-primary mt-1">{item.price} DA</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}