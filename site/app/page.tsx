import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'
import LoginButton from './components/LoginButton'
import Features from './components/Features'
import { Session } from 'next-auth'

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Visual Accessibility Enhancement
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your browsing experience with our Chrome extension...
          </p>

          {!session ? (
            <div className="mt-8">
              <LoginButton />
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome, {session.user?.name}!
              </h2>
              <p className="mt-2 text-gray-600">
                Manage your accessibility preferences and settings here.
              </p>
            </div>
          )}
        </div>

        <Features />
      </div>
    </main>
  )
}
