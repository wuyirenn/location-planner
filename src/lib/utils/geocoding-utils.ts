export class GeocodingUtils {
    static async geocodeAddress(address: string) {
      try {
        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address })
        });
        
        return await response.json();
      } catch (error) {
        return { error: `Failed to geocode address: ${error}` };
      }
    }
  
    static async reverseGeocodeCoordinates(lat: number, lng: number) {
      try {
        const response = await fetch("/api/reverse-geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng })
        });
        
        return await response.json();
      } catch (error) {
        return { error: `Failed to reverse geocode coordinates: ${error}` };
      }
    }
  }