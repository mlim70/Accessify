"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../authOptions"
import LoginForm from "./login-form"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar session={session} />
      <LoginForm />
      <Footer />
    </main>
  )
}

