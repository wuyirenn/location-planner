"use client";

// main app
import { useState, useRef } from "react";
import { BASE_MAP_LAT, BASE_MAP_LNG, BASE_MAP_DEFAULT_ZOOM } from "@/lib/constants/map-constants";

import GeocodeTest from "../components/ui-components/geocode-test";
import { useMapProperties } from "@/hooks/use-map-properties";

import type { BaseMapType } from "@/types/map-types";
import type { Map as LeafletMap } from "leaflet";

import dynamic from "next/dynamic";

// dynamic import for leaflet map component
const BaseMap = dynamic(() => import('../components/maps/base-map'), {
  ssr: false,
  loading: () => <div style={{ height: "400px" }}>Loading map...</div>
})

export default function Home() {
  const [properties, setProperties] = useState<BaseMapType>({
      center: [BASE_MAP_LAT, BASE_MAP_LNG],
      zoom: BASE_MAP_DEFAULT_ZOOM
  });

  const mapProperties = useRef<BaseMapType>(
    {
      center: [BASE_MAP_LAT, BASE_MAP_LNG],
      zoom: BASE_MAP_DEFAULT_ZOOM
    }
  )

  const mapRef = useRef<LeafletMap | null>(null);
  const { handleMapReady, handleLocationClick } = useMapProperties(
    properties,
    setProperties,
    mapProperties,
    mapRef
  )

  return (
    <main className="flex-col min-h-screen bg-dark p-8">
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Location Intelligence
        </h1>
        
        <GeocodeTest />

        <BaseMap
          center={mapProperties.current.center}
          zoom={mapProperties.current.zoom}
          height="400px"
          onLocationClick={handleLocationClick}
          onMapReady={handleMapReady}
        />

        <div className="mt-4 text-white">
          <p>Current Zoom: {properties.zoom}</p>
          <p>Current Center: { [properties.center[0].toFixed(4), properties.center[1].toFixed(4)] }</p>
          <p>Current Zoom (ref): {mapProperties.current.zoom}</p>
          <p>Current Center (ref): { [mapProperties.current.center[0].toFixed(4), mapProperties.current.center[1].toFixed(4)] }</p>
        </div>
      </div>
    </main>
  )
}