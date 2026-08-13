import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Geist_Mono } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Roshan Sawant | DevOps Engineer",
  description: "DevOps Engineer crafting scalable pipelines & cloud systems. Specializing in AWS, Kubernetes, Terraform, and CI/CD automation.",
  keywords: ["DevOps", "Cloud Engineer", "AWS", "Kubernetes", "Terraform", "CI/CD", "Roshan Sawant"],
  authors: [{ name: "Roshan Sawant" }],
  openGraph: {
    title: "Roshan Sawant | DevOps Engineer",
    description: "DevOps Engineer crafting scalable pipelines & cloud systems.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  )
}
