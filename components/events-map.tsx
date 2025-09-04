"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, Calendar, Users } from "lucide-react"
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
    const padding = 0.1
    const paddedLatRange = latRange * (1 + padding * 2)
    const paddedLngRange = lngRange * (1 + padding * 2)

    const x = ((event.location.longitude - (mapBounds.minLng - lngRange * padding)) / paddedLngRange) * 100
    const y = ((mapBounds.maxLat + latRange * padding - event.location.latitude) / paddedLatRange) * 100

    return {
      x: Math.max(5, Math.min(95, x)), // Keep within 5-95% to avoid edge clipping
      y: Math.max(5, Math.min(95, y)),
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
            className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 rounded-lg mx-4 mb-4 overflow-hidden border border-border"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
              `,
            }}
          >
            {/* Grid overlay for map-like appearance */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Event Markers */}
            {events.map((event) => {
              const position = getMarkerPosition(event)
              const isSelected = selectedEvent?.id === event.id

              return (
                <div
                  key={event.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  onClick={() => onEventSelect?.(event)}
                >
                  {/* Marker */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-primary border-primary-foreground"
                        : "bg-secondary hover:bg-primary transition-colors"
                    }`}
                  >
                    <MapPin className="h-3 w-3 text-white" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded shadow-lg text-xs whitespace-nowrap transition-opacity duration-200 ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="font-medium text-popover-foreground">{event.title}</div>
                    <div className="text-muted-foreground">{event.location.name}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-border" />
                  </div>
                </div>
              )
            })}

            {/* No events message */}
            {events.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No events to display on map</p>
                  <p className="text-sm">Events will appear here when available</p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <div className="mx-4 mb-4 p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{selectedEvent.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedEvent.location.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(selectedEvent.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{selectedEvent.attendees} attending</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedEvent.category}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInGoogleMaps(selectedEvent)}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View in Maps
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="mx-4 mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-secondary rounded-full border border-white" />
                <span>Event Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full border border-white" />
                <span>Selected Event</span>
              </div>
            </div>
            <div className="text-xs">Click markers to view event details</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
