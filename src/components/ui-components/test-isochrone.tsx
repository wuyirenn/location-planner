// isochrone component
"use client"

import { useState } from "react";
import type { IsochroneInterfaceProps } from "@/types/mapbox-types";

export default function IsochroneInterface({
    selectedLocation,
    isochrone,
    setIsochrone
}:
    IsochroneInterfaceProps
) {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<"walking" | "driving" | "cycling">("walking");

    // fetch isochrone
    const handleRetrieveIsochrone = async () => {
        if (!selectedLocation) return;

        const lat = selectedLocation.coordinates[0];
        const lng = selectedLocation.coordinates[1];
        const polygons = true;
        
        setLoading(true)
        try {
            const response = await fetch("/api/isochrone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    profile, 
                    lat, 
                    lng, 
                    contours_minutes: "5,10,15", 
                    polygons })
            });
            const data = await response.json();

            const newIsochroneData = {
                type: "FeatureCollection" as const,
                features: [...(data.features || [])],
                metadata: {
                    timestamp: Date.now(),
                    profile
                }
            };
            setIsochrone(newIsochroneData);
            console.log(isochrone);
        } catch {
            console.log("failed to retrieve isochrone");
        }
        setLoading(false);
    }

    // clear isochrone
    const handleClearIsochrone = () => {
        setIsochrone({
            type: "FeatureCollection",
            features: []
        });
    };

    return (
        <div className="flex flex-col gap-4 p-6 w-full rounded shadow">
            <h2 className="text-xl font-bold">Generate Isochrone</h2>

            <div className="flex gap-4">
                {/* Profile Selection */}
                <div className="w-full">
                    <select
                        value={profile}
                        onChange={(e) => setProfile(e.target.value as "walking" | "driving" | "cycling")}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="driving">Driving</option>
                        <option value="walking">Walking</option>
                        <option value="cycling">Cycling</option>
                    </select>
                </div>

                <button
                    onClick={handleRetrieveIsochrone}
                    disabled={loading || !selectedLocation}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                    Generate Isochrone
                </button>

                <button
                    onClick={handleClearIsochrone}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                    Clear Isochrone
                </button>
            </div>

            {isochrone && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Result:</h3>
                    {/* Check if it's an error */}
                    {isochrone.features.length === 0 ? (
                        <div className="p-4 bg-red-100 border border-red-300 rounded text-red-700">
                            No isochrone detected
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Summary */}
                            <div className="p-3 bg-green-100 border border-green-300 rounded">
                                <p className="text-green-800">
                                    Isochrone generated successfully for {profile} profile
                                </p>
                            </div>
                            
                            {/* GeoJSON Display */}
                            <div className="bg-gray-50 p-4 rounded">
                                <h4 className="font-medium mb-2">GeoJSON Result:</h4>
                                <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-96 text-gray-800">
                                    {JSON.stringify(isochrone, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}