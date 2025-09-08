"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import type { Event } from "@/app/api/events/route"
import Image from "next/image"

interface EventCardProps {
  event: Event
  onViewDetails?: (event: Event) => void
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  // Helper function to format date range
  const formatDateRange = () => {
    const startDate = new Date(event.startDate + 'T00:00:00')
    const endDate = new Date(event.endDate + 'T00:00:00')

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: startDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }

    const startFormatted = startDate.toLocaleDateString('en-US', options)
    const endFormatted = endDate.toLocaleDateString('en-US', options)

    // Same date
    if (event.startDate === event.endDate) {
      return startFormatted
    }

    // Same month and year
    if (startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    }

    // Different months/years
    return `${startFormatted} - ${endFormatted}`
  }

  // Helper function to format time range
  const formatTimeRange = () => {
    // Convert 24-hour format to 12-hour format
    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':')
      const hour12 = parseInt(hours) % 12 || 12
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
      return `${hour12}:${minutes} ${ampm}`
    }

    const formattedStartTime = formatTime(event.startTime)
    const formattedEndTime = formatTime(event.endTime)

    if (event.startDate === event.endDate) {
      // Same day - show time range
      return `${formattedStartTime} - ${formattedEndTime}`
    } else {
      // Multi-day event - show individual times
      return `${formattedStartTime} to ${formattedEndTime}`
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden">
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.eventname}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {event.eventname}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Date and Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-card-foreground font-medium">
              {formatDateRange()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm ml-6">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-card-foreground">
              {formatTimeRange()}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <div className="text-card-foreground font-medium">{event.location.address}</div>
          </div>
        </div>

        {/* Dress Code */}
        {event.dressCode && (
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4" /> {/* Spacer to align with other items */}
            <span className="text-muted-foreground">Dress code:</span>
            <Badge variant="outline" className="text-xs">
              {event.dressCode}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onViewDetails?.(event)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
