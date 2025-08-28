import { LatLngBounds, Map as LeafletMap } from "leaflet";

export type BaseMapType = {
    center: [number, number];
    zoom: number;
}

export type BaseMapProps = {
    center : [number, number];
    zoom: number;
    edgeBuffer: number;
    height: string;
    onLocationClick: (lat: number, lng: number) => void;
    onMapReady?: (map: LeafletMap) => void;
}

export type BaseMapTypeHook = {
    properties: BaseMapType;
    getZoom: () => number | null;
    getCenter: () => [number, number] | null;
    setMapInstance: (map: LeafletMap) => void;
    getMapInstance: () => LeafletMap | null;
}