import { NextResponse } from "next/server"

// Read data from an api endpoint
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
    const response = await fetch(EVENTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data);
    return data as Event[]

  } catch (error) {
    console.error('Error fetching events from API:', error)
    // Return empty array on error instead of dummy data
    return []
  }
}

export async function GET(request: Request) {
  try {
    // Fetch events from external API
    const apiEvents = await fetchEventsFromAPI()

    const { searchParams } = new URL(request.url)

    // Extract filter parameters
    const location = searchParams.get("location")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredEvents = [...apiEvents]

    // Apply filters
    if (location) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.location?.address?.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (category) {
      filteredEvents = filteredEvents.filter(
        (event) => event.category?.toLowerCase() === category.toLowerCase()
      )
    }

    if (startDate) {
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.startTime) >= new Date(startDate)
      )
    }

    if (endDate) {
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.endTime) <= new Date(endDate)
      )
    }

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch events',
        events: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
