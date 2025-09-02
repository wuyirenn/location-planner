// TO-DO: DOCUMENTATION + TRANSITIONS
// TO-DO: MAP STYLING

// map component
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet-edgebuffer";
import "leaflet/dist/leaflet.css";

import type { BaseMapProps } from "@/types/map-types";

// icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// handle map click
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

// core leaflet map object
export default function BaseMap({
    center,
    zoom,
    edgeBufferTiles,
    height,
    onLocationClick,
    onMapReady,
    selectedLocation,
    isochrone
}: BaseMapProps) {

    const handleLocationClick = (lat: number, lng: number) => {
        if (onLocationClick) {
            onLocationClick(lat, lng);
        }
    };

    const getIsochroneStyle = (feature: any) => {
        // Guard against undefined feature or missing properties
        if (!feature?.properties?.contour) {
            return {
                fillColor: 'gray',
                fillOpacity: 0.3,
                weight: 1,
                color: 'black'
            };
        }

        const contour = feature.properties.contour;
        
        return {
            fillColor: contour === 10 ? 'red' : 
                      contour === 20 ? 'orange' : 'yellow',
            fillOpacity: 0.3,
            weight: 2,
            color: 'black'
        };
    };
    
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height, width: "95%" }}
            // key={`${center[0]}-${center[1]}-${zoom}`} // force re-render when center/zoom changes
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                edgeBufferTiles={edgeBufferTiles} // buffer for cleaner renders
            />

            {isochrone && (
                <>
                    {console.log("rendering isochrone with data", isochrone)}
                    <GeoJSON 
                        data={isochrone} 
                        style={getIsochroneStyle}
                    />
                </>
            )}
            
            <MapClickHandler onLocationClick={handleLocationClick} />
            <MapInstanceCapture onMapReady={onMapReady} />

            {selectedLocation && (
                <Marker position={selectedLocation.coordinates}>
                    <Popup>
                        Selected Location<br />
                        {selectedLocation.source === "geocode" ? "Geocoded Location" : "Selected Location"}<br />
                        {selectedLocation.address && <><strong>{selectedLocation.address}</strong><br /></>}
                        {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
                    </Popup>
                </Marker>
            )}

        </MapContainer>
    )
}