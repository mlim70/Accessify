import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'
import { Session } from 'next-auth'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  Chrome,
  Eye,
  FileText,
  Headphones,
  Image,
  Languages,
  Maximize,
  Palette,
  Type,
} from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HeroSection from "@/components/hero-section"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import LoginButton from './components/LoginButton'

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions)

  const features = [
    {
      title: "Dyslexic Font",
      description: "Makes text easier to read for people with dyslexia by using specialized fonts.",
      icon: <Type className="h-8 w-8 text-primary" />,
    },
    {
      title: "Color Blindness",
      description: "Adjusts colors on websites to be more visible for people with different types of color blindness.",
      icon: <Palette className="h-8 w-8 text-primary" />,
    },
    {
      title: "Translation",
      description: "Translates web content into the user's preferred language.",
      icon: <Languages className="h-8 w-8 text-primary" />,
    },
    {
      title: "Magnification Tool",
      description: "Enlarges portions of the screen for users with visual impairments.",
      icon: <Maximize className="h-8 w-8 text-primary" />,
    },
    {
      title: "LLM Input Modification",
      description: "Uses AI to modify website code in real-time for better accessibility.",
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      title: "Text to Speech",
      description: "Reads website content aloud for users with visual impairments or reading difficulties.",
      icon: <Headphones className="h-8 w-8 text-primary" />,
    },
    {
      title: "Image Captioning",
      description: "Automatically generates and reads descriptions for images on websites.",
      icon: <Image className="h-8 w-8 text-primary" />,
    },
    {
      title: "OCR & Summarization",
      description: "Extracts and summarizes text from images for easier comprehension.",
      icon: <Eye className="h-8 w-8 text-primary" />,
    },
    {
      title: "Resource Suggestions",
      description: "Recommends other helpful extensions and resources based on specific disabilities.",
      icon: <Chrome className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar session={session} />
      <HeroSection session={session} />

      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Accessibility Features</h2>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dyslexic">Dyslexic Font</TabsTrigger>
              <TabsTrigger value="colorblind">Color Blindness</TabsTrigger>
              <TabsTrigger value="translate">Translator</TabsTrigger>
              <TabsTrigger value="magnify">Magnification</TabsTrigger>
              <TabsTrigger value="llm">LLM Input</TabsTrigger>
              <TabsTrigger value="tts">Text to Speech</TabsTrigger>
              <TabsTrigger value="caption">Image Captioning</TabsTrigger>
              <TabsTrigger value="ocr">OCR</TabsTrigger>
              
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
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
                    <li>Select &quot;Color Blindness&quot; from the menu</li>
                    <li>Choose your specific type of color blindness</li>
                    <li>Adjust the intensity of the filter as needed</li>
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

            <div className="mt-12 text-center">
              {!session ? (
                <LoginButton />
              ) : (
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Chrome className="mr-2 h-5 w-5" />
                  Add to Chrome
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

