import { MinimalNavbar } from "@/components/minimal-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Bell,
  BarChart3,
  Shield,
  Smartphone,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Calendar,
      title: "Event Creation & Management",
      description:
        "Create, edit, and manage events with our intuitive interface. Set locations, times, dress codes, and all event details.",
      features: ["Drag-and-drop event builder", "Real-time editing", "Bulk event management", "Custom event templates"],
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      icon: MapPin,
      title: "Location-Based Discovery",
      description: "Find events near you with our advanced location services and interactive mapping technology.",
      features: ["GPS-based search", "Interactive maps", "Location radius filtering", "Venue recommendations"],
      color: "bg-green-500/20 text-green-600",
    },
    {
      icon: Search,
      title: "Smart Event Search",
      description: "Discover events that match your interests with our intelligent search and filtering system.",
      features: ["Category filtering", "Date range search", "Keyword matching", "Personalized recommendations"],
      color: "bg-purple-500/20 text-purple-600",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with like-minded people and build lasting relationships through shared event experiences.",
      features: ["Attendee networking", "Event discussions", "Follow organizers", "Community groups"],
      color: "bg-orange-500/20 text-orange-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track event performance with detailed analytics and insights to improve your future events.",
      features: ["Attendance tracking", "Engagement metrics", "Revenue analytics", "Performance reports"],
      color: "bg-indigo-500/20 text-indigo-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated with intelligent notifications about events you care about and important updates.",
      features: ["Event reminders", "Last-minute changes", "New event alerts", "Custom notification settings"],
      color: "bg-pink-500/20 text-pink-600",
    },
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual event discovery",
      features: ["Browse unlimited events", "Basic location search", "Create up to 3 events/month", "Standard support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Ideal for active event organizers",
      features: [
        "Unlimited event creation",
        "Advanced analytics",
        "Priority support",
        "Custom event branding",
        "Bulk event management",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations and venues",
      features: [
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security features",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MinimalNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Our Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Everything You Need for Event Success
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            From discovery to management, EventPicker provides comprehensive tools and services to make your events
            memorable and successful.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Core Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose EventPicker?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Secure & Reliable</h3>
                      <p className="text-muted-foreground">Enterprise-grade security with 99.9% uptime guarantee.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Smartphone className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Mobile-First Design</h3>
                      <p className="text-muted-foreground">
                        Optimized for all devices with native mobile apps coming soon.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
                      <p className="text-muted-foreground">Round-the-clock customer support to help you succeed.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
                <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </div>
                <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-foreground mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`border-border bg-card relative ${plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-12 border border-border">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers and attendees who trust EventPicker for their event needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/create" className="flex items-center">
                Create Your First Event
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
