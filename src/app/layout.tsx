import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css"
import Navigation from './modules/navigation/Navigation'
import { AuthProvider } from './modules/Providers/Providers'

export const metadata: Metadata = {
  title: "Booktracker",
  description: "Track your book reading progress",
}

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`} >

      <body>
        <Navigation />

        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  )
}
