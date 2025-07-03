'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductSelector } from '@/components/product/product-selecter'

export default function ProductsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="mx-auto max-w-3xl py-12 px-6">
      <h1 className="text-4xl font-semibold text-center mb-8">Ürün Seçimi</h1>
      <ProductSelector selectedProduct={selected} onProductSelect={setSelected} />
      {selected && (
        <div className="mt-6 text-center">
          <Link href="/#measurement" className="text-blue-900 underline">
            Ölçü girmeye devam et
          </Link>
        </div>
      )}
    </div>
  )
}