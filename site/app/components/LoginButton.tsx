'use client';

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function LoginButton() {
  
  const { data: session } = useSession()

  if (session) {
    return (
      <Button
        variant="outline"
        onClick={() => signOut()}
        className="text-gray-700 hover:text-gray-900"
      >
        Sign Out
      </Button>
    )
  }

  return (
    <Button
      onClick={() => signIn('google')}
      className="bg-primary hover:bg-primary/90"
    >
      Sign in with Google
    </Button>
  )
} 