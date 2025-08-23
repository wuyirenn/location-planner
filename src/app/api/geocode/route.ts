import { NextRequest, NextResponse } from 'next/server'
import { googleMaps } from '../../../lib/services/google-maps'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }
    
    const result = await googleMaps.geocode(address)
    return NextResponse.json(result)
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Geocoding failed' }, 
      { status: 500 }
    )
  }
}