export class IsochroneUtils {
    static async getIsochrone(profile: string, lat: number, lng: number) {
        try {
            const response = await fetch("/api/isochrone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    profile, 
                    lat, 
                    lng, 
                    contours_minutes: "5,10,15", 
                    polygons: true })
            });
        return response.json();
        } catch (error) {
            return { error: `Failed to generate isochrone: ${error}` };
        }
    }
}