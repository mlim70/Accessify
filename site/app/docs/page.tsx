import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Headphones, Image, Palette, Type } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function DocsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-gray-600">Learn how to use Accessify to make the web more accessible</p>
          </div>

          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-6">
              <div className="prose max-w-none">
                <h2>Getting Started with Accessify</h2>
                <p>
                  Accessify is a Chrome extension that makes the web more accessible for everyone. This guide will help
                  you install and set up Accessify for the first time.
                </p>

                <h3>Installation</h3>
                <ol>
                  <li>Click the "Add to Chrome" button on our website</li>
                  <li>Confirm the installation when prompted by Chrome</li>
                  <li>Once installed, you'll see the Accessify icon in your browser toolbar</li>
                </ol>

                <h3>Creating an Account</h3>
                <p>While Accessify works without an account, creating one allows you to:</p>
                <ul>
                  <li>Save your accessibility preferences</li>
                  <li>Sync settings across devices</li>
                  <li>Access premium features (if applicable)</li>
                </ul>

                <h3>Basic Configuration</h3>
                <p>
                  After installation, click the Accessify icon in your toolbar to open the main menu. From here, you
                  can:
                </p>
                <ul>
                  <li>Enable/disable specific accessibility features</li>
                  <li>Adjust settings for each feature</li>
                  <li>Save your preferences (if logged in)</li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/docs/detailed-guide">
                  <Button>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read the Full Guide
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Type className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Dyslexic Font</CardTitle>
                    <CardDescription>Makes text easier to read for people with dyslexia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our dyslexic font feature transforms text on any webpage to be more readable for people with
                      dyslexia.
                    </p>
                    <Link href="/docs/features/dyslexic-font">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Palette className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Color Blindness</CardTitle>
                    <CardDescription>Adjusts colors for different types of color blindness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our color filters make websites more visible for people with various types of color vision
                      deficiency.
                    </p>
                    <Link href="/docs/features/color-blindness">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Headphones className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Text to Speech</CardTitle>
                    <CardDescription>Reads website content aloud</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our text-to-speech feature reads website content aloud for users with visual impairments or
                      reading difficulties.
                    </p>
                    <Link href="/docs/features/text-to-speech">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Image className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Image Captioning</CardTitle>
                    <CardDescription>Automatically generates descriptions for images</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our image captioning feature automatically generates and reads descriptions for images on
                      websites.
                    </p>
                    <Link href="/docs/features/image-captioning">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <Link href="/docs/features">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Features
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="prose max-w-none">
                <h2>Accessify API</h2>
                <p>
                  Accessify provides a JavaScript API that allows developers to integrate with our accessibility
                  features. This can be useful for custom web applications or for extending the functionality of
                  Accessify.
                </p>

                <h3>Basic Usage</h3>
                <pre className="bg-slate-100 p-4 rounded-md overflow-x-auto">
                  <code>
                    {`// Initialize Accessify
window.Accessify.init({
  apiKey: 'your-api-key',
  features: ['dyslexicFont', 'colorBlindness']
});

// Enable a specific feature
window.Accessify.enable('textToSpeech');

// Disable a specific feature
window.Accessify.disable('magnification');

// Get current settings
const settings = window.Accessify.getSettings();
console.log(settings);`}
                  </code>
                </pre>

                <h3>Available Methods</h3>
                <ul>
                  <li>
                    <code>init(options)</code> - Initialize the Accessify API
                  </li>
                  <li>
                    <code>enable(feature)</code> - Enable a specific feature
                  </li>
                  <li>
                    <code>disable(feature)</code> - Disable a specific feature
                  </li>
                  <li>
                    <code>getSettings()</code> - Get current settings
                  </li>
                  <li>
                    <code>setSettings(settings)</code> - Update settings
                  </li>
                  <li>
                    <code>onSettingsChange(callback)</code> - Register a callback for settings changes
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/docs/api-reference">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Full API Reference
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Is Accessify free to use?</h3>
                  <p className="text-gray-600">
                    Yes, Accessify is free to use with basic features. We also offer a premium plan with additional
                    features and customization options.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Does Accessify work on all websites?</h3>
                  <p className="text-gray-600">
                    Accessify works on most websites, but some websites with complex layouts or custom implementations
                    may have limited compatibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Can I use Accessify on mobile devices?</h3>
                  <p className="text-gray-600">
                    Currently, Accessify is only available as a Chrome extension for desktop browsers. We're working on
                    mobile solutions for the future.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">How do I report a bug or suggest a feature?</h3>
                  <p className="text-gray-600">
                    You can report bugs or suggest features through our{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      contact form
                    </Link>{" "}
                    or by emailing support@accessify.app.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Does Accessify collect my data?</h3>
                  <p className="text-gray-600">
                    Accessify only collects data necessary for the functioning of the extension and to save your
                    preferences. We do not sell your data to third parties. See our{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>{" "}
                    for more details.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/docs/faq">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    View All FAQs
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}

