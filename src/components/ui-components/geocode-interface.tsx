// geocode component
"use client"

import { useState } from "react";
import type { GeocodeInterfaceProps } from "@/types/geocoding-types";
import { GeocodingUtils } from "@/lib/utils/geocoding-utils";

export default function GeocodeInterface({
  selectedLocation,
  onGeocodeSuccess,
  onReverseGeocodeSuccess
}:
  GeocodeInterfaceProps
) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // handle geocode
  const handleGeocode = async () => {
    if (!address) return;
    
    setLoading(true)
    try {
      const data = await GeocodingUtils.geocodeAddress(address)

      // if geocode is successful and coords obtained, update map
      if (data && !data.error && data.lat && data.lng && onGeocodeSuccess) {
        onGeocodeSuccess(data.lat, data.lng, data.address);
      }
    } catch {
      console.log("failed to geocode");
    }
    setLoading(false);
  }

  // handle reverse geocode
  const handleReverseGeocode = async () => {
    if (!selectedLocation) return

    setLoading(true);
    try {
      const [lat, lng] = selectedLocation.coordinates;

      const data = await GeocodingUtils.reverseGeocodeCoordinates(lat, lng);

      if (data && !data.error && data.address && onReverseGeocodeSuccess) {
        onReverseGeocodeSuccess(lat, lng, data.address);
      }
    } catch {
      console.log("failed to reverse geocode");
    }
    setLoading(false);
  };

  // TO-DO: ERROR HANDLING IN UI (noting that original results json no longer being displayed)
  return (
    <div className="p-6 w-full bg-dark rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enter address:</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleGeocode}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Geocode"}
        </button>
      </div>
      { selectedLocation && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Selected Location</h3>
          <div className="space-y-2 text-white font-medium text-sm">
            <p> Coordinates: [{selectedLocation.coordinates[0].toFixed(6)}, {selectedLocation.coordinates[1].toFixed(6)}] </p>
            <p> Address: {selectedLocation.address} </p>
          </div>
          
          {/* Manual refresh button for reverse geocoding */}
          {selectedLocation.source === 'click' && (
            <button
              onClick={handleReverseGeocode}
              disabled={loading}
              className="mt-3 px-3 py-1 bg-green-600 text-white text-sm rounded disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh Address"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}