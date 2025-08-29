// map hooks

import { useCallback, useEffect } from "react";

import type { BaseMapType, SelectedLocation } from "@/types/map-types";
import type { Map as LeafletMap } from "leaflet";
import { GeocodingUtils } from "@/lib/utils/geocoding-utils";

export function useMapProperties(
    properties: BaseMapType,
    setProperties: React.Dispatch<React.SetStateAction<BaseMapType>>,
    mapRef: React.MutableRefObject<LeafletMap | null>,
    selectedLocation: SelectedLocation | null,
    setSelectedLocation: React.Dispatch<React.SetStateAction<SelectedLocation | null>>
) {

    // render / pan to correct location automatically on state change
    useEffect(() => {
        if (!mapRef.current || !selectedLocation) return;

        const map = mapRef.current;
        const [lat, lng] = selectedLocation.coordinates;
        
        map.setView([lat, lng], properties.zoom);
    }, [selectedLocation, mapRef])

    // update source of truth
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

    // get map instance
    const getMapInstance = useCallback(() => mapRef.current, [mapRef]);

    // get current zoom level
    const getZoom = useCallback((): number | null => {
        return mapRef.current?.getZoom() ?? null;
    }, [mapRef]);

    // get current center of map
    const getCenter = useCallback((): [number, number] | null => {
        if (!mapRef.current) return null;
        const center = mapRef.current.getCenter();
        return [center.lat, center.lng]
    }, [mapRef]);

    // update source of truth after map movement, selection
    const handleMapReady = useCallback((map: LeafletMap) => {
        mapRef.current = map;
        updateProperties();
        map.on("moveend zoomend", updateProperties);
    }, [updateProperties, mapRef]);

    const handleLocationClick = useCallback(async (lat: number, lng: number) => {
        console.log("Location clicked:", lat, lng);
        setSelectedLocation({
            coordinates: [lat, lng],
            source: "click",
            address: "Loading..."
        });

        try {
            const data = await GeocodingUtils.reverseGeocodeCoordinates(lat, lng);
            const address = data && !data.error ? data.address : "Address not found";
            
            // Update with the resolved address
            setSelectedLocation({
                coordinates: [lat, lng],
                source: "click",
                address
            });
        } catch (error) {
            console.error("Auto reverse geocoding failed:", error);
            setSelectedLocation({
                coordinates: [lat, lng],
                source: "click",
                address: "Address lookup failed"
            });
        }
    }, [setSelectedLocation]);

    // update source of truth post-geocode
    const handleGeocodeSuccess = (lat: number, lng: number, address: string) => {
        console.log("Location found", lat, lng);
        setSelectedLocation({
            coordinates: [lat, lng],
            source: "geocode",
            address
        });
    };

    const handleReverseGeocodeSuccess = (lat: number, lng: number, address: string) => {
        console.log("Location found", lat, lng);
        setSelectedLocation({
            coordinates: [lat, lng],
            source: "reverse-geocode",
            address
        });
    };

    return {
        getZoom,
        getCenter,
        getMapInstance,
        handleMapReady,
        handleLocationClick,
        handleGeocodeSuccess,
        handleReverseGeocodeSuccess
    }
}