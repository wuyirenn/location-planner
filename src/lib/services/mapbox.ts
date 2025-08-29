// service to manage google maps api services
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

    // takes address -> returns json with geocoded lat / lng, address, place_id, etc
    async create_isochrone(
        profile: String,
        lat: Number,
        lng: Number,
        contours_minutes: Number, //constraining to one contour
        polygons: Boolean
    ) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${lat},${lng}?contours_minutes=${contours_minutes}&polygons=${polygons}&access_token=${this.apiKey}`
            );
            
            const data = await response.json();
            
            if (data) {
                const result = data.results[0];
                return {
                    result // return full geojson for now
                };
            } else {
                return {
                    error: `Isochrone retrieval failed`
                };
            }
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "Isochrone retrieval failed"
            };
        }
    }
}

export const mapbox = new MapboxService(); // export as object