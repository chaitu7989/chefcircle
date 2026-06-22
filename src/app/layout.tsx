import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'ChefCircle — Cook. Connect. Earn.',
  description: 'Discover authentic home-cooked meals from local chefs in your city. Turn your home kitchen into a business.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
