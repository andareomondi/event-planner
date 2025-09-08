interface CachedEvents {
  events: any[]
  timestamp: number
  filters: Record<string, string>
}

const CACHE_KEY = "events_cache"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export class EventsCache {
  static set(events: any[], filters: Record<string, string> = {}) {
    if (typeof window === "undefined") return

    const cacheData: CachedEvents = {
      events,
      timestamp: Date.now(),
      filters,
    }

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Failed to cache events:", error)
    }
  }

  static get(filters: Record<string, string> = {}): any[] | null {
    if (typeof window === "undefined") return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cacheData: CachedEvents = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is expired
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      // Check if filters match (for simple cases)
      const filtersMatch = Object.keys(filters).every((key) => filters[key] === cacheData.filters[key])

      if (filtersMatch) {
        return cacheData.events
      }

      return null
    } catch (error) {
      console.warn("Failed to retrieve cached events:", error)
      return null
    }
  }

  static clear() {
    if (typeof window === "undefined") return
    localStorage.removeItem(CACHE_KEY)
  }

  static isExpired(): boolean {
    if (typeof window === "undefined") return true

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return true

      const cacheData: CachedEvents = JSON.parse(cached)
      const now = Date.now()

      return now - cacheData.timestamp > CACHE_DURATION
    } catch {
      return true
    }
  }
}
