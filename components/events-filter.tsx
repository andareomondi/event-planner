"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Tag, X, Filter } from "lucide-react"

interface FilterState {
  location: string
  category: string
  startDate: string
  endDate: string
}

interface EventsFilterProps {
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const categories = [
  "Technology",
  "Music",
  "Business",
  "Arts",
  "Food & Drink",
  "Sports",
  "Education",
  "Health & Wellness",
]

export function EventsFilter({ onFiltersChange, className }: EventsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    category: "",
    startDate: "",
    endDate: "",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (key: keyof FilterState) => {
    updateFilter(key, "")
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      location: "",
      category: "",
      startDate: "",
      endDate: "",
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().split("T")[0]
  }

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
              {isExpanded ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${!isExpanded ? "hidden md:block" : ""}`}>
        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Location
          </Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="Search by city, venue, or address..."
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            {filters.location && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("location")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            Category
          </Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Date Range
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formatDateForInput(filters.startDate)}
                onChange={(e) => updateFilter("startDate", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formatDateForInput(filters.endDate)}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t border-border">
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.location && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Location: {filters.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("location")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {filters.category}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("category")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.startDate && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  From: {new Date(filters.startDate).toLocaleDateString()}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("startDate")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.endDate && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  To: {new Date(filters.endDate).toLocaleDateString()}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("endDate")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
