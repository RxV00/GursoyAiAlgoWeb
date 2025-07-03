'use client'
import { ShieldCheck, Camera, Clock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Accurate Quotes',
      description: 'Get instant pricing with built-in measurement validation.'
    },
    {
      icon: Camera,
      title: 'AI Measurements',
      description: 'Upload a photo and let our AI handle the rest.'
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Receive your quote in just a few seconds.'
    }
  ]

  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Why ArchQuote?</h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Experience the future of architectural product quoting with our advanced features
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-6 p-8 rounded-xl bg-slate-50 hover:bg-slate-100
transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-4 rounded-full bg-gradient-warm">
                <f.icon className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{f.title}</h3>
              <p className="text-slate-600 text-base max-w-xs leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}