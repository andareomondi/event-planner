import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" })
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.status}`)
    }

    const data = await response.json()

    const results = []

    if (data.local_results) {
      for (const result of data.local_results.slice(0, 5)) {
        if (result.gps_coordinates) {
          results.push({
            title: result.title || result.name || "Unknown Location",
            address: result.address || `${result.gps_coordinates.latitude}, ${result.gps_coordinates.longitude}`,
            latitude: result.gps_coordinates.latitude,
            longitude: result.gps_coordinates.longitude,
          })
        }
      }
    }

    if (data.place_results && data.place_results.gps_coordinates) {
      results.unshift({
        title: data.place_results.title || "Primary Result",
        address:
          data.place_results.address ||
          `${data.place_results.gps_coordinates.latitude}, ${data.place_results.gps_coordinates.longitude}`,
        latitude: data.place_results.gps_coordinates.latitude,
        longitude: data.place_results.gps_coordinates.longitude,
      })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Location search error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to search locations",
    })
  }
}
