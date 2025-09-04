"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#" },
  { name: "Services", href: "#" },
  { name: "Contact", href: "#" },
]

export function MinimalNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-foreground">EventPicker</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ease-in-out"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-foreground">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Modern horizontal line */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-popover border-b border-border shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Centered mobile links */}
            <div className="flex flex-col items-center space-y-3">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-6 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ease-in-out w-fit"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile CTA Footer */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-center">
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 w-full max-w-xs"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
