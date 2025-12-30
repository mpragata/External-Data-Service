import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//seo
export const metadata: Metadata = {
  title: "External Data Dashboard - Weather & Currency Rates",
  description:
    "Get real-time weather updates and currency exchange rates. Track global currencies and check the latest weather in your city with our interactive dashboard.",
  keywords: [
    "weather",
    "currency exchange",
    "real-time rates",
    "forex",
    "temperature",
    "weather dashboard",
    "currency converter",
    "OpenWeather",
    "ExchangeRate API",
    "Next.js dashboard",
  ],
  authors: [{ name: "Marc Xavier Pragata" }],
  robots: "index, follow",
  openGraph: {
    title: "External Data Dashboard - Weather & Currency Rates",
    description:
      "Real-time weather updates and currency exchange rates. Track global currencies and check the latest weather in your city with our interactive dashboard.",
    type: "website",
    url: "https://yourdomain.com",
    siteName: "External Data Dashboard",
  },
  twitter: {
    title: "External Data Dashboard - Weather & Currency Rates",
    description:
      "Get real-time weather and currency updates. Track global currencies and check the latest weather in your city.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
