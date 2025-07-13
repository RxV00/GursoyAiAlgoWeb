import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

export function Footer() {
  // Footer data
  const footerData = {
    logo: (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6d3e1] shadow-lg">
        <span className="text-xl font-semibold text-white">G</span>
      </div>
    ),
    brandName: "Gursoylar",
    socialLinks: [
      {
        icon: <Facebook className="h-5 w-5" />,
        href: "https://facebook.com",
        label: "Facebook"
      },
      {
        icon: <Twitter className="h-5 w-5" />,
        href: "https://twitter.com",
        label: "Twitter"
      },
      {
        icon: <Instagram className="h-5 w-5" />,
        href: "https://instagram.com",
        label: "Instagram"
      },
      {
        icon: <Linkedin className="h-5 w-5" />,
        href: "https://linkedin.com",
        label: "LinkedIn"
      },
      {
        icon: <Mail className="h-5 w-5" />,
        href: "mailto:info@gursoylar.com",
        label: "Email"
      },
      {
        icon: <Phone className="h-5 w-5" />,
        href: "tel:+1234567890",
        label: "Phone"
      }
    ],
    mainLinks: [
      { href: "/", label: "Home" },
      { href: "#products", label: "Products" },
      { href: "#features", label: "Features" },
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" }
    ],
    legalLinks: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" }
    ],
    copyright: {
      text: "© 2024 Gursoylar. All rights reserved.",
      license: "Professional architectural product solutions since 2020."
    }
  }

  const { logo, brandName, socialLinks, mainLinks, legalLinks, copyright } = footerData
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24">
      <div className="px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-x-2"
            aria-label={brandName}
          >
            {logo}
            <span className="font-bold text-xl">{brandName}</span>
          </Link>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}
