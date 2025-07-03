'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

import { productCategories } from '@/lib/product-data'

interface ProductSelectorProps {
  onProductSelect: (productId: string) => void
  selectedProduct: string | null
}

export function ProductSelector({ onProductSelect, selectedProduct }: ProductSelectorProps) {
  return (
    <div className="space-y-6">
      {productCategories.map((category) => (
        <div key={category.id} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">{category.name}</h3>
          {category.brands ? (
            <div className="space-y-4 ml-4">
              {category.brands.map((brand) => (
                <div key={brand.id} className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-600">{brand.name}</h4>
                  <div className="space-y-1">
                    {brand.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => onProductSelect(product.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-2 rounded-lg border-2 transition-all',
                          selectedProduct === product.id
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <span className="font-medium text-sm">{product.name}</span>
                        {selectedProduct === product.id && <Check className="h-4 w-4 text-accent" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>          ) : (
            <div className="space-y-1 ml-4">
              {category.products?.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onProductSelect(product.id)}
                  className={cn(
                    'w-full flex items-center justify-between p-2 rounded-lg border-2 transition-all',
                    selectedProduct === product.id
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <span className="font-medium text-sm">{product.name}</span>
                  {selectedProduct === product.id && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>      ))}
    </div>
  )
}


