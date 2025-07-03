'use client'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-50 py-12 mt-auto border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-600 space-y-4
md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-warm">
              <span className="text-sm font-bold text-slate-900">AQ</span>
            </div>
            <p className="font-medium">&copy; {new Date().getFullYear()} ArchQuote. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="#products" className="hover:text-slate-900 transition-colors">Products</Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#measurement" className="hover:text-slate-900 transition-colors">How It Works</Link>
            <Link href="#contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}