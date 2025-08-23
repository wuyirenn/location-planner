const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_SECRET = process.env.GOOGLE_MAPS_SECRET

// TO-DO: CLEAN UP + DOCUMENTATION
// TO-DO: OTHER APIs
class GoogleMapsService {
  private apiKey: string
  private secret: string

  constructor() {
    if (!GOOGLE_MAPS_API_KEY || !GOOGLE_MAPS_SECRET) {
      throw new Error('GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_SECRET are required')
    }
    this.apiKey = GOOGLE_MAPS_API_KEY
    this.secret = GOOGLE_MAPS_SECRET
  }

  async geocode(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'Unknown error'}`)
    }
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No results found')
    }
    
    const result = data.results[0]
    
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address,
      place_id: result.place_id,
      status: data.status
    }
  }
}

export const googleMaps = new GoogleMapsService()