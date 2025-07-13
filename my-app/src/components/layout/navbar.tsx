"use client"

import { useState } from 'react'
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  NavbarLogo, 
  NavbarButton, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle 
} from '@/components/ui/resizable-navbar'

export function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "#products" },
    { name: "Features", link: "#features" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleItemClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <Navbar className="top-2">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <NavbarButton href="#contact" variant="primary">
          Get Quote
        </NavbarButton>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <NavItems items={navItems} onItemClick={handleItemClick} />
          <NavbarButton href="#measurement" variant="primary" className="mt-4">
            Get Instant Quote
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
} 