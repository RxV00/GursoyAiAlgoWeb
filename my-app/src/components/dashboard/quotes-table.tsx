'use client'

// import { useState } from 'react' // Reserved for future view mode functionality
import { format } from 'date-fns'
import { Eye, Package, Building, Calendar, Hash, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserMeasurementWithDetails } from '@/lib/types/database'

interface QuotesTableProps {
  quotes: UserMeasurementWithDetails[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onViewQuote: (quote: UserMeasurementWithDetails) => void
}

function QuoteCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

function QuoteCard({ 
  quote, 
  onView 
}: { 
  quote: UserMeasurementWithDetails
  onView: () => void 
}) {
  return (
    <Card className="w-full glass-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-fade-up group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium text-slate-900 truncate">
              {quote.product.name}
            </CardTitle>
            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
              <Building className="h-3 w-3" />
              {quote.product.manufacturer.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gradient">
              {quote.calculated_price ? 
                quote.calculated_price.toLocaleString('tr-TR', { 
                  style: 'currency', 
                  currency: 'TRY' 
                }) : 
                'N/A'
              }
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Ruler className="h-3 w-3" />
              Dimensions
            </div>
            <div className="font-medium">
              {quote.measurements.width || 0}cm × {quote.measurements.height || 0}cm
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-500 mb-1">
              <Hash className="h-3 w-3" />
              Quantity
            </div>
            <div className="font-medium">{quote.quantity || 1} units</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-500">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(quote.created_at), 'MMM dd, yyyy')}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {quote.product.category.name}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="w-full group-hover:bg-[#c6d3e1] group-hover:text-[#2d3e50] transition-all duration-300 hover:scale-105 relative overflow-hidden px-3 py-2"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></span>
          <Eye className="h-4 w-4 mr-2 relative z-10" />
          <span className="relative z-10">View Details</span>
        </Button>
      </CardContent>
    </Card>
  )
}

function QuoteRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-slate-100">
      <Skeleton className="h-4 w-full md:col-span-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

function QuoteRow({ 
  quote, 
  onView 
}: { 
  quote: UserMeasurementWithDetails
  onView: () => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-slate-100 hover:bg-gradient-subtle transition-all duration-300 hover:shadow-inner-glow group">
      <div className="md:col-span-2">
        <div className="font-medium text-slate-900 truncate">
          {quote.product.name}
        </div>
        <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
          <Building className="h-3 w-3" />
          {quote.product.manufacturer.name}
        </div>
        <Badge variant="secondary" className="text-xs mt-1">
          {quote.product.category.name}
        </Badge>
      </div>
      
      <div className="text-sm">
        <div className="font-medium">
          {quote.measurements.width || 0} × {quote.measurements.height || 0}cm
        </div>
        <div className="text-slate-500">{quote.quantity || 1} units</div>
      </div>
      
      <div className="text-sm">
        <div className="font-medium text-gradient">
          {quote.calculated_price ? 
            quote.calculated_price.toLocaleString('tr-TR', { 
              style: 'currency', 
              currency: 'TRY' 
            }) : 
            'N/A'
          }
        </div>
      </div>
      
      <div className="text-sm text-slate-600">
        {format(new Date(quote.created_at), 'MMM dd, yyyy')}
      </div>
      
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="group-hover:bg-[#c6d3e1] group-hover:text-[#2d3e50] transition-all duration-300 hover:scale-105 px-3 py-2"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    </div>
  )
}

export function QuotesTable({
  quotes,
  isLoading,
  hasMore,
  onLoadMore,
  onViewQuote
}: QuotesTableProps) {
  // View mode state for future table/card toggle functionality
  // const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  if (isLoading && quotes.length === 0) {
    return (
      <div className="space-y-6">
        {/* Mobile/Card view loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <QuoteCardSkeleton key={i} />
          ))}
        </div>
        
        {/* Desktop/Table view loading */}
        <div className="hidden md:block bg-white rounded-lg border border-slate-200">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
            <div className="col-span-2">Product</div>
            <div>Dimensions</div>
            <div>Price</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <QuoteRowSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!isLoading && quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No quotes found</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          You haven&apos;t created any quotes yet, or none match your current filters. 
          Try adjusting your search criteria or create your first quote.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onView={() => onViewQuote(quote)}
          />
        ))}
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <QuoteCardSkeleton key={`loading-${i}`} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-lg overflow-hidden shadow-lg animate-slide-in-right">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-200 bg-gradient-subtle">
          <div className="col-span-2 text-sm font-medium text-slate-700">Product</div>
          <div className="text-sm font-medium text-slate-700">Dimensions</div>
          <div className="text-sm font-medium text-slate-700">Price</div>
          <div className="text-sm font-medium text-slate-700">Date</div>
          <div className="text-sm font-medium text-slate-700">Actions</div>
        </div>

        {/* Table Rows */}
        <div>
          {quotes.map((quote) => (
            <QuoteRow
              key={quote.id}
              quote={quote}
              onView={() => onViewQuote(quote)}
            />
          ))}
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <QuoteRowSkeleton key={`loading-${i}`} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-2 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300 hover:scale-105 hover:shadow-glow relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></span>
            <span className="relative z-10">
              {isLoading ? 'Loading...' : 'Load More Quotes'}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}