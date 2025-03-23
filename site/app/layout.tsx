import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
