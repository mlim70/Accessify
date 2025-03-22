import React from 'react'
import { Session } from 'next-auth'
import LoginButton from '@/app/components/LoginButton'
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

interface HeroSectionProps {
  session: Session | null
}

const HeroSection: React.FC<HeroSectionProps> = ({ session }) => {
  return (
    <div className="relative isolate lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-40">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="text-lg text-gray-400 font-semibold">Designed for those who need it most</span>
            <br />
            Making the web accessible for people with disabilities.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Accessify is a powerful Chrome extension designed specifically for people with disabilities. With features like dyslexia-friendly fonts and color blindness support, we make the internet more accessible and inclusive for everyone.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!session ? (
              <LoginButton />
            ) : (
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome
              </Button>
            )}
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

