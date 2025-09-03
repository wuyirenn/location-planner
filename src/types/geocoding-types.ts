// geocoding types
import { SelectedLocation } from "./map-types";

export type GeocodeInterfaceProps = {
    selectedLocation: SelectedLocation | null;
    onGeocodeSuccess: (lat: number, lng: number, address: string) => void;
    onReverseGeocodeSuccess: (lat: number, lng: number, address: string) => void;
}

// DEPRECATED
// export type GeocodeResult = {
//     lat: number
//     lng: number
//     address: string
//     place_id: string
//     status: string
// };
  
// export type GeocodeError = {
//     error: string;
//     lat?: number;
//     lng?: number;
// };