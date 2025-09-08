"use client"

import { useState, useCallback, useEffect } from "react"
import { EventCard } from "./event-card"
import type { Event } from "@/app/api/events/route"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventsCache } from "@/lib/events-cache"

interface EventsGridProps {
  filters?: {
    location?: string
    category?: string
    startDate?: string
    endDate?: string
  }
  onEventSelect?: (event: Event) => void
  onEventsUpdate?: (events: Event[]) => void
}

export function EventsGrid({ filters, onEventSelect, onEventsUpdate }: EventsGridProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true) // Changed to true - start with loading
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false) // Track if data has been loaded at least once

  const fetchEvents = useCallback(
    async (useCache = true) => {
      console.log("[EventsGrid] Fetching events with filters:", filters)

      if (useCache) {
        const cachedEvents = EventsCache.get(filters || {})
        if (cachedEvents) {
          console.log("[EventsGrid] Using cached events:", cachedEvents.length)
          setEvents(cachedEvents)
          setHasLoaded(true)
          setLoading(false)
          if (onEventsUpdate) {
            onEventsUpdate(cachedEvents)
          }
          return
        }
      }

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()

        // Only add non-empty filter values to avoid long URLs
        if (filters?.location && filters.location.trim()) {
          searchParams.set("location", filters.location.trim())
        }
        if (filters?.category && filters.category.trim() && filters.category !== "all") {
          searchParams.set("category", filters.category.trim())
        }
        if (filters?.startDate && filters.startDate.trim()) {
          searchParams.set("startDate", filters.startDate.trim())
        }
        if (filters?.endDate && filters.endDate.trim()) {
          searchParams.set("endDate", filters.endDate.trim())
        }

        const queryString = searchParams.toString()
        const url = queryString ? `/api/events?${queryString}` : "/api/events"

        console.log("[EventsGrid] Fetching from URL:", url)
        console.log("[EventsGrid] URL length:", url.length)

        // Check if URL is too long (most servers have a 2048 character limit)
        if (url.length > 2000) {
          console.warn("[EventsGrid] URL might be too long:", url.length)
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Add timeout
          signal: AbortSignal.timeout(15000), // 15 second timeout
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[EventsGrid] Response not ok:", response.status, response.statusText, errorText)
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[EventsGrid] Response data:", data)

        // Validate the response structure
        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format")
        }

        const fetchedEvents = Array.isArray(data.events) ? data.events : []
        console.log("[EventsGrid] Fetched events count:", fetchedEvents.length)

        EventsCache.set(fetchedEvents, filters || {})

        setEvents(fetchedEvents)
        setHasLoaded(true)

        // Call onEventsUpdate if provided
        if (onEventsUpdate) {
          onEventsUpdate(fetchedEvents)
        }
      } catch (err) {
        console.error("[EventsGrid] Error fetching events:", err)
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching events"
        setError(errorMessage)

        // Set empty array on error
        setEvents([])
        if (onEventsUpdate) {
          onEventsUpdate([])
        }
      } finally {
        setLoading(false)
      }
    },
    [filters, onEventsUpdate],
  )

  useEffect(() => {
    fetchEvents(true) // Use cache on initial load and filter changes
  }, [fetchEvents])

  const handleRefresh = () => {
    fetchEvents(false)
  }

  const isInitialLoad = !hasLoaded && !loading && events.length === 0
  // Show initial loading state when component first mounts
  if (isInitialLoad && loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading events...</span>
      </div>
    )
  }

  // This state should rarely be shown now since we auto-load on mount
  if (!hasLoaded && !loading) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Ready to Load Events</h3>
          <p className="text-muted-foreground">Click the button below to fetch events with your current filters</p>
        </div>
        <Button onClick={handleRefresh} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <RefreshCw className="h-4 w-4 mr-2" />
          Load Events
        </Button>
      </div>
    )
  }

  if (loading && !hasLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="space-y-2">
          <p className="text-destructive mb-2">Error loading events</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (events.length === 0 && hasLoaded) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="space-y-2">
          <p className="text-muted-foreground mb-2">No events found</p>
          <p className="text-sm text-muted-foreground">
            {Object.values(filters || {}).some(Boolean)
              ? "Try adjusting your filters or refresh to see more events."
              : "No events are currently available."}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Events
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Refresh button at the top */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {events.length} event{events.length !== 1 ? "s" : ""}
          {Object.values(filters || {}).some(Boolean) && " (filtered)"}
          {!EventsCache.isExpired() && <span className="text-green-600 ml-2">(cached)</span>}
        </p>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onViewDetails={onEventSelect} />
        ))}
      </div>
    </div>
  )
}

