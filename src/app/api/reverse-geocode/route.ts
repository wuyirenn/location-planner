// reverse geocode api call

import { NextRequest, NextResponse } from "next/server"
import { googleMaps } from "../../../lib/services/google-maps"

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json();
    
    if (!lat || !lng ) {
      return NextResponse.json({ error: "Latitude and longitude is required" }, { status: 400 });
    }
    
    const result = await googleMaps.reverseGeocode(lat, lng);
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reverse geocoding failed" }, 
      { status: 500 }
    );
  }
}