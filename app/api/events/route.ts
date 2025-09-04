import { NextResponse } from "next/server"

export interface Event {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  dressCode: string
  category: string
  imageUrl: string
  organizer: string
}

// Dummy events data for preview
const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations in AI and web development.",
    startTime: "2024-03-15T09:00:00Z",
    endTime: "2024-03-15T17:00:00Z",
    location: {
      name: "Convention Center",
      address: "123 Tech Street, San Francisco, CA",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    dressCode: "Business Casual",
    category: "Technology",
    imageUrl: "tech-conference.png",
    organizer: "TechWorld Inc.",
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Three-day outdoor music festival featuring local and international artists.",
    startTime: "2024-06-20T14:00:00Z",
    endTime: "2024-06-22T23:00:00Z",
    location: {
      name: "Golden Gate Park",
      address: "Golden Gate Park, San Francisco, CA",
      latitude: 37.7694,
      longitude: -122.4862,
    },
    dressCode: "Casual",
    category: "Music",
    imageUrl: "/vibrant-music-festival.png",
    organizer: "LiveNation",
  },
  {
    id: "3",
    title: "Startup Networking Mixer",
    description: "Connect with entrepreneurs, investors, and innovators in the startup ecosystem.",
    startTime: "2024-04-10T18:00:00Z",
    endTime: "2024-04-10T21:00:00Z",
    location: {
      name: "Innovation Hub",
      address: "456 Startup Ave, Palo Alto, CA",
      latitude: 37.4419,
      longitude: -122.143,
    },
    dressCode: "Smart Casual",
    category: "Business",

    imageUrl: "/networking-event.png",
    organizer: "Startup Connect",
  },
  {
    id: "4",
    title: "Art Gallery Opening",
    description: "Exclusive opening of contemporary art exhibition featuring emerging artists.",
    startTime: "2024-05-05T19:00:00Z",
    endTime: "2024-05-05T22:00:00Z",
    location: {
      name: "Modern Art Gallery",
      address: "789 Art District, Los Angeles, CA",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    dressCode: "Cocktail Attire",
    category: "Arts",
    imageUrl: "/vibrant-art-gallery.png",
    organizer: "ArtWorld",
  },
  {
    id: "5",
    title: "Food & Wine Tasting",
    description: "Curated selection of local wines paired with artisanal food from top chefs.",
    startTime: "2024-07-12T17:30:00Z",
    endTime: "2024-07-12T21:30:00Z",
    location: {
      name: "Vineyard Estate",
      address: "321 Wine Country Rd, Napa, CA",
      latitude: 38.2975,
      longitude: -122.2869,
    },
    dressCode: "Elegant Casual",
    category: "Food & Drink",
    imageUrl: "/wine-tasting.png",
    organizer: "Gourmet Events",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Extract filter parameters
  const location = searchParams.get("location")
  const category = searchParams.get("category")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  let filteredEvents = [...dummyEvents]

  // Apply filters
  if (location) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.location.name.toLowerCase().includes(location.toLowerCase()) ||
        event.location.address.toLowerCase().includes(location.toLowerCase()),
    )
  }

  if (category) {
    filteredEvents = filteredEvents.filter((event) => event.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filteredEvents = filteredEvents.filter((event) => new Date(event.startTime) >= new Date(startDate))
  }

  if (endDate) {
    filteredEvents = filteredEvents.filter((event) => new Date(event.endTime) <= new Date(endDate))
  }

  return NextResponse.json({
    events: filteredEvents,
    total: filteredEvents.length,
  })
}
