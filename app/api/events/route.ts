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

const EVENTS_API_URL = "https://another-backend.onrender.com/api/events/"
const REQUEST_TIMEOUT = 10000 // 10 seconds

async function fetchEventsFromAPI(): Promise<Event[]> {
  console.log("Fetching events from external API:", EVENTS_API_URL)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(EVENTS_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "NextJS-Events-App/1.0",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      )
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      throw new Error(`Expected JSON response, got: ${contentType}`)
    }

    const rawData = await response.json()
    
    // Handle various possible response formats
    let events: Event[] = []
    if (Array.isArray(rawData)) {
      events = rawData
    } else if (rawData && typeof rawData === "object") {
      // Try common property names for event arrays
      const possibleArrays = [
        rawData.events_list,
        rawData.events,
        rawData.results,
        rawData.data,
      ]
      
      for (const arr of possibleArrays) {
        if (Array.isArray(arr)) {
          events = arr
          break
        }
      }
    }

    if (!Array.isArray(events)) {
      throw new Error("No valid events array found in API response")
    }

    console.log(`Successfully fetched ${events.length} events from external API`)
    
    return events as Event[]
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`)
    }
    
    throw error
  }
}

function filterEventsByLocation(events: Event[], location: string): Event[] {
  const locationLower = location.trim().toLowerCase()
  return events.filter((event) => {
    const address = event.location?.address?.toLowerCase() || ""
    return address.includes(locationLower)
  })
}

function filterEventsByCategory(events: Event[], category: string): Event[] {
  const categoryLower = category.trim().toLowerCase()
  return events.filter((event) => {
    const eventCategory = event.category?.toLowerCase() || ""
    return eventCategory === categoryLower
  })
}

function filterEventsByDateRange(
  events: Event[],
  startDate?: string,
  endDate?: string
): Event[] {
  let filtered = events

  if (startDate && startDate.trim()) {
    const startDateTime = new Date(startDate)
    if (!isNaN(startDateTime.getTime())) {
      filtered = filtered.filter((event) => {
        const eventStartTime = new Date(event.startTime)
        return !isNaN(eventStartTime.getTime()) && eventStartTime >= startDateTime
      })
    }
  }

  if (endDate && endDate.trim()) {
    const endDateTime = new Date(endDate)
    if (!isNaN(endDateTime.getTime())) {
      // Set end time to end of day
      endDateTime.setHours(23, 59, 59, 999)
      filtered = filtered.filter((event) => {
        const eventStartTime = new Date(event.startTime)
        return !isNaN(eventStartTime.getTime()) && eventStartTime <= endDateTime
      })
    }
  }

  return filtered
}

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || ""
    const category = searchParams.get("category") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""

    console.log("API request with filters:", { location, category, startDate, endDate })

    // Fetch all events from external API
    const allEvents = await fetchEventsFromAPI()
    
    let filteredEvents = [...allEvents]

    // Apply filters sequentially
    if (location && location.trim()) {
      filteredEvents = filterEventsByLocation(filteredEvents, location)
    }

    if (category && category.trim() && category.toLowerCase() !== "all") {
      filteredEvents = filterEventsByCategory(filteredEvents, category)
    }

    if (startDate || endDate) {
      filteredEvents = filterEventsByDateRange(filteredEvents, startDate, endDate)
    }

    const processingTime = Date.now() - startTime
    
    console.log(
      `Filtered ${allEvents.length} events to ${filteredEvents.length} in ${processingTime}ms`
    )

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      total_available: allEvents.length,
      filters_applied: {
        location: location || null,
        category: category || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },
      metadata: {
        source: "external_api",
        processing_time_ms: processingTime,
        api_url: EVENTS_API_URL,
      },
    })
  } catch (error) {
    const processingTime = Date.now() - startTime
    
    console.error("API route error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const isNetworkError = errorMessage.includes("timeout") || 
                          errorMessage.includes("fetch") || 
                          errorMessage.includes("ECONNREFUSED")

    return NextResponse.json(
      {
        error: "Failed to fetch events",
        message: errorMessage,
        events: [],
        total: 0,
        metadata: {
          source: "external_api",
          processing_time_ms: processingTime,
          api_url: EVENTS_API_URL,
          error_type: isNetworkError ? "network_error" : "api_error",
        },
      },
      { 
        status: isNetworkError ? 503 : 500,
        headers: {
          "Retry-After": "30", // Suggest retry after 30 seconds for network errors
        }
      }
    )
  }
}