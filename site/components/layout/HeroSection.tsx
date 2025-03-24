"use client"

import React from 'react'
import LoginButton from '@/components/features/auth/LoginButton'
import { Button } from "@/components/ui/Button"
import { Chrome } from "lucide-react"
import { signOut, useSession } from 'next-auth/react'

const HeroSection: React.FC = () => {
  const { data: session } = useSession()

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary pb-10">
      <div className="mx-auto max-w-2xl px-8 pb-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="text-[#FF9900] text-lg font-semibold">Designed for those who need it most</span>
            <br />
            Making the web accessible for people with disabilities.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Accessify is a powerful Chrome extension designed specifically for people with disabilities. With features like dyslexia-friendly fonts and color blindness support, we make the internet more accessible and inclusive for everyone.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900]/10">
                <Chrome className="mr-2 h-5 w-5" />
                Add to Chrome
              </Button>
            </a>
            {session ? (
              <div className="text-gray-300 text-sm">
                You are logged in as {session.user?.email}.{" "}
                <button 
                  onClick={() => signOut()} 
                  className="text-[#FF9900] hover:underline"
                >
                  Click here to sign out
                </button>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

