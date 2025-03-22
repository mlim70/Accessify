"use client"

import React from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import LoginButton from '@/app/components/LoginButton'
import { Button } from "@/components/ui/button"
import { Chrome, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavbarProps {
  session?: Session | null
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/docs", label: "Documentation" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/accessify-logo.png" alt="Accessify" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session.user?.name}</span>
              <LoginButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background">
          <div className="container py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{session.user?.name}</span>
                  <LoginButton />
                </div>
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

