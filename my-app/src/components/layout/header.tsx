'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle,
  NavbarButton
} from '@/components/ui/resizable-navbar'

const navigation = [
  { name: 'Features', link: '#features' },
  { name: 'How It Works', link: '#measurement' },
  { name: 'Contact', link: '#contact' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <Navbar className="fixed top-0 inset-x-0 z-[9999] w-full">
      {/* Desktop Navigation */}
      <NavBody className="bg-white/90 backdrop-blur-md border-b border-slate-200">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 relative z-20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6d3e1] shadow-lg">
            <span className="text-xl font-semibold text-white">PS</span>
          </div>
          <span className="text-2xl font-medium italic text-slate-900">
            Gursoy<span className="font-semibold text-[#7a8fa5]">lar</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <NavItems 
          items={navigation} 
          className="text-slate-600 hover:text-[#7a8fa5]"
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 relative z-20">
          <NavbarButton 
            href="/login"
            variant="secondary" 
            className="text-slate-600 hover:text-[#7a8fa5] hover:bg-[#f0f4f8] bg-transparent shadow-none"
          >
            Sign In
          </NavbarButton>
          <NavbarButton 
            href="/signup"
            variant="primary" 
            className="bg-[#c6d3e1] hover:bg-[#a8bcd2] text-[#2d3e50] shadow-lg border-none"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="bg-white/90 backdrop-blur-md border-b border-slate-200">
        <MobileNavHeader>
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6d3e1] shadow-lg">
              <span className="text-xl font-semibold text-white">PS</span>
            </div>
            <span className="text-2xl font-medium italic text-slate-900">
              Gursoy<span className="font-semibold text-[#7a8fa5]">lar</span>
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <MobileNavToggle 
            isOpen={isMobileMenuOpen} 
            onClick={handleMobileMenuToggle}
          />
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          className="bg-white border border-slate-200 shadow-lg"
        >
          <div className="flex flex-col space-y-4 w-full">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-[#f0f4f8] hover:text-[#7a8fa5] transition-colors"
                onClick={handleMobileMenuClose}
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/login"
              className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-[#f0f4f8] hover:text-[#7a8fa5] transition-colors"
              onClick={handleMobileMenuClose}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-[#f0f4f8] hover:text-[#7a8fa5] transition-colors"
              onClick={handleMobileMenuClose}
            >
              Get Started
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}