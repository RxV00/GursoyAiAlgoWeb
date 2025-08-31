import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/signOut'
import { NavbarClient } from './navbar-client'

export async function AppNavbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "#products" },
    { name: "Features", link: "#features" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ]

  const authItems = user 
    ? [
        { name: "Dashboard", link: "/dashboard/quotes" },
      ]
    : [
        { name: "Login", link: "/login" },
        { name: "Sign up", link: "/signup" },
      ]

  return <NavbarClient navItems={navItems} authItems={authItems} user={user} signOut={signOut} />
} 