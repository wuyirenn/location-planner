// TO-DO: DOCUMENTATION + TRANSITIONS
// TO-DO: MAP STYLING

"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-edgebuffer";
import "leaflet/dist/leaflet.css";

import type { BaseMapProps, BaseMapType } from "@/types/map-types";
import { BASE_MAP_LAT, BASE_MAP_LNG, BASE_MAP_DEFAULT_ZOOM } from '@/lib/constants/map-constants';

delete (L.Icon.Default.prototype as any)._getIconUrl; // TO-DO: FIX TYPE ERROR
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapClickHandler({ onLocationClick }: { onLocationClick?: (lat: number, lng: number ) => void }) {
    useMapEvents({
        click: (e) => {
            if (onLocationClick) {
                onLocationClick(e.latlng.lat, e.latlng.lng);
            }
        },
    })
    return null;
}

function MapInstanceCapture({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
    const map = useMap();

    useEffect(() => {
        onMapReady?.(map);
    }, [map, onMapReady]);

    return null;
}

export default function BaseMap({
    center = [BASE_MAP_LAT, BASE_MAP_LNG],
    zoom = BASE_MAP_DEFAULT_ZOOM,
    edgeBufferTiles = 5,
    height = "400px",
    onLocationClick,
    onMapReady
}: BaseMapProps) {
    const [clickedLocation, setClickedLocation] = useState<[number, number] | null>(null);

    const handleLocationClick = (lat: number, lng: number) => {
        setClickedLocation([lat, lng]);
        if (onLocationClick) {
            onLocationClick(lat, lng);
        }
    }
    
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height, width: '95%' }}
            // key={`${center[0]}-${center[1]}-${zoom}`} // force re-render when center/zoom changes
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
                edgeBufferTiles={edgeBufferTiles}
            />
            
            <MapClickHandler onLocationClick={handleLocationClick} />
            <MapInstanceCapture onMapReady={onMapReady} />

            {clickedLocation && (
                <Marker position={clickedLocation}>
                    <Popup>
                        Selected Location<br />
                        {clickedLocation[0].toFixed(4)}, {clickedLocation[1].toFixed(4)}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    )
}