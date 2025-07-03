'use client'
import { ShieldCheck, Camera, Clock } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Accurate Quotes',
      description: 'Get instant pricing with built-in measurement validation and professional accuracy.'
    },
    {
      icon: Camera,
      title: 'AI Measurements',
      description: 'Upload a photo and let our advanced AI technology handle the precise measurements.'
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Receive your detailed quote in just seconds with comprehensive breakdowns.'
    }
  ]

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-slate-900 mb-6">
            Why Choose <span className="font-semibold text-blue-900">Gursoylar</span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of architectural product quoting with our advanced features designed for
professionals
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="mb-8">
                <div className="inline-flex p-6 rounded-2xl bg-white border border-slate-200 shadow-lg
group-hover:shadow-elegant transition-all duration-300">
                  <f.icon className="h-8 w-8 text-blue-900" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-sm mx-auto">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}