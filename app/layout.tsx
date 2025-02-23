import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Scoop",
  description: "A modern news reader with TikTok-style scroll",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark !scroll-smooth">
      <head>
        <style>{`
          html {
            scroll-behavior: smooth;
          }
          * {
            scroll-behavior: smooth;
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-amoled text-gray-100`}>
        {children}
      </body>
    </html>
  )
}