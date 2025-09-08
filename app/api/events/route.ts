import { NextResponse } from "next/server"

export interface Event {
  id: string
  eventname: string
  description: string
  startTime: string
  endTime: string
  location: {
    address: string
    latitude: number
    longitude: number
  }
  dressCode: string
  category: string
  image_url: string
}

const EVENTS_API_URL = "http://127.0.0.1:8000/api/events/"

async function fetchEventsFromAPI(): Promise<Event[]> {
  console.log("Fetching from external API:", EVENTS_API_URL)
  const response = await fetch(EVENTS_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  })

  if (!response.ok) {
    throw new Error(`API response not ok: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Response is not JSON")
  }

  const rawdata = await response.json()

  let events: Event[] = []
  if (Array.isArray(rawdata)) {
    events = rawdata
  } else if (rawdata.events_list && Array.isArray(rawdata.events_list)) {
    events = rawdata.events_list
  } else if (rawdata.events && Array.isArray(rawdata.events)) {
    events = rawdata.events
  } else if (rawdata.results && Array.isArray(rawdata.results)) {
    events = rawdata.results
  } else {
    throw new Error("No valid events array found in API response")
  }

  console.log(`Successfully fetched ${events.length} events from external API`)
  return events as Event[]
}

export async function GET(request: Request) {
  try {
    const allEvents = await fetchEventsFromAPI()
    console.log(`Fetched ${allEvents.length} events from API`)

    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredEvents = [...allEvents]

    // Apply location filter
    if (location && location.trim()) {
      const locationLower = location.trim().toLowerCase()
      filteredEvents = filteredEvents.filter((event) => {
        const address = event.location?.address?.toLowerCase() || ""
        return address.includes(locationLower)
      })
    }

    // Apply category filter
    if (category && category.trim() && category.toLowerCase() !== "all") {
      const categoryLower = category.trim().toLowerCase()
      filteredEvents = filteredEvents.filter((event) => {
        const eventCategory = event.category?.toLowerCase() || ""
        return eventCategory === categoryLower
      })
    }

    // Apply date filters
    if (startDate && startDate.trim()) {
      const startDateTime = new Date(startDate)
      if (!isNaN(startDateTime.getTime())) {
        filteredEvents = filteredEvents.filter((event) => {
          const eventStartTime = new Date(event.startTime)
          return eventStartTime >= startDateTime
        })
      }
    }

    if (endDate && endDate.trim()) {
      const endDateTime = new Date(endDate)
      if (!isNaN(endDateTime.getTime())) {
        endDateTime.setHours(23, 59, 59, 999)
        filteredEvents = filteredEvents.filter((event) => {
          const eventStartTime = new Date(event.startTime)
          return eventStartTime <= endDateTime
        })
      }
    }

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      filters_applied: { location, category, startDate, endDate },
      source: "external_api",
    })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch events from external API",
        message: error instanceof Error ? error.message : "Unknown error",
        events: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

