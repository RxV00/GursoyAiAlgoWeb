'use client'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-16 mt-auto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900">
              <span className="text-sm font-semibold text-white">AQ</span>
            </div>
            <div className="text-slate-600">
              <p className="font-medium">
                &copy; {new Date().getFullYear()} ArchQuote. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex space-x-8">
            <Link href="#products" className="text-slate-600 hover:text-blue-900 transition-colors duration-200">
              Products
            </Link>
            <Link href="#features" className="text-slate-600 hover:text-blue-900 transition-colors duration-200">
              Features
            </Link>
            <Link href="#measurement" className="text-slate-600 hover:text-blue-900 transition-colors
duration-200">
              How It Works
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-blue-900 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}