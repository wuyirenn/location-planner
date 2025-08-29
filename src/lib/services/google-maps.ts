// service to manage google maps api services
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SECRET = process.env.GOOGLE_MAPS_SECRET;

class GoogleMapsService {
  private apiKey: string;
  private secret: string;

  // init
  constructor() {
    if (!GOOGLE_MAPS_API_KEY || !GOOGLE_MAPS_SECRET) {
      throw new Error("GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_SECRET are required");
    }
    this.apiKey = GOOGLE_MAPS_API_KEY;
    this.secret = GOOGLE_MAPS_SECRET;
  }

  // takes address -> returns json with geocoded lat / lng, address, place_id, etc
  async geocode(address: string) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                address: result.formatted_address,
                place_id: result.place_id
            };
        } else {
            return {
                error: `Geocoding failed: ${data.status}`
            };
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Geocoding failed"
        };
    }
}

    async reverseGeocode(lat: number, lng: number) {
        try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat,
                lng,
                address: result.formatted_address,
                place_id: result.place_id
            };
        } else {
            return {
                error: `Reverse geocoding failed: ${data.status}`,
                lat,
                lng
            };
        }
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "Reverse geocoding failed",
                lat,
                lng
            };
        }
    }
}

export const googleMaps = new GoogleMapsService(); // export as object