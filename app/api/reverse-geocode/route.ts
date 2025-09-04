import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  if (!lat || !lng) {
    return NextResponse.json({ success: false, error: "Latitude and longitude are required" })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "EventLocationPicker/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`)
    }

    const data = await response.json()

    let address = data.display_name || `${lat}, ${lng}`

    // Try to create a more readable address format
    if (data.address) {
      const parts = []
      if (data.address.house_number && data.address.road) {
        parts.push(`${data.address.house_number} ${data.address.road}`)
      } else if (data.address.road) {
        parts.push(data.address.road)
      }

      if (data.address.suburb || data.address.neighbourhood) {
        parts.push(data.address.suburb || data.address.neighbourhood)
      }

      if (data.address.city || data.address.town || data.address.village) {
        parts.push(data.address.city || data.address.town || data.address.village)
      }

      if (data.address.country) {
        parts.push(data.address.country)
      }

      if (parts.length > 0) {
        address = parts.join(", ")
      }
    }

    return NextResponse.json({ success: true, address })
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to reverse geocode location",
      address: `${lat}, ${lng}`,
    })
  }
}
