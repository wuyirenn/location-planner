import { useCallback, useEffect } from "react";

import type { BaseMapType, SelectedLocation } from "@/types/map-types";
import type { Map as LeafletMap } from "leaflet";

export function useMapProperties(
    properties: BaseMapType,
    setProperties: React.Dispatch<React.SetStateAction<BaseMapType>>,
    mapRef: React.MutableRefObject<LeafletMap | null>,
    selectedLocation: SelectedLocation | null,
    setSelectedLocation: React.Dispatch<React.SetStateAction<SelectedLocation | null>>
) {

    useEffect(() => {
        if (!mapRef.current || !selectedLocation) return;

        const map = mapRef.current;
        const [lat, lng] = selectedLocation.coordinates;
        const zoom = (selectedLocation.source === "geocode" && properties.zoom <= 14) ? 14 : properties.zoom;

        map.setView([lat, lng], zoom);
    }, [selectedLocation, mapRef])

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
            console.error("Error updating map properties: ", error);
        }
    }, [setProperties, mapRef]);

    const getMapInstance = useCallback(() => mapRef.current, [mapRef]);

    const getZoom = useCallback((): number | null => {
        return mapRef.current?.getZoom() ?? null;
    }, [mapRef]);

    const getCenter = useCallback((): [number, number] | null => {
        if (!mapRef.current) return null;
        const center = mapRef.current.getCenter();
        return [center.lat, center.lng]
    }, [mapRef]);

    const handleMapReady = useCallback((map: LeafletMap) => {
        mapRef.current = map;
        updateProperties();
        map.on("moveend zoomend", updateProperties);
    }, [updateProperties, mapRef]);

    const handleLocationClick = (lat: number, lng: number) => {
        console.log("Location clicked:", lat, lng);
        setSelectedLocation({
            coordinates: [lat, lng],
            source: "click"
        });
    };

    const handleGeocodeSuccess = (lat: number, lng: number) => {
        console.log("Location found", lat, lng);
        setSelectedLocation({
            coordinates: [lat, lng],
            source: "geocode"
        });
    };

    return {
        getZoom,
        getCenter,
        getMapInstance,
        handleMapReady,
        handleLocationClick,
        handleGeocodeSuccess
    }
}