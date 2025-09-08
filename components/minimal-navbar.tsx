"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

export function MinimalNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
              >
                EventPicker
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${isActiveLink(link.href)
                        ? "text-foreground bg-muted border border-border shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <Link href="/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-sm hover:shadow-md transition-all duration-200">
                  Create Event
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:bg-muted"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Modern horizontal line */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-24 mx-auto"></div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-popover/95 backdrop-blur-sm border-b border-border shadow-lg sticky top-16 z-40">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Centered mobile links */}
            <div className="flex flex-col items-center space-y-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out w-fit ${isActiveLink(link.href)
                      ? "text-foreground bg-muted border border-border shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile CTA Footer */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-center">
                <Link href="/create" className="w-full max-w-xs">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 w-full shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

