"use client"

import React from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import LoginButton from '@/components/features/auth/LoginButton'
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from 'next-auth/react'

interface NavbarProps {
  session?: Session | null
}

const Navbar: React.FC<NavbarProps> = () => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = {
        features: document.getElementById('features'),
        howItWorks: document.getElementById('how-it-works'),
      }

      const scrollPosition = window.scrollY + 100

      if (scrollPosition < (sections.features?.offsetTop || 0)) {
        setActiveSection("")
      } else if (scrollPosition < (sections.howItWorks?.offsetTop || 0)) {
        setActiveSection("features")
      } else {
        setActiveSection("how-it-works")
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLinkActive = (href: string) => {
    if (href === "/") return activeSection === ""
    if (href === "/#features") return activeSection === "features"
    if (href === "/#how-it-works") return activeSection === "how-it-works"
    return false
  }

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 4) {
      return email
    }
    return `${localPart.slice(0, 2)}...${localPart.slice(-2)}@${domain}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/100">
      <div className="container relative flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/accessify-logo.png" alt="Accessify" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-semibold transition-colors hover:text-[#FF9900] hover:scale-105 transform",
                  isLinkActive(link.href) ? "text-[#FF9900]" : "text-black",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-black text-base font-medium">{formatEmail(session.user?.email || '')}</span>
              <LoginButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden ml-auto text-black" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 ">
          <div className="container py-6 flex flex-col gap-6 bg-white">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xl font-semibold transition-colors hover:text-[#FF9900] hover:translate-x-2 transform",
                    isLinkActive(link.href) ? "text-[#FF9900]" : "text-black",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-4">
              {session && (
                <span className="text-black text-base font-medium">Logged in as: {formatEmail(session.user?.email || '')}</span>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

