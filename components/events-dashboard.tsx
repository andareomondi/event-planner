"use client"

import { useState } from "react"
import { EventsFilter } from "./events-filter"
import { EventsGrid } from "./events-grid"
import { EventsMap } from "./events-map"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Grid3X3, Plus } from "lucide-react"
import type { Event } from "@/app/api/events/route"
import Link from "next/link"

interface FilterState {
  location: string
  category: string
  startDate: string
  endDate: string
}

export function EventsDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    category: "",
    startDate: "",
    endDate: "",
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("grid")

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Clear selected event when filters change
    setSelectedEvent(null)
  }

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event)
    // Switch to map view when an event is selected from grid
    if (activeTab === "grid") {
      setActiveTab("map")
    }
  }

  // Update events list when EventsGrid fetches new data
  const handleEventsUpdate = (newEvents: Event[]) => {
    setEvents(newEvents)
    // Clear selected event if it's no longer in the filtered results
    if (selectedEvent && !newEvents.find((e) => e.id === selectedEvent.id)) {
      setSelectedEvent(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find and explore events happening around you</p>
        </div>
        <Link href="/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <EventsFilter onFiltersChange={handleFiltersChange} className="sticky top-6" />
        </div>

        {/* Events Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-fit grid-cols-2 bg-muted">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid View</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map View</span>
                </TabsTrigger>
              </TabsList>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {events.length > 0 && (
                  <span>
                    {events.length} event{events.length !== 1 ? "s" : ""} found
                  </span>
                )}
              </div>
            </div>

            <TabsContent value="grid" className="mt-0">
              <EventsGrid filters={filters} onEventSelect={handleEventSelect} onEventsUpdate={handleEventsUpdate} />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <EventsMap events={events} selectedEvent={selectedEvent} onEventSelect={setSelectedEvent} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
