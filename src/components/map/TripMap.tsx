'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: 6px;
          left: 6px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          transform: rotate(45deg);
          color: ${color};
        ">${label}</div>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const startIcon = createCustomIcon('#22c55e', 'S')
const endIcon = createCustomIcon('#ef4444', 'E')
const waypointIcon = createCustomIcon('#3b82f6', 'W')

interface Location {
  lat: number
  lng: number
  label: string
  type: 'start' | 'end' | 'waypoint'
}

interface TripMapProps {
  onLocationsChange?: (locations: Location[]) => void
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function TripMap({ onLocationsChange }: TripMapProps) {
  const [mounted, setMounted] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [mapMode, setMapMode] = useState<'start' | 'end' | 'waypoint'>('start')
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Sri Lanka center coordinates
  const sriLankaCenter: [number, number] = [7.8731, 80.7718]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (onLocationsChange) {
      onLocationsChange(locations)
    }
  }, [locations, onLocationsChange])

  const getCurrentLocation = () => {
    setGettingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newLocation: Location = {
          lat: latitude,
          lng: longitude,
          label: 'Current Location (Starting Point)',
          type: 'start',
        }
        setLocations([newLocation, ...locations.filter(l => l.type !== 'start')])
        setMapMode('end')
        setGettingLocation(false)
        setShowLocationPrompt(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setLocationError(errorMessage)
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSetStartClick = () => {
    setMapMode('start')
    setShowLocationPrompt(true)
  }

  const handleManualSelection = () => {
    setShowLocationPrompt(false)
    setMapMode('start')
  }

  const handleMapClick = (lat: number, lng: number) => {
    const newLocation: Location = {
      lat,
      lng,
      label: mapMode === 'start' ? 'Starting Point' : mapMode === 'end' ? 'Ending Point' : `Waypoint ${locations.filter(l => l.type === 'waypoint').length + 1}`,
      type: mapMode,
    }

    if (mapMode === 'start') {
      // Remove existing start point and add new one
      setLocations([newLocation, ...locations.filter(l => l.type !== 'start')])
      setMapMode('end')
    } else if (mapMode === 'end') {
      // Remove existing end point and add new one
      setLocations([...locations.filter(l => l.type !== 'end'), newLocation])
      setMapMode('waypoint')
    } else {
      // Add waypoint
      setLocations([...locations, newLocation])
    }
  }

  const clearLocations = () => {
    setLocations([])
    setMapMode('start')
  }

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index))
  }

  // Create route line from locations
  const getRoutePoints = (): [number, number][] => {
    const start = locations.find(l => l.type === 'start')
    const end = locations.find(l => l.type === 'end')
    const waypoints = locations.filter(l => l.type === 'waypoint')

    const points: [number, number][] = []
    if (start) points.push([start.lat, start.lng])
    waypoints.forEach(wp => points.push([wp.lat, wp.lng]))
    if (end) points.push([end.lat, end.lng])

    return points
  }

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Interactive Map Selection</h3>
          <button
            onClick={clearLocations}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={handleSetStartClick}
            className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors ${
              mapMode === 'start'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              Set Start
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('end')}
            className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors ${
              mapMode === 'end'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              Set End
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('waypoint')}
            className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors ${
              mapMode === 'waypoint'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
              Add Waypoint
            </span>
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Click on the map to set your {mapMode === 'start' ? 'starting point' : mapMode === 'end' ? 'ending point' : 'waypoints'}
        </p>
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={sriLankaCenter}
          zoom={8}
          style={{ height: '500px', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Render markers */}
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              icon={
                location.type === 'start'
                  ? startIcon
                  : location.type === 'end'
                  ? endIcon
                  : waypointIcon
              }
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-gray-900 mb-1">{location.label}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </div>
                  <button
                    onClick={() => removeLocation(index)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render route line */}
          {getRoutePoints().length > 1 && (
            <Polyline
              positions={getRoutePoints()}
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Selected Locations List */}
      {locations.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Selected Route Points</h4>
          <div className="space-y-2">
            {locations.find(l => l.type === 'start') && (
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-md border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Starting Point</div>
                  <div className="text-xs text-gray-600">
                    {locations.find(l => l.type === 'start')?.lat.toFixed(4)}, {locations.find(l => l.type === 'start')?.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            )}

            {locations.filter(l => l.type === 'waypoint').map((location, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{location.label}</div>
                  <div className="text-xs text-gray-600">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
                <button
                  onClick={() => removeLocation(locations.indexOf(location))}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {locations.find(l => l.type === 'end') && (
              <div className="flex items-center gap-3 p-2 bg-red-50 rounded-md border border-red-200">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  E
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Ending Point</div>
                  <div className="text-xs text-gray-600">
                    {locations.find(l => l.type === 'end')?.lat.toFixed(4)}, {locations.find(l => l.type === 'end')?.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowLocationPrompt(false)}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Set Starting Location
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  How would you like to set your starting point?
                </p>

                {locationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{locationError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {gettingLocation ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Getting Location...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Use My Current Location (GPS)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleManualSelection}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Select Manually on Map</span>
                  </button>

                  <button
                    onClick={() => setShowLocationPrompt(false)}
                    className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    💡 Using GPS requires location permission from your browser. Click "Allow" when prompted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
