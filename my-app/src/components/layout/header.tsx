'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#measurement' },
  { name: 'Contact', href: '#contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' : 'bg-white/90 backdrop-blur-md'
      )}
    >
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 shadow-lg">
              <span className="text-xl font-semibold text-white">PS</span>
            </div>
            <span className="text-2xl font-light text-slate-900">
              Gursoy<span className="font-semibold text-blue-900">lar</span>
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-medium text-slate-600 hover:text-blue-900 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-blue-900 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'
        )}
      >
        <div className="space-y-1 bg-white border-t border-slate-200 px-6 pb-3 pt-2 shadow-lg">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-blue-50
hover:text-blue-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <Link
            href="/login"
            className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-blue-50
hover:text-blue-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-blue-50
hover:text-blue-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}