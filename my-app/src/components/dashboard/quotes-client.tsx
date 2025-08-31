'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuotesToolbar } from '@/components/dashboard/quotes-toolbar'
import { QuotesTable } from '@/components/dashboard/quotes-table'
import type { UserMeasurementWithDetails } from '@/lib/types/database'

interface QuotesResponse {
  success: boolean
  data: UserMeasurementWithDetails[]
  total: number
  hasMore: boolean
  offset: number
  limit: number
}

interface QuotesClientProps {
  initialData: UserMeasurementWithDetails[]
  initialTotal: number
  initialHasMore: boolean
}

export function QuotesClient({ 
  initialData, 
  initialTotal, 
  initialHasMore 
}: QuotesClientProps) {
  // State for quotes data
  const [quotes, setQuotes] = useState<UserMeasurementWithDetails[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [total, setTotal] = useState(initialTotal)
  const [offset, setOffset] = useState(20) // Initial offset after first load
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

  // Use refs to access current values without causing re-renders
  const currentFiltersRef = useRef({
    searchQuery: '',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    offset: 20
  })

  // Update refs when state changes
  useEffect(() => {
    currentFiltersRef.current = {
      searchQuery,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      offset
    }
  }, [searchQuery, sortBy, sortOrder, dateFrom, dateTo, offset])

  // Create a stable fetch function
  const fetchQuotes = useCallback(async (
    resetOffset = false, 
    isManualRefresh = false
  ) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    
    const filters = currentFiltersRef.current
    const currentOffset = resetOffset ? 0 : filters.offset
    const params = new URLSearchParams({
      limit: '20',
      offset: currentOffset.toString(),
      sort: filters.sortBy,
      order: filters.sortOrder,
    })

    if (filters.searchQuery.trim()) params.append('q', filters.searchQuery.trim())
    if (filters.dateFrom) params.append('from', filters.dateFrom.toISOString().split('T')[0])
    if (filters.dateTo) params.append('to', filters.dateTo.toISOString().split('T')[0])

    try {
      const response = await fetch(`/api/user/measurements?${params}`, {
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quotes')
      }

      const result: QuotesResponse = await response.json()
      
      if (result.success) {
        if (resetOffset || isManualRefresh) {
          setQuotes(result.data)
          setOffset(result.limit)
        } else {
          setQuotes(prev => [...prev, ...result.data])
          setOffset(prev => prev + result.limit)
        }
        
        setHasMore(result.hasMore)
        setTotal(result.total)
      } else {
        console.error('API returned error:', result)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    setOffset(0)
    fetchQuotes(true, true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchQuotes(false, false)
    }
  }, [isLoading, hasMore]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewQuote = useCallback((quote: UserMeasurementWithDetails) => {
    console.log('View quote:', quote)
    // Could implement: router.push(`/dashboard/quotes/${quote.id}`)
  }, [])

  const handleExportCSV = useCallback(() => {
    // Generate CSV data
    const csvHeaders = [
      'Date',
      'Product Name',
      'Manufacturer',
      'Category',
      'Width (cm)',
      'Height (cm)',
      'Quantity',
      'Price (TRY)'
    ]

    const csvData = quotes.map(quote => [
      new Date(quote.created_at).toLocaleDateString(),
      quote.product.name,
      quote.product.manufacturer.name,
      quote.product.category.name,
      quote.measurements.width || 0,
      quote.measurements.height || 0,
      quote.quantity || 1,
      quote.calculated_price || 0
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `quotes-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [quotes])

  // Debounced search effect
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  
  useEffect(() => {
    // Skip search on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Always search when query changes (including clearing it)
    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0)
      fetchQuotes(true, false)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handler for search changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
    setOffset(0)
    fetchQuotes(true, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSortOrderChange = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order)
    setOffset(0)
    fetchQuotes(true, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateFromChange = useCallback((date: Date | undefined) => {
    setDateFrom(date)
    setOffset(0)
    fetchQuotes(true, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateToChange = useCallback((date: Date | undefined) => {
    setDateTo(date)
    setOffset(0)
    fetchQuotes(true, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-subtle relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Page Header with Refresh Button */}
        <div className="mb-8 animate-slide-in-left">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-light text-slate-900">
              My <span className="text-gradient font-semibold">Quotes</span>
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <p className="text-slate-600">
            Browse, search, and manage all your product quotes in one place.
          </p>
        </div>

        {/* Toolbar */}
        <QuotesToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
          onExportCSV={handleExportCSV}
          totalCount={total}
          isLoading={isLoading || isRefreshing}
        />

        {/* Quotes Table */}
        <QuotesTable
          quotes={quotes}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onViewQuote={handleViewQuote}
        />
      </div>
    </div>
  )
}