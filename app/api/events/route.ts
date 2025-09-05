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

// Function to fetch events from external API
async function fetchEventsFromAPI(): Promise<Event[]> {
  try {
    console.log('Fetching from:', EVENTS_API_URL)
    const response = await fetch(EVENTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Add timeout and other fetch options
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      console.error(`API response not ok: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
    }

    const rawdata = await response.json()
    console.log('Raw API response:', rawdata)

    // Handle different possible response structures
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
      console.warn('Unexpected API response structure:', rawdata)
      return []
    }

    console.log(`Successfully fetched ${events.length} events`)
    return events as Event[]
  } catch (error) {
    console.error('Error fetching events from API:', error)
    // Return empty array on error instead of dummy data
    return []
  }
}

export async function GET(request: Request) {
  try {
    console.log('API route called with URL:', request.url)

    // Fetch events from external API first
    const apiEvents = await fetchEventsFromAPI()
    console.log(`Fetched ${apiEvents.length} events from API`)

    const { searchParams } = new URL(request.url)

    // Extract and log filter parameters
    const location = searchParams.get("location")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    console.log('Applied filters:', { location, category, startDate, endDate })

    // Start with all events
    let filteredEvents = [...apiEvents]

    // Apply location filter
    if (location && location.trim()) {
      const locationLower = location.trim().toLowerCase()
      filteredEvents = filteredEvents.filter((event) => {
        const address = event.location?.address?.toLowerCase() || ''
        return address.includes(locationLower)
      })
      console.log(`After location filter: ${filteredEvents.length} events`)
    }

    // Apply category filter
    if (category && category.trim() && category.toLowerCase() !== 'all') {
      const categoryLower = category.trim().toLowerCase()
      filteredEvents = filteredEvents.filter((event) => {
        const eventCategory = event.category?.toLowerCase() || ''
        return eventCategory === categoryLower
      })
      console.log(`After category filter: ${filteredEvents.length} events`)
    }

    // Apply start date filter
    if (startDate && startDate.trim()) {
      const startDateTime = new Date(startDate)
      if (!isNaN(startDateTime.getTime())) {
        filteredEvents = filteredEvents.filter((event) => {
          const eventStartTime = new Date(event.startTime)
          return eventStartTime >= startDateTime
        })
        console.log(`After start date filter: ${filteredEvents.length} events`)
      }
    }

    // Apply end date filter
    if (endDate && endDate.trim()) {
      const endDateTime = new Date(endDate)
      if (!isNaN(endDateTime.getTime())) {
        // Set end of day for end date
        endDateTime.setHours(23, 59, 59, 999)
        filteredEvents = filteredEvents.filter((event) => {
          const eventStartTime = new Date(event.startTime)
          return eventStartTime <= endDateTime
        })
        console.log(`After end date filter: ${filteredEvents.length} events`)
      }
    }

    console.log(`Final filtered events count: ${filteredEvents.length}`)

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      filters_applied: { location, category, startDate, endDate },
      source: 'django_api'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error',
        events: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
