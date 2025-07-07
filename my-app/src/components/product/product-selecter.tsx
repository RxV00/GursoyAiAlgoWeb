'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

import { productCategories } from '@/lib/product-data'

interface ProductSelectorProps {
  onProductSelect: (productId: string) => void
  selectedProduct: string | null
}

export function ProductSelector({ onProductSelect, selectedProduct }: ProductSelectorProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [openWindowTypes, setOpenWindowTypes] = useState<string[]>([])
  const [openBrands, setOpenBrands] = useState<string[]>([])
  const [openProducts, setOpenProducts] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleWindowType = (windowTypeId: string) => {
    setOpenWindowTypes(prev =>
      prev.includes(windowTypeId)
        ? prev.filter(id => id !== windowTypeId)
        : [...prev, windowTypeId]
    )
  }

  const toggleBrand = (brandId: string) => {
    setOpenBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const toggleProduct = (productId: string) => {
    setOpenProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getExampleVideos = (productId: string) => {
    const videoMap: Record<string, string[]> = {
      // Cortizo Products
      'cortizo-copision': [
        'https://example.com/cortizo-copision-demo-1.mp4',
        'https://example.com/cortizo-copision-demo-2.mp4'
      ],
      'cortizo-copision-plus': [
        'https://example.com/cortizo-copision-plus-demo-1.mp4',
        'https://example.com/cortizo-copision-plus-demo-2.mp4'
      ],
      'cortizo-hebeschiebe': [
        'https://example.com/cortizo-hebeschiebe-demo-1.mp4',
        'https://example.com/cortizo-hebeschiebe-demo-2.mp4'
      ],
      'cortizo-klasik-standart': [
        'https://example.com/cortizo-klasik-standart-demo-1.mp4',
        'https://example.com/cortizo-klasik-standart-demo-2.mp4'
      ],
      'cortizo-klasik-premium': [
        'https://example.com/cortizo-klasik-premium-demo-1.mp4',
        'https://example.com/cortizo-klasik-premium-demo-2.mp4'
      ],
      'cortizo-katlanir-standart': [
        'https://example.com/cortizo-katlanir-standart-demo-1.mp4',
        'https://example.com/cortizo-katlanir-standart-demo-2.mp4'
      ],
      'cortizo-katlanir-premium': [
        'https://example.com/cortizo-katlanir-premium-demo-1.mp4',
        'https://example.com/cortizo-katlanir-premium-demo-2.mp4'
      ],
      // Asisim Products
      'asisim-copision': [
        'https://example.com/asisim-copision-demo-1.mp4',
        'https://example.com/asisim-copision-demo-2.mp4'
      ],
      'asisim-copision-plus': [
        'https://example.com/asisim-copision-plus-demo-1.mp4',
        'https://example.com/asisim-copision-plus-demo-2.mp4'
      ],
      'asisim-hebeschiebe': [
        'https://example.com/asisim-hebeschiebe-demo-1.mp4',
        'https://example.com/asisim-hebeschiebe-demo-2.mp4'
      ],
      'asisim-klasik-standart': [
        'https://example.com/asisim-klasik-standart-demo-1.mp4',
        'https://example.com/asisim-klasik-standart-demo-2.mp4'
      ],
      'asisim-klasik-premium': [
        'https://example.com/asisim-klasik-premium-demo-1.mp4',
        'https://example.com/asisim-klasik-premium-demo-2.mp4'
      ],
      'asisim-katlanir-standart': [
        'https://example.com/asisim-katlanir-standart-demo-1.mp4',
        'https://example.com/asisim-katlanir-standart-demo-2.mp4'
      ],
      'asisim-katlanir-premium': [
        'https://example.com/asisim-katlanir-premium-demo-1.mp4',
        'https://example.com/asisim-katlanir-premium-demo-2.mp4'
      ],
      // Rehau Products
      'rehau-copision': [
        'https://example.com/rehau-copision-demo-1.mp4',
        'https://example.com/rehau-copision-demo-2.mp4'
      ],
      'rehau-copision-plus': [
        'https://example.com/rehau-copision-plus-demo-1.mp4',
        'https://example.com/rehau-copision-plus-demo-2.mp4'
      ],
      'rehau-hebeschiebe': [
        'https://example.com/rehau-hebeschiebe-demo-1.mp4',
        'https://example.com/rehau-hebeschiebe-demo-2.mp4'
      ],
      'rehau-klasik-standart': [
        'https://example.com/rehau-klasik-standart-demo-1.mp4',
        'https://example.com/rehau-klasik-standart-demo-2.mp4'
      ],
      'rehau-klasik-premium': [
        'https://example.com/rehau-klasik-premium-demo-1.mp4',
        'https://example.com/rehau-klasik-premium-demo-2.mp4'
      ],
      'rehau-katlanir-standart': [
        'https://example.com/rehau-katlanir-standart-demo-1.mp4',
        'https://example.com/rehau-katlanir-standart-demo-2.mp4'
      ],
      'rehau-katlanir-premium': [
        'https://example.com/rehau-katlanir-premium-demo-1.mp4',
        'https://example.com/rehau-katlanir-premium-demo-2.mp4'
      ],
      // Other Products
      'panjur': [
        'https://example.com/panjur-demo-1.mp4',
        'https://example.com/panjur-demo-2.mp4'
      ],
      'zip-perde': [
        'https://example.com/zip-perde-demo-1.mp4',
        'https://example.com/zip-perde-demo-2.mp4'
      ],
      'giyotin': [
        'https://example.com/giyotin-demo-1.mp4',
        'https://example.com/giyotin-demo-2.mp4'
      ],
      'pergola': [
        'https://example.com/pergola-demo-1.mp4',
        'https://example.com/pergola-demo-2.mp4'
      ],
      'kışbahcesi': [
        'https://example.com/kisbahcesi-demo-1.mp4',
        'https://example.com/kisbahcesi-demo-2.mp4'
      ],
      'gunes-kirici': [
        'https://example.com/gunes-kirici-demo-1.mp4',
        'https://example.com/gunes-kirici-demo-2.mp4'
      ]
    }
    return videoMap[productId] || []
  }

  return (
    <div className="space-y-4">
      {productCategories.map((category) => {
        const isCategoryOpen = openCategories.includes(category.id)

        return (
          <Collapsible key={category.id} open={isCategoryOpen} onOpenChange={() => toggleCategory(category.id)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between p-4 h-auto hover:bg-[#c6d3e1] border-[#c6d3e1] bg-white text-lg
 font-semibold"
              >
                <span className="text-gray-800">{category.name}</span>
                <motion.div
                  animate={{ rotate: isCategoryOpen ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {category.windowTypes ? (
                <div className="space-y-3 ml-4">
                  {category.windowTypes.map((windowType) => {
                    const isWindowTypeOpen = openWindowTypes.includes(windowType.id)

                    return (
                      <Collapsible key={windowType.id} open={isWindowTypeOpen} onOpenChange={() =>
toggleWindowType(windowType.id)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between p-4 h-auto hover:bg-[#c6d3e1] border-[#c6d3e1]
bg-white"
                          >
                            <span className="font-semibold text-gray-700">{windowType.name}</span>
                            <motion.div
                              animate={{ rotate: isWindowTypeOpen ? 90 : 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-3">
                          {/* Brands Section */}
                          <div className="space-y-2 ml-4">
                            {windowType.brands.map((brand) => {
                              const brandKey = `${windowType.id}-${brand.brandId}`
                              const isBrandOpen = openBrands.includes(brandKey)

                              return (
                                <Collapsible key={brandKey} open={isBrandOpen} onOpenChange={() =>
toggleBrand(brandKey)}>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between p-3 h-auto hover:bg-[#c6d3e1]
border-[#c6d3e1] bg-white"
                                    >
                                      <span className="font-medium text-gray-700">{brand.brandName}</span>
                                      <motion.div
                                        animate={{ rotate: isBrandOpen ? 90 : 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                      >
                                        <ChevronRight className="h-4 w-4" />
                                      </motion.div>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-2 space-y-2">
                                    {/* Products Section */}
                                    <div className="space-y-2 ml-4">
                                      {brand.products.map((product) => {
                                        const isProductOpen = openProducts.includes(product.id)
                                        const productVideos = getExampleVideos(product.id)

                                        return (
                                          <div key={product.id} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={() => onProductSelect(product.id)}
                                                className={cn(
                                                  'flex-1 flex items-center justify-between p-3 rounded-lgborder-2 transition-all',
                                                  selectedProduct === product.id
                                                    ? 'border-[#c6d3e1] bg-[#c6d3e1]'
                                                    : 'border-[#c6d3e1] bg-white hover:bg-[#c6d3e1]'
                                                )}
                                              >
                                                <span className="font-medium text-sm">{product.name}</span>
                                                {selectedProduct === product.id && <Check className="h-4 w-4
text-gray-700" />}
                                              </button>

                                              {/* Video toggle button */}
                                              {productVideos.length > 0 && (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => toggleProduct(product.id)}
                                                  className="px-2 py-1 h-8 border-[#c6d3e1] bg-white
hover:bg-[#c6d3e1]"
                                                >
                                                  <Play className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </div>

                                            {/* Product-specific videos - only show when clicked */}
                                            <AnimatePresence>
                                              {isProductOpen && productVideos.length > 0 && (
                                                <motion.div
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: "auto" }}
                                                  exit={{ opacity: 0, height: 0 }}
                                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                                  className="bg-[#c6d3e1] p-3 rounded-lg ml-4 overflow-hidden"
                                                >
                                                  <h6 className="text-xs font-medium text-gray-600
mb-2">{product.name} Örnek Videolar</h6>
                                                  <div className="grid grid-cols-1 gap-2">
                                                    {productVideos.map((video, index) => (
                                                      <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.2, delay: index * 0.1 }}
                                                        className="relative bg-white rounded-lg
aspect-video flex items-center justify-center hover:bg-[#c6d3e1] transition-colors cursor-pointer"
                                                      >
                                                        <Play className="h-6 w-6 text-gray-600" />
                                                        <div className="absolute bottom-1 left-1 bg-black
bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                                                          Video {index + 1}
                                                        </div>
                                                      </motion.div>
                                                    ))}
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3 ml-4">
                  {/* For categories without window types, create a single collapsible */}
                  <Collapsible open={openWindowTypes.includes(category.id)} onOpenChange={() =>
toggleWindowType(category.id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between p-4 h-auto hover:bg-[#c6d3e1] border-[#c6d3e1]
bg-white"
                      >
                        <span className="font-semibold text-gray-700">Ürünler</span>
                        <motion.div
                          animate={{ rotate: openWindowTypes.includes(category.id) ? 90 : 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-4">
                      {/* Products Section with individual videos */}
                      <div className="space-y-3 ml-4">
                        {category.products?.map((product) => {
                          const isProductOpen = openProducts.includes(product.id)
                          const productVideos = getExampleVideos(product.id)

                          return (
                            <div key={product.id} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onProductSelect(product.id)}
                                  className={cn(
                                    'flex-1 flex items-center justify-between p-3 rounded-lg border-2transition-all',
                                    selectedProduct === product.id
                                      ? 'border-[#c6d3e1] bg-[#c6d3e1]'
                                      : 'border-[#c6d3e1] bg-white hover:bg-[#c6d3e1]'
                                  )}
                                >
                                  <span className="font-medium text-sm">{product.name}</span>
                                  {selectedProduct === product.id && <Check className="h-4 w-4 text-gray-700" />}
                                </button>

                                {/* Video toggle button */}
                                {productVideos.length > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleProduct(product.id)}
                                    className="px-2 py-1 h-8 border-[#c6d3e1] bg-white hover:bg-[#c6d3e1]"
                                  >
                                    <Play className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {/* Product-specific videos - only show when clicked */}
                              <AnimatePresence>
                                {isProductOpen && productVideos.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="bg-[#c6d3e1] p-3 rounded-lg ml-4 overflow-hidden"
                                  >
                                    <h6 className="text-xs font-medium text-gray-600 mb-2">{product.name} Örnek
Videolar</h6>
                                    <div className="grid grid-cols-1 gap-2">
                                      {productVideos.map((video, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.2, delay: index * 0.1 }}
                                          className="relative bg-white rounded-lg aspect-video flex
items-center justify-center hover:bg-[#c6d3e1] transition-colors cursor-pointer"
                                        >
                                          <Play className="h-6 w-6 text-gray-600" />
                                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50
text-white text-xs px-1 py-0.5 rounded">
                                            Video {index + 1}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}