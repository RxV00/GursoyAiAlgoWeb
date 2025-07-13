'use client'

import { useState, useEffect } from 'react'
import { Ruler, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MeasurementForm } from '@/components/forms/measurement-form'
import { PhotoUpload } from '@/components/measurement/photo-upload'
// import { ProductSelector } from '@/components/product/product-selecter'
import { PriceDisplay } from '@/components/pricing/price-display'
import { calculatePrice, Measurements } from '@/lib/pricing'
import { ProductSelector } from '../product/product-selecter'

export function MeasurementSection() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<Measurements | null>(null)
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    if (selectedProduct && measurements) {
      setPrice(calculatePrice(selectedProduct, measurements))
    } else {
      setPrice(null)
    }
  }, [selectedProduct, measurements])

  return (
    <section id="measurement" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-slate-900 mb-6">
            Get Your <span className="font-semibold text-[#7a8fa5]">Instant Quote</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Select a product and provide measurements to receive an accurate, professional price estimate
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Step 1: Product Selection */}
          <Card className="lg:col-span-1 border-slate-200 bg-white shadow-lg hover:shadow-elegant transition-all
duration-300">
            <CardHeader className="bg-[#c6d3e1] text-[#2d3e50] rounded-t-lg">
              <CardTitle className="text-xl">1. Select Product</CardTitle>
              <CardDescription className="text-[#4a5f7a]">
                Choose the architectural product you need
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ProductSelector
                onProductSelect={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            </CardContent>
          </Card>

          {/* Step 2: Measurements */}
          <Card className="lg:col-span-1 border-slate-200 bg-white shadow-lg hover:shadow-elegant transition-all
duration-300">
            <CardHeader className="bg-[#c6d3e1] text-[#2d3e50] rounded-t-lg">
              <CardTitle className="text-xl">2. Provide Measurements</CardTitle>
              <CardDescription className="text-[#4a5f7a]">
                Upload a photo or enter dimensions manually
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                  <TabsTrigger value="manual" className="data-[state=active]:bg-[#c6d3e1]
data-[state=active]:text-[#2d3e50]">
                    <Ruler className="mr-2 h-4 w-4" />
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="data-[state=active]:bg-[#c6d3e1]
data-[state=active]:text-[#2d3e50]">
                    <Camera className="mr-2 h-4 w-4" />
                    AI Photo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-6">
                  <MeasurementForm
                    onMeasurementsChange={setMeasurements}
                    productType={selectedProduct}
                  />
                </TabsContent>
                <TabsContent value="photo" className="mt-6">
                  <PhotoUpload
                    onMeasurementsExtracted={setMeasurements}
                    productType={selectedProduct}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 3: Price Display */}
          <Card className="lg:col-span-1 border-slate-200 bg-white shadow-lg hover:shadow-elegant transition-all
duration-300">
            <CardHeader className="bg-[#c6d3e1] text-[#2d3e50] rounded-t-lg">
              <CardTitle className="text-xl">3. Your Quote</CardTitle>
              <CardDescription className="text-[#4a5f7a]">
                Instant price estimate based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <PriceDisplay
                product={selectedProduct}
                measurements={measurements}
                price={price}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}