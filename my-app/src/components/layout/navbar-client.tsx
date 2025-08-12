"use client"

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
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

interface NavItem {
  name: string
  link: string
}

interface NavbarClientProps {
  navItems: NavItem[]
  authItems: NavItem[]
  user: User | null
  signOut: () => Promise<void>
}

export function NavbarClient({ navItems, authItems, user, signOut }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        <NavItems items={[...navItems, ...authItems]} />
        {user ? (
          <form action={signOut}>
            <NavbarButton as="button" type="submit" variant="primary">
              Sign out
            </NavbarButton>
          </form>
        ) : (
          <NavbarButton href="#contact" variant="primary">
            Get Quote
          </NavbarButton>
        )}
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <NavItems items={[...navItems, ...authItems]} onItemClick={handleItemClick} />
          {user ? (
            <form action={signOut} className="mt-2 w-full">
              <NavbarButton as="button" type="submit" variant="primary" className="w-full">
                Sign out
              </NavbarButton>
            </form>
          ) : (
            <NavbarButton href="#measurement" variant="primary" className="mt-2">
              Get Instant Quote
            </NavbarButton>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}