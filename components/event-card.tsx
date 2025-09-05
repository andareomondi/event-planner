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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden">
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image_url || "/placeholder.svg"}
            alt={event.eventname}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {event.category}
            </Badge>
          </div>
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
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-card-foreground">
            {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
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
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Dress code: </span>
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
