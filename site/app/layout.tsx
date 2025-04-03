import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import ClientSessionProvider from "@/components/providers/ClientSessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accessify - Web Accessibility Made Easy",
  description: "EmoryHacks2025 Hackathon Project",
  icons: {
    icon: [
      { rel: 'icon', url: '/icon.png' },
      { rel: 'apple-touch-icon', url: '/icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
