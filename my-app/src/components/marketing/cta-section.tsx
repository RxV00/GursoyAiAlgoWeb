'use client'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
export function CTASection() {
    return(
        <section id='contact' className='py-20 bg-gradient-to-br from-primary to-primary/90 text-white'>
         <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
        <h2 className="text-4xl font-bold">Ready to start?</h2>
        <p className="text-lg">Create an account and get your first quote in minutes.</p>
        <Link href="/register">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
            Get Started
          </Button>
        </Link>
      </div>
        
        </section>
    )
}