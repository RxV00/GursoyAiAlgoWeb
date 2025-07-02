'use client'

import { useState } from 'react'
import { Ruler, Camera } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MeasurementForm } from '@/components/forms/measurement-form'
import {PhotoUpload} from '@/components/measurement/photo-upload'
import { ProductSelector } from '@/components/product/product-selecter'
import {PriceDisplay} from '@/components/pricing/price-display'

export function MeasurementSection() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<any>(null)
  const [price] = useState<number | null>(null)

  return (
    <section id="measurement" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Instant Quote
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a product and provide measurements to receive an accurate price estimate
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Step 1: Product Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>1. Select Product</CardTitle>
              <CardDescription>
                Choose the architectural product you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSelector 
                onProductSelect={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            </CardContent>
          </Card>

          {/* Step 2: Measurements */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>2. Provide Measurements</CardTitle>
              <CardDescription>
                Upload a photo or enter dimensions manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">
                    <Ruler className="mr-2 h-4 w-4" />
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="photo">
                    <Camera className="mr-2 h-4 w-4" />
                    AI Photo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-4">
                  <MeasurementForm 
                    onMeasurementsChange={setMeasurements}
                    productType={selectedProduct}
                  />
                </TabsContent>
                <TabsContent value="photo" className="mt-4">
                  <PhotoUpload 
                    onMeasurementsExtracted={setMeasurements}
                    productType={selectedProduct}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 3: Price Display */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>3. Your Quote</CardTitle>
              <CardDescription>
                Instant price estimate based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
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