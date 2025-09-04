import { MinimalNavbar } from "@/components/minimal-navbar"
import { EventsDashboard } from "@/components/events-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MinimalNavbar />

      <main>
        <div className="container mx-auto px-4 py-8">
          <EventsDashboard />
        </div>
      </main>
    </div>
  )
}
