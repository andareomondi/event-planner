"use client"

import { useState, useEffect } from "react"
import { EventCard } from "./event-card"
import type { Event } from "@/app/api/events/route"
import { Loader2 } from "lucide-react"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("[v0] Fetching events with filters:", filters)
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (filters?.location) searchParams.set("location", filters.location)
        if (filters?.category) searchParams.set("category", filters.category)
        if (filters?.startDate) searchParams.set("startDate", filters.startDate)
        if (filters?.endDate) searchParams.set("endDate", filters.endDate)

        const response = await fetch(`/api/events?${searchParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        console.log("[v0] Fetched events:", data.events.length)
        setEvents(data.events)
        onEventsUpdate?.(data.events)
      } catch (err) {
        console.log("[v0] Error fetching events:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [filters]) // Removed onEventsUpdate from dependencies to prevent infinite loop

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-2">Error loading events</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No events found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters to see more events.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onViewDetails={onEventSelect} />
      ))}
    </div>
  )
}

