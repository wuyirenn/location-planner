'use client'

import { useState } from 'react'

// TO-DO: CLEAN UP + MOVE TYPES TO APPROPRIATE FILE
interface GeocodeResult {
  lat: number
  lng: number
  address: string
  place_id: string
  status: string
}

interface GeocodeError {
  error: string
}

export default function GeocodeTest() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState<GeocodeResult | GeocodeError | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGeocode = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ error: 'Failed to geocode' })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Geocode Test</h2>
      
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
          {loading ? 'Loading...' : 'Geocode'}
        </button>
      </div>

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}