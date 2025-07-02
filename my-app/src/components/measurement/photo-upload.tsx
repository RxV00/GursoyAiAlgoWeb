'use client'
import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  onMeasurementsExtracted: (measurements: any) => void
  productType: string | null
}

export function PhotoUpload({ onMeasurementsExtracted, productType }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate AI processing
    setTimeout(() => {
      onMeasurementsExtracted({
        width: 240,
        height: 180,
        unit: 'cm',
        confidence: 0.95
      })
      setIsUploading(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={!productType || isUploading}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className={cn(
            'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            productType
              ? 'border-gray-300 hover:border-accent bg-gray-50 hover:bg-accent/5'
              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
          )}
        >
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
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