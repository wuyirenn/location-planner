// geocoding types

export type GeocodeResult = {
    lat: number
    lng: number
    address: string
    place_id: string
    status: string
};
  
export type GeocodeError = {
    error: string
};

export type GeocodeInterfaceProps = {
    onGeocodeSuccess?: (lat: number, lng:number) => void;
}