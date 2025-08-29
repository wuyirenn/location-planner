// make api call for getting isochrones

import { NextRequest, NextResponse } from "next/server";
import { mapbox } from "../../../lib/services/mapbox";

export async function POST(request: NextRequest) {
  try {
    const { profile, lat, lng, contours_minutes, polygons } = await request.json();
    
    if (!profile || !lat || !lng || !contours_minutes || !polygons) {
      return NextResponse.json({ error: "Missing arguments" }, { status: 400 });
    }
    
    const result = await mapbox.create_isochrone(profile, lat, lng, contours_minutes, polygons);
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Geocoding failed" }, 
      { status: 500 }
    );
  }
}