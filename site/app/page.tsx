"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import {
  ChevronRight,
  Chrome,
  Headphones,
  Languages,
  Palette,
  Type,
} from "lucide-react"
import FeatureCard from "@/components/features/FeatureCard"
import HeroSection from "@/components/layout/HeroSection"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const features = [
    {
      title: "Dyslexic Font",
      description: "Makes text easier to read for people with dyslexia by using specialized fonts.",
      icon: <Type className="h-8 w-8 text-primary" />,
      tabValue: "dyslexic"
    },
    {
      title: "Color Blindness",
      description: "Adjusts colors on websites to be more visible for people with different types of color blindness.",
      icon: <Palette className="h-8 w-8 text-primary" />,
      tabValue: "colorblind"
    },
    {
      title: "Translation",
      description: "Translates web content into the user's preferred language.",
      icon: <Languages className="h-8 w-8 text-primary" />,
      tabValue: "translate"
    },
    {
      title: "Text to Speech",
      description: "Reads website content aloud for users with visual impairments or reading difficulties.",
      icon: <Headphones className="h-8 w-8 text-primary" />,
      tabValue: "tts"
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />

      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Accessibility Features</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dyslexic">Dyslexic Font</TabsTrigger>
              <TabsTrigger value="colorblind">Color Blindness</TabsTrigger>
              <TabsTrigger value="translate">Translator</TabsTrigger>
              <TabsTrigger value="tts">Text to Speech</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveTab(feature.tabValue)}
                    className="cursor-pointer h-full"
                  >
                    <FeatureCard
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dyslexic" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Type className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Dyslexic Font</h3>
                </div>
                <p className="mb-4">
                  Our dyslexic font feature transforms text on any webpage to be more readable for people with dyslexia.
                  The specialized font reduces reading errors by creating more distinction between letters.
                </p>
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Standard Font</h4>
                    <p className="font-serif">
                      This is how text normally appears on websites. Many people with dyslexia find this difficult to
                      read because letters can appear to jump or flip.
                    </p>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Dyslexic-Friendly Font</h4>
                    <p className="font-mono">
                      This is how text appears with our dyslexic font enabled. Notice the increased spacing and
                      distinctive letter shapes that prevent confusion.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Click the Accessify icon in your Chrome toolbar</li>
                    <li>Select &quot;Dyslexic Font&quot; from the menu</li>
                    <li>Adjust the font size and spacing as needed</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colorblind" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Palette className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Color Blindness Support</h3>
                </div>
                <p className="mb-4">
                  Our color blindness filters adjust website colors to be more distinguishable for people with various
                  types of color vision deficiency, including protanopia, deuteranopia, and tritanopia.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Click the Accessify icon in your Chrome toolbar</li>
                    <li>Go to &quot;Color Filters&quot; from the menu</li>
                    <li>Choose your specific type of color blindness (Protanopia, Deuteranopia, or Tritanopia)</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="translate" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Languages className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Translation Support</h3>
                </div>
                <p className="mb-4">
                  Our translation feature instantly translates web content into your preferred language, making the web
                  more accessible to users worldwide. It supports over 100 languages and preserves the original layout
                  while providing accurate translations.
                </p>
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Original Content</h4>
                    <p>
                      The original webpage content in its native language. Users who don&apos;t speak this language may
                      find it difficult to understand.
                    </p>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Translated Content</h4>
                    <p>
                      The same content translated into your preferred language, maintaining the original formatting
                      and layout while making it accessible to you.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Click the Accessify icon in your Chrome toolbar</li>
                    <li>Scroll down to  &quot;Language&quot; from the menu</li>
                    <li>Choose or search foryour preferred language</li>
                    <li>The page will automatically translate while maintaining its layout with a progress bar on top of the page to see how much is left</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tts" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Headphones className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Text to Speech</h3>
                </div>
                <p className="mb-4">
                  Our text-to-speech feature reads webpage content aloud, making it easier for users with visual
                  impairments or reading difficulties to access web content, supporting multiple voices and languages.
                </p>
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  <div className="flex-1 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="list-disc ml-5 space-y-2">
                      <li>Natural-sounding voices in multiple languages</li>
                      <li>Smooth progress bar to see how much is left</li>
                      <li>Highlight text as it&apos;s being read</li>
                    </ul>
                  </div>
                  <div className="flex-1 p-4 border rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Use Cases</h4>
                    <ul className="list-disc ml-5 space-y-2">
                      <li>Visual impairments</li>
                      <li>Reading difficulties</li>
                      <li>Multitasking while browsing</li>
                      <li>Learning new languages</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Click the Accessify icon in your Chrome toolbar</li>
                    <li>Scroll down to &quot;Tools&quot; from the menu</li>
                    <li>Enable &quot;Screen Reader&quot;</li>
                    <li>Highlight any text to have it read aloud</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Chrome className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">1. Install the Extension</h3>
                  <p className="text-gray-600">
                    Add Accessify to Chrome with a single click. No complicated setup required.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ChevronRight className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2. Create an Account</h3>
                  <p className="text-gray-600">Sign up to save your preferences and access them across devices.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ChevronRight className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">3. Customize Your Settings</h3>
                  <p className="text-gray-600">
                    Choose which accessibility features you need and adjust them to your preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ChevronRight className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">4. Browse with Confidence</h3>
                  <p className="text-gray-600">
                    Enjoy a more accessible web experience with your personalized settings applied to every website you
                    visit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

