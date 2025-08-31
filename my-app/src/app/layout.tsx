import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppNavbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
      title: 'Gursoylar - Instant Architectural Product Quotes',
  description: 'Get instant price estimates for custom windows, doors, and skylights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="relative w-full">
            <AppNavbar />
            {children}
            <Footer />
            <Toaster position="top-right" />
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}