"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPlacePicker } from "@/components/location-place-picker"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"

interface EventData {
  name: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  dressCode: string
  image: string
  location: {
    address: string
    latitude: number
    longitude: number
  } | null
}

export function EventCreationForm() {
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    dressCode: "",
    image: "",
    location: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleLocationSelect = (location: { address: string; latitude: number; longitude: number }) => {
    setEventData((prev) => ({ ...prev, location }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget);
    const eventName = formData.get("eventName") as string;
    const dressCode = formData.get("dressCode") as string;
    const imageFile = formData.get("image") as File;
    const description = formData.get("description") as string;
    const startDate = formData.get("StartDate") as string;
    const startTime = formData.get("StartTime") as string;
    const endDate = formData.get("EndDate") as string;
    const endTime = formData.get("EndTime") as string;
    // Getting the location
    const location = eventData.location;

    if (!eventName || !startDate || !startTime || !location || !imageFile) {
      alert("Please fill in all required fields.")
      return
    }
    setIsSubmitting(true)
    const eventPayload = {
      name: eventName,
      dressCode,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      image: eventData.image,
    }
    // Using a try catch block to handle potential errors
    try {
      const response = await fetch("http://127.0.0.1:8000/api/events/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      })

      if (response.ok) {
        alert("Event created successfully!")
        // Reset form
        setEventData({
          name: "",
          description: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          dressCode: "",
          image: "",
          location: null,
        })
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message || "Failed to create event."}`)
      }
    }
    catch (error) {
      console.error("Error submitting form:", error)
      alert("An unexpected error occurred. Please try again.")
    }
    setIsSubmitting(false)
  }

  const isFormValid = eventData.name && eventData.startDate && eventData.startTime && eventData.location

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                placeholder="Enter event name"
                value={eventData.name}
                onChange={(e) => setEventData((prev) => ({ ...prev, name: e.target.value }))}
                required
                name="eventName"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dressCode">Dress Code</Label>
              <Select
                value={eventData.dressCode}
                name="dressCode"
                onValueChange={(value) => setEventData((prev) => ({ ...prev, dressCode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dress code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="business-casual">Business Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="black-tie">Black Tie</SelectItem>
                  <SelectItem value="cocktail">Cocktail</SelectItem>
                  <SelectItem value="themed">Themed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Image upload */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Event Image </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                name="image"
                placeholder="Upload event image"
                className="file:bg-primary file:text-primary-foreground file:px-4  file:rounded-full "
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setEventData((prev) => ({ ...prev, image: reader.result as string }))
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event..."
              value={eventData.description}
              onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
              name="description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date and Time Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={eventData.startDate}
                onChange={(e) => setEventData((prev) => ({ ...prev, startDate: e.target.value }))}
                name="StartDate"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={eventData.startTime}
                name="StartTime"
                onChange={(e) => setEventData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={eventData.endDate}
                name="EndDate"
                onChange={(e) => setEventData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                name="EndTime"
                value={eventData.endTime}
                onChange={(e) => setEventData((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            Event Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationPlacePicker onLocationSelect={handleLocationSelect} />
          {eventData.location && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected Location:</p>
              <p className="text-sm text-muted-foreground">{eventData.location.address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {eventData.location.latitude.toFixed(6)}, {eventData.location.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!isFormValid || isSubmitting} className="min-w-[150px]">
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
