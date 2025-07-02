'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const products = [
  { id: 'sliding-window', name: 'Sliding Window', icon: '🪟' },
  { id: 'french-door', name: 'French Door', icon: '🚪' },
  { id: 'skylight', name: 'Skylight', icon: '☀️' },
  { id: 'aluminum-frame', name: 'Aluminum Frame', icon: '🏗️' },
]

interface ProductSelectorProps {
  onProductSelect: (productId: string) => void
  selectedProduct: string | null
}

export function ProductSelector({ onProductSelect, selectedProduct }: ProductSelectorProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductSelect(product.id)}
          className={cn(
            'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all',
            selectedProduct === product.id
              ? 'border-accent bg-accent/5'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{product.icon}</span>
            <span className="font-medium">{product.name}</span>
          </div>
          {selectedProduct === product.id && (
            <Check className="h-5 w-5 text-accent" />
          )}
        </button>
      ))}
    </div>
  )
}