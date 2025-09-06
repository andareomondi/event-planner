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
import { CalendarIcon, ClockIcon, MapPinIcon, ImageIcon, X } from "lucide-react"

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleLocationSelect = (location: { address: string; latitude: number; longitude: number }) => {
    setEventData((prev) => ({ ...prev, location }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Image file selected:", file.name, "Size:", file.size, "Type:", file.type)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert("Image size should be less than 5MB")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setEventData((prev) => ({ ...prev, image: result }))
        console.log("Image preview created, length:", result.length)
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error)
        alert("Error reading image file")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview("")
    setEventData((prev) => ({ ...prev, image: "" }))

    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const eventName = formData.get("eventName") as string
    const dressCode = formData.get("dressCode") as string
    const description = formData.get("description") as string
    const startDate = formData.get("StartDate") as string
    const startTime = formData.get("StartTime") as string
    const endDate = formData.get("EndDate") as string
    const endTime = formData.get("EndTime") as string

    // Getting the location
    const location = eventData.location

    console.log("Form submission started")
    console.log("Event name:", eventName)
    console.log("Image file:", imageFile?.name, imageFile?.size)
    console.log("Image preview length:", imagePreview.length)

    if (!eventName || !startDate || !startTime || !location) {
      alert("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)

    try {
      let imageBase64 = null

      // Use the imageFile if available, otherwise use the preview
      if (imageFile) {
        console.log("Converting image file to base64...")
        imageBase64 = await fileToBase64(imageFile)
        console.log("Image converted to base64, length:", imageBase64?.length)
      } else if (imagePreview) {
        console.log("Using image preview as base64")
        imageBase64 = imagePreview
      }

      const eventPayload = {
        name: eventName,
        dressCode: dressCode || "",
        description: description || "",
        startDate,
        startTime,
        endDate: endDate || "",
        endTime: endTime || "",
        location,
        image: imageBase64,
      }

      console.log("Payload prepared:")
      console.log("- Name:", eventPayload.name)
      console.log("- Location:", eventPayload.location?.address)
      console.log("- Image included:", !!eventPayload.image)
      console.log("- Image size:", eventPayload.image?.length || 0)

      const response = await fetch("http://127.0.0.1:8000/api/events/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log("Success response:", responseData)
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
        setImageFile(null)
        setImagePreview("")

        // Reset form inputs
        e.currentTarget.reset()
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        alert(`Error: ${errorData.message || errorData.error || "Failed to create event."}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        console.log("File to base64 conversion complete, length:", result.length)
        resolve(result)
      }
      reader.onerror = (error) => {
        console.error("File to base64 conversion failed:", error)
        reject(error)
      }
    })
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
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Event Image
            </Label>

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleImageRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {imageFile?.name} ({Math.round((imageFile?.size || 0) / 1024)} KB)
                </p>
              </div>
            ) : (
              <Input
                id="image"
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                className="file:bg-primary file:text-primary-foreground file:px-4 file:rounded-full"
              />
            )}
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

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p>Form Valid: {isFormValid ? 'Yes' : 'No'}</p>
            <p>Image File: {imageFile?.name || 'None'}</p>
            <p>Image Size: {imageFile?.size || 0} bytes</p>
            <p>Preview Length: {imagePreview.length} chars</p>
            <p>Location: {eventData.location?.address || 'None'}</p>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
