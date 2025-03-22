import React from 'react'
import { Session } from 'next-auth'
import LoginButton from '@/app/components/LoginButton'

interface HeroSectionProps {
  session: Session | null
}

const HeroSection: React.FC<HeroSectionProps> = ({ session }) => {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Make the web accessible for everyone
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Accessify is a powerful Chrome extension that enhances web accessibility for people with various needs.
            From dyslexic-friendly fonts to color blindness support, we make the internet more inclusive.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!session ? (
              <LoginButton />
            ) : (
              <a
                href="#features"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Explore Features
              </a>
            )}
            <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

