"use client"

import type React from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../config/authOptions"
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

