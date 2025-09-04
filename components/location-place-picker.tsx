"use client"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon, SearchIcon, LocateIcon, ExternalLinkIcon } from "lucide-react"

interface Location {
  address: string
  latitude: number
  longitude: number
}

interface LocationPlacePickerProps {
  onLocationSelect: (location: Location) => void
}

interface SearchResult {
  title: string
  address: string
  latitude: number
  longitude: number
}

export function LocationPlacePicker({ onLocationSelect }: LocationPlacePickerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search-locations?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.results)
        setShowResults(true)
      } else {
        console.error("Search failed:", data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value)
    }, 500)
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      if (data.success) {
        return data.address
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error)
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const handleResultSelect = async (result: SearchResult) => {
    const location: Location = {
      address: result.address,
      latitude: result.latitude,
      longitude: result.longitude,
    }

    setCurrentLocation(location)
    setSearchValue(result.address)
    setShowResults(false)
    onLocationSelect(location)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const address = await reverseGeocode(lat, lng)

        const location: Location = {
          address,
          latitude: lat,
          longitude: lng,
        }

        setCurrentLocation(location)
        setSearchValue(address)
        onLocationSelect(location)
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied by user")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out")
            break
          default:
            setLocationError("An unknown error occurred")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const getMapUrls = (location: Location) => {
    const { latitude, longitude } = location
    return {
      google: `https://www.google.com/maps?q=${latitude},${longitude}`,
      openstreetmap: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`,
    }
  }

  return (
    <div className="space-y-4">
      <div className="gap-2 flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="shrink-0 bg-transparent"
          title="Use my current location"
        >
          <LocateIcon className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`} />
        </Button>
        Get live location
        {locationError && <p className="text-xs text-destructive">{locationError}</p>}
      </div>

      {currentLocation && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">Selected Location</h3>
                  <p className="text-sm text-muted-foreground break-words">{currentLocation.address}</p>
                  <div className="mt-2 text-xs text-muted-foreground font-mono">
                    <div>Latitude: {currentLocation.latitude.toFixed(6)}</div>
                    <div>Longitude: {currentLocation.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => window.open(getMapUrls(currentLocation).google, "_blank")}
                >
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  View in Google Maps
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => window.open(getMapUrls(currentLocation).openstreetmap, "_blank")}
                >
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  View in OpenStreetMap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentLocation && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MapPinIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-sm mb-2">No Location Selected</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Search for a location above or click the locate button to use your current position. The selected
                coordinates will be used for your event location.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
