// geocode component
"use client"

import { useState } from "react";
import type { GeocodeResult, GeocodeError, GeocodeInterfaceProps } from "@/types/geocoding-types";
import { GeocodingUtils } from "@/lib/utils/geocoding-utils";

export default function GeocodeInterface({
  selectedLocation,
  onGeocodeSuccess,
  onReverseGeocodeSuccess
}:
  GeocodeInterfaceProps
) {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<GeocodeResult | GeocodeError | null>(null);
  const [loading, setLoading] = useState(false);

  // handle geocode
  const handleGeocode = async () => {
    if (!address) return;
    
    setLoading(true)
    try {
      const data = await GeocodingUtils.geocodeAddress(address)
      setResult(data);

      // if geocode is successful and coords obtained, update map
      if (data && !data.error && data.lat && data.lng && onGeocodeSuccess) {
        onGeocodeSuccess(data.lat, data.lng);
      }
    } catch {
      setResult({ error: "Failed to geocode" });
    }
    setLoading(false);
  }

  const handleReverseGeocode = async () => {
    if (!selectedLocation) return

    setLoading(true);
    try {
      const lat = selectedLocation.coordinates[0];
      const lng = selectedLocation.coordinates[1];

      const data = await GeocodingUtils.reverseGeocodeCoordinates(lat, lng);
      setResult(data);

      if (data && !data.error && data.address && onReverseGeocodeSuccess) {
        onReverseGeocodeSuccess(lat, lng, data.address);
      }
    } catch {
      setResult({ error: "Failed to reverse geocode" });
    }
    setLoading(false);
  };


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

      <div className="flex gap-2 mb-4">
        <div className="flex-1 p-2">

          <button
            onClick={handleReverseGeocode}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Reverse Geocode"}
          </button>
        </div>
      </div>


      {result && (
        <pre className="bg-dark p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}