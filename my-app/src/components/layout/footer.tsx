'use client'
import Link from 'next/link'
export function Footer() {
    return(
        <footer className ='bg-gray-100 py-8 mt-auto border-t'>
            <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 space-y-4 md:space-y-0">
                <p>&copy; {new Date().getFullYear()} ArchQuote. All rights reserved.</p>
                <div className='flex space-x-4'>
                <Link href="#products" className="hover:text-gray-900">Products</Link>
                <Link href="#features" className="hover:text-gray-900">Features</Link>
                <Link href="#measurement" className="hover:text-gray-900">How It Works</Link>
                </div>
            </div>
        </footer>
    )
}