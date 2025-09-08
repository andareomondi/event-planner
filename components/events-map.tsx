"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, Calendar, Clock } from "lucide-react"
import type { Event } from "@/app/api/events/route"

interface EventsMapProps {
  events: Event[]
  selectedEvent?: Event | null
  onEventSelect?: (event: Event) => void
  className?: string
}

export function EventsMap({ events, selectedEvent, onEventSelect, className }: EventsMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco
  const [mapBounds, setMapBounds] = useState({
    minLat: 0,
    maxLat: 0,
    minLng: 0,
    maxLng: 0,
  })
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  // Calculate map bounds based on events
  useEffect(() => {
    if (events.length === 0) return

    const lats = events.map((event) => event.location.latitude)
    const lngs = events.map((event) => event.location.longitude)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    setMapBounds({ minLat, maxLat, minLng, maxLng })

    // Set center to the middle of all events
    setMapCenter({
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    })
  }, [events])

  // Convert lat/lng to pixel position within the map container
  const getMarkerPosition = (event: Event) => {
    if (mapBounds.minLat === mapBounds.maxLat || mapBounds.minLng === mapBounds.maxLng) {
      return { x: 50, y: 50 } // Center if only one event
    }

    const latRange = mapBounds.maxLat - mapBounds.minLat
    const lngRange = mapBounds.maxLng - mapBounds.minLng

    // Add padding to the bounds
    const padding = 0.15 // Increased padding for better spacing
    const paddedLatRange = latRange * (1 + padding * 2)
    const paddedLngRange = lngRange * (1 + padding * 2)

    const x = ((event.location.longitude - (mapBounds.minLng - lngRange * padding)) / paddedLngRange) * 100
    const y = ((mapBounds.maxLat + latRange * padding - event.location.latitude) / paddedLatRange) * 100

    return {
      x: Math.max(8, Math.min(92, x)), // Better edge constraints
      y: Math.max(8, Math.min(92, y)),
    }
  }

  const openInGoogleMaps = (event: Event) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${event.location.latitude},${event.location.longitude}`
    window.open(url, "_blank")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-500",
      music: "bg-purple-500",
      networking: "bg-green-500",
      art: "bg-pink-500",
      food: "bg-orange-500",
      default: "bg-gray-500",
    }
    return colors[category.toLowerCase() as keyof typeof colors] || colors.default
  }

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Events Map
          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
            {events.length} events
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          {/* Map Container */}
          <div
            className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 rounded-lg mx-4 mb-4 overflow-hidden border border-border shadow-inner"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)
              `,
            }}
          >
            {/* Grid overlay for map-like appearance */}
            <div
              className="absolute inset-0 opacity-10 dark:opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "24px 24px", // Slightly larger grid
              }}
            />

            {/* Event Markers */}
            {events.map((event) => {
              const position = getMarkerPosition(event)
              const isSelected = selectedEvent?.id === event.id
              const isHovered = hoveredEvent === event.id

              return (
                <div
                  key={event.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${isSelected ? "z-30 scale-125" : isHovered ? "z-20 scale-110" : "z-10 hover:scale-110"
                    }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  onClick={() => onEventSelect?.(event)}
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Marker */}
                  <div
                    className={`w-7 h-7 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${isSelected
                      ? `${getCategoryColor(event.category)} ring-2 ring-white ring-offset-2`
                      : isHovered
                        ? `${getCategoryColor(event.category)} shadow-xl`
                        : `${getCategoryColor(event.category)} hover:shadow-xl`
                      }`}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-popover border border-border rounded-lg shadow-xl text-xs whitespace-nowrap transition-all duration-200 max-w-xs ${isSelected || isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                      }`}
                  >
                    <div className="font-semibold text-popover-foreground mb-1">{event.eventname}</div>
                    <div className="text-muted-foreground text-xs">{event.location.address}</div>
                    <div className="text-muted-foreground text-xs mt-1">{formatDate(event.startTime)}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
                  </div>
                </div>
              )
            })}

            {/* No events message */}
            {events.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No events to display</p>
                  <p className="text-sm opacity-75">Events will appear here when available</p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <div className="mx-4 mb-4 p-4 bg-muted/50 rounded-lg border border-border backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-2 truncate">{selectedEvent.eventname}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{selectedEvent.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(selectedEvent.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{selectedEvent.dressCode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedEvent.category}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInGoogleMaps(selectedEvent)}
                    className="text-xs whitespace-nowrap"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Maps
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="mx-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm" />
                <span>Technology</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full border border-white shadow-sm" />
                <span>Music</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm" />
                <span>Networking</span>
              </div>
            </div>
            <div className="text-xs opacity-75">Click markers for details</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

