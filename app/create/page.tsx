import { MinimalNavbar } from "@/components/minimal-navbar"
import { EventCreationForm } from "@/components/event-creation-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MinimalNavbar />

      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Create New Event</h1>
              <p className="text-muted-foreground text-lg">
                Plan your event with precise location selection and detailed information
              </p>
            </div>
            <EventCreationForm />
          </div>
        </div>
      </main>
    </div>
  )
}

