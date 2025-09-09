"use client"

import { useState, useCallback, useEffect } from "react"
import { EventCard } from "./event-card"
import type { Event } from "@/app/api/events/route"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)

  const fetchEvents = useCallback(async () => {
    console.log("[EventsGrid] Fetching events with filters:", filters)
    
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

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

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[EventsGrid] Response data:", data)

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from API")
      }

      const fetchedEvents = Array.isArray(data.events) ? data.events : []
      console.log("[EventsGrid] Successfully fetched", fetchedEvents.length, "events")

      setEvents(fetchedEvents)
      setError(null)
      setHasInitialLoad(true)

      if (onEventsUpdate) {
        onEventsUpdate(fetchedEvents)
      }
    } catch (err) {
      console.error("[EventsGrid] Error fetching events:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to events API"
      
      setError(errorMessage)
      setEvents([])

      if (onEventsUpdate) {
        onEventsUpdate([])
      }
    } finally {
      setLoading(false)
    }
  }, [filters, onEventsUpdate])

  // Auto-fetch on component mount and filter changes
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleRefresh = () => {
    console.log("[EventsGrid] Manual refresh triggered")
    fetchEvents()
  }

  // Loading state (initial load or refresh)
  if (loading && !hasInitialLoad) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading events...</span>
      </div>
    )
  }

  // Error state
  if (error && !hasInitialLoad) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Unable to load events</p>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure the API at https://another-backend.onrender.com/api/events/ is running
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="lg" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    )
  }

  // No events state
  if (events.length === 0 && hasInitialLoad && !loading) {
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
        <Button onClick={handleRefresh} variant="outline" size="lg" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh Events"}
        </Button>
      </div>
    )
  }

  // Success state - show events
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Showing {events.length} events
          </p>
          {error && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Warning: {error}
            </p>
          )}
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onViewDetails={onEventSelect} />
        ))}
      </div>
    </div>
  )
}