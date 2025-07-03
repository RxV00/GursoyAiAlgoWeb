'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const products = [
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    image: 'https://via.placeholder.com/40?text=Window'
  },
  {
    id: 'french-door',
    name: 'French Door',
    image: 'https://via.placeholder.com/40?text=Door'
  },
  {
    id: 'skylight',
    name: 'Skylight',
    image: 'https://via.placeholder.com/40?text=Light'
  },
  {
    id: 'aluminum-frame',
    name: 'Aluminum Frame',
    image: 'https://via.placeholder.com/40?text=Frame'
  }
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
          <img
              src={product.image}
              alt={product.name}
              className="h-6 w-6 rounded-md object-cover"
            />
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