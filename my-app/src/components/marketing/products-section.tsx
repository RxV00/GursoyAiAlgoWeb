'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const products = [
  { id: 'window', name: 'Windows', icon: '🪟' , description: 'Energy efficient designs with premium materials forevery architectural style.' },
  { id: 'door', name: 'Doors', icon: '🚪', description: 'Secure and stylish entry solutions with advanced lockingsystems.' },
  { id: 'skylight', name: 'Skylights', icon: '☀️', description: 'Bring natural light into your space withweather-resistant designs.' },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-slate-900 mb-6">
            Our <span className="font-semibold text-[#7a8fa5]">Products</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our selection of premium architectural products, each designed with quality and precision
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((p) => (
            <Card
              key={p.id}
              className="group hover:shadow-elegant transition-all duration-300 border-slate-200 bg-white
hover:transform hover:scale-105"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0f4f8]
group-hover:bg-[#e2e9f0] transition-colors">
                  <span className="text-3xl">{p.icon}</span>
                </div>
                <CardTitle className="text-slate-900 text-2xl font-semibold">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 text-lg leading-relaxed">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}