'use client'
import {ShieldCheck,Camera,Clock} from 'lucide-react'
export function FeaturesSection() {
    const features = [
      {
        icon: ShieldCheck,
        title: 'Accurate Quotes',
        description: 'Get instant pricing with built-in measurement validation.'
      },
      { icon: Camera, title: 'AI Measurements', description: 'Upload a photo and let our AI handle the rest.' },
      { icon: Clock, title: 'Fast Results', description: 'Receive your quote in just a few seconds.' }
    ]
  
    return (
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Why ArchQuote?</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <f.icon className="h-10 w-10 text-accent" />
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="text-gray-600 text-sm max-w-xs">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }