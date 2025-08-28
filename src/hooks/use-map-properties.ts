import { useState, useCallback, useRef } from "react";

import type { BaseMapType, BaseMapTypeHook } from "@/types/map-types";
import type { Map as LeafletMap } from "leaflet";

export function useMapProperties(
    properties: BaseMapType,
    setProperties: React.Dispatch<React.SetStateAction<BaseMapType>>,
    mapRef: React.MutableRefObject<LeafletMap | null>
) {

    const updateProperties = useCallback(() => {
        if (!mapRef.current) return;

        try {
            const zoom = mapRef.current.getZoom();
            const center = mapRef.current.getCenter();

            setProperties(prev => ({
                ... prev,
                zoom,
                center: [center.lat, center.lng],
            }));

        } catch (error) {
            console.error('Error updating map properties');
        }
    }, [setProperties, mapRef]) 

    const getMapInstance = useCallback(() => mapRef.current, []);

    const getZoom = useCallback((): number | null => {
        return mapRef.current?.getZoom() ?? null;
    }, [mapRef])

    const getCenter = useCallback((): [number, number] | null => {
        if (!mapRef.current) return null;
        const center = mapRef.current.getCenter();
        return [center.lat, center.lng]
    }, [mapRef])

    const handleMapReady = useCallback((map: LeafletMap) => {
        mapRef.current = map;
        updateProperties();
        map.on('moveend zoomend', updateProperties);
    }, [updateProperties, mapRef])

    const handleLocationClick = useCallback((lat: number, lng: number) => {
        console.log('Location clicked:', lat, lng);
        const map = mapRef.current;
        if (map) {
          map.setView([lat, lng], properties.zoom);
        }
    }, [properties.zoom, mapRef]);

    return {
        getZoom,
        getCenter,
        getMapInstance,
        handleMapReady,
        handleLocationClick
    }
}