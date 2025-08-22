'use client'
import { useState, useEffect } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ExtractedMeasurements {
  width: number
  height: number
  quantity: number
  unit: string
  confidence: number
}

interface PhotoUploadProps {
  isAuthenticated: boolean
  onMeasurementsExtracted: (measurements: ExtractedMeasurements) => void
}

export function PhotoUpload({ isAuthenticated, onMeasurementsExtracted }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    setIsUploading(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.onerror = () => {
      setIsUploading(false)
      console.error('Failed to read file')
    }
    reader.readAsDataURL(file)

    // Simulate AI processing
    setTimeout(() => {
      onMeasurementsExtracted({
        width: 240,
        height: 180,
        quantity: 1,
        unit: 'cm',
        confidence: 0.95
      })
      setIsUploading(false)
    }, 2000)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsUploading(false)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading || !isAuthenticated}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className={cn(
            'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            isAuthenticated ? 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50' : 'border-amber-300 bg-amber-50'
          )}
        >
          {uploadedImage ? (
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              <Image 
                src={uploadedImage} 
                alt="Uploaded measurement photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {isAuthenticated ? 'Click to upload or drag and drop' : 'Sign in to upload photos'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isAuthenticated ? 'PNG, JPG up to 10MB' : 'Photo analysis requires authentication'}
              </p>
            </>
          )}
        </label>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="ml-2 text-sm text-gray-600">Analyzing image...</span>
        </div>
      )}
    </div>
  )
}