'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Ruler, Camera, Lock, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ProductSelector } from '../product/product-selecter'
import { MeasurementForm } from '../forms/measurement-form'
import { PhotoUpload } from '../measurement/photo-upload'
import { createQuote, type NewQuotePayload } from '@/app/actions/quote.actions'
import type { ProductWithDetails } from '@/lib/types/database'

interface MeasurementSectionProps {
  isAuthenticated: boolean
}

export function MeasurementSection({ isAuthenticated }: MeasurementSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null)
  const [quotePayload, setQuotePayload] = useState<NewQuotePayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSaveQuote = async () => {
    if (!quotePayload) return

    startTransition(async () => {
      const result = await createQuote(quotePayload)
      if (result.error) {
        setError(result.error)
        toast.error('Failed to save quote.')
      } else {
        toast.success('Quote saved successfully!')
        router.push('/dashboard')
      }
    })
  }

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
                selectedProduct={selectedProduct?.id || null}
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
                  {selectedProduct ? (
                    <MeasurementForm 
                      product={selectedProduct}
                      isAuthenticated={isAuthenticated}
                      onCalculate={(price, measurementData) => {
                        setQuotePayload({
                          product: selectedProduct,
                          measurements: {
                            width: Number(measurementData.width),
                            height: Number(measurementData.height),
                          },
                          quantity: Number(measurementData.quantity) || 1,
                          calculatedPrice: price,
                        });
                        setError(null);
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Please select a product first
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="photo" className="mt-6">
                  {selectedProduct ? (
                    <PhotoUpload 
                      isAuthenticated={isAuthenticated}
                      onMeasurementsExtracted={(extractedMeasurements) => {
                        // This part is not fully implemented in the original code
                        // For now, we'll just log it.
                        console.log('Extracted measurements:', extractedMeasurements);
                      }}
                    />
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Please select a product first
                    </div>
                  )}
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
              <div className="space-y-6">
                {error && (
                  <div className="p-4 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                    {error}
                  </div>
                )}
                {quotePayload && isAuthenticated ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-4">
                      <div className="text-2xl font-bold text-blue-800 mb-2">
                        {quotePayload.calculatedPrice.toLocaleString('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        })}
                      </div>
                      <div className="text-sm text-blue-600 mb-2">
                        {quotePayload.product.name} ({quotePayload.product.manufacturer.name})
                      </div>
                      <div className="text-xs text-slate-600">
                        {quotePayload.measurements.width}cm × {quotePayload.measurements.height}cm
                        {quotePayload.quantity > 1 && (
                          <span> × {quotePayload.quantity} units</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-[#7a8fa5] hover:bg-[#5a6f85] text-white py-3 rounded-lg font-medium flex items-center justify-center"
                      onClick={handleSaveQuote}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                      ) : (
                        'Save Quote and View Details'
                      )}
                    </Button>
                    <p className="text-sm text-slate-500 mt-2">
                      Save and manage your quotes in your dashboard
                    </p>
                  </div>
                ) : quotePayload && !isAuthenticated ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200 mb-4">
                      <div className="flex items-center justify-center mb-3">
                        <Lock className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="text-lg font-semibold text-amber-800 mb-2">
                        Sign in to save and view price
                      </div>
                      <div className="text-sm text-amber-700 mb-3">
                        {quotePayload.product.name} ({quotePayload.product.manufacturer.name})
                      </div>
                      <div className="text-xs text-slate-600">
                        {quotePayload.measurements.width}cm × {quotePayload.measurements.height}cm
                        {quotePayload.quantity > 1 && (
                          <span> × {quotePayload.quantity} units</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-[#7a8fa5] hover:bg-[#5a6f85] text-white py-3 rounded-lg font-medium"
                        onClick={() => router.push('/login')}
                      >
                        Sign In to Save
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Create an account to access pricing and save quotes
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-600 mb-4">
                      {!selectedProduct 
                        ? "Select a product to get started" 
                        : "Add measurements to see your quote"
                      }
                    </div>
                    <Button 
                      className="w-full bg-[#7a8fa5] hover:bg-[#5a6f85] text-white py-3 rounded-lg font-medium"
                      onClick={() => router.push('/pricing')}
                      disabled={!selectedProduct}
                    >
                      {isAuthenticated ? 'Go to Pricing Page' : 'Learn About Pricing'}
                    </Button>
                    <p className="text-sm text-slate-500 mt-2">
                      {isAuthenticated 
                        ? 'Advanced pricing features available'
                        : 'Sign in required for pricing and quotes'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
