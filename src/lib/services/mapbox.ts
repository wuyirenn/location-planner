// service to manage mapbox api services
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

class MapboxService {
    private apiKey: string;

    // init
    constructor() {
        if (!MAPBOX_API_KEY) {
            throw new Error("MAPBOX_API_KEY is required");
        }
        this.apiKey = MAPBOX_API_KEY;
    }

    // retrieve isochrone + geojson response
    async create_isochrone(
        profile: string,
        lat: number,
        lng: number,
        contours_minutes: number, //constraining to one contour
        polygons: boolean
    ) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${lng},${lat}?contours_minutes=${contours_minutes}&polygons=${polygons}&access_token=${this.apiKey}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Mapbox API Error:', response.status, errorText);
                return {
                    error: `Mapbox API Error: ${response.status} - ${errorText}`
                };
            }

            const data = await response.json();
            
            if (data && data.type === "FeatureCollection") {
                return data; // note: geojson can be returned directly
            } else {
                return {
                    error: `Invalid response format from Mapbox API`
                };
            }
        } catch (error) {
            console.error('Isochrone creation error:', error);
            return {
                error: error instanceof Error ? error.message : "Isochrone retrieval failed"
            };
        }
    }
}

export const mapbox = new MapboxService(); // export as object