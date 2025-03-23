import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "./components/ClientSessionProvider";

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
    <html lang="en">
      <body>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
