'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const products = [
  { id: 'window', name: 'Windows', icon: '🪟', description: 'Energy efficient designs for every home.' },
  { id: 'door', name: 'Doors', icon: '🚪', description: 'Secure and stylish entry solutions.' },
  { id: 'skylight', name: 'Skylights', icon: '☀️', description: 'Bring natural light into your space.' },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Popular Products</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="text-left">
              <CardHeader className="flex flex-row items-center space-x-4">
                <span className="text-4xl">{p.icon}</span>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}