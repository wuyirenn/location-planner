"use client";

// main app
import { useState } from 'react';
import GeocodeTest from '../components/ui-components/geocode-test';
import { BASE_MAP_LAT, BASE_MAP_LNG, BASE_MAP_DEFAULT_ZOOM } from '@/lib/constants/map-constants';
import dynamic from 'next/dynamic';

// dynamic import leaflet map component
const BaseMap = dynamic(() => import('../components/maps/base-map'), {
  ssr: false,
  loading: () => <div style={{ height: '500px' }}>Loading map...</div>
})

export default function Home() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([BASE_MAP_LAT, BASE_MAP_LNG]);
  const [mapZoom, setMapZoom] = useState(BASE_MAP_DEFAULT_ZOOM);

  const handleLocationClick = (lat: number, lng: number) => {
    console.log('Location clicked:', lat, lng)
    setMapCenter([lat, lng]);
    setMapZoom(15); // TO-DO: DYNAMIC ZOOM BASED OFF MAP INTERACTIONS
  }

  return (
    <main className="flex-col min-h-screen bg-dark p-8">
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Location Intelligence
        </h1>
        
        <GeocodeTest />

        <BaseMap
          center={mapCenter}
          zoom={mapZoom}
          height="400px"
          onLocationClick={handleLocationClick}
        />
      </div>
    </main>
  )
}