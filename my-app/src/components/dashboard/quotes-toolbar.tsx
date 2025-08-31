'use client'

import { useState } from 'react'
import { Search, Download, SlidersHorizontal, X, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface QuotesToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
  onExportCSV: () => void
  totalCount: number
  isLoading?: boolean
}

// Desktop Filter Component
function DesktopFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  isOpen,
  onOpenChange
}: {
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const activeFiltersCount = [dateFrom, dateTo].filter(Boolean).length

  const clearFilters = () => {
    onDateFromChange(undefined)
    onDateToChange(undefined)
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300"
          aria-label={`Filters${activeFiltersCount > 0 ? ` (${activeFiltersCount} active)` : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 glass-card border-0 shadow-glow" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm text-slate-900">Filter Quotes</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 h-auto"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-2 block">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <CalendarDays className="mr-2 h-3.5 w-3.5" />
                        {dateFrom ? format(dateFrom, 'MMM dd') : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={onDateFromChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <CalendarDays className="mr-2 h-3.5 w-3.5" />
                        {dateTo ? format(dateTo, 'MMM dd') : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={onDateToChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {(dateFrom || dateTo) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex gap-1">
                  {dateFrom && (
                    <Badge variant="secondary" className="text-xs">
                      From {format(dateFrom, 'MMM dd, yyyy')}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-3 w-3 p-0"
                        onClick={() => onDateFromChange(undefined)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </Badge>
                  )}
                  {dateTo && (
                    <Badge variant="secondary" className="text-xs">
                      To {format(dateTo, 'MMM dd, yyyy')}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-3 w-3 p-0"
                        onClick={() => onDateToChange(undefined)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Mobile Filter Component
function MobileFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  isOpen,
  onOpenChange
}: {
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const activeFiltersCount = [dateFrom, dateTo].filter(Boolean).length

  const clearFilters = () => {
    onDateFromChange(undefined)
    onDateToChange(undefined)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300"
          aria-label={`Filters${activeFiltersCount > 0 ? ` (${activeFiltersCount} active)` : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="glass-card border-0 shadow-glow">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center justify-between">
            Filter Quotes
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-slate-600 hover:text-slate-900"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          <div>
            <label className="text-sm font-medium text-slate-900 mb-3 block">
              Date Range
            </label>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 mb-2 block">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={onDateFromChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs text-slate-600 mb-2 block">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={onDateToChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {(dateFrom || dateTo) && (
            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs text-slate-600 mb-2 block">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {dateFrom && (
                  <Badge variant="secondary" className="text-xs">
                    From {format(dateFrom, 'MMM dd, yyyy')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => onDateFromChange(undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {dateTo && (
                  <Badge variant="secondary" className="text-xs">
                    To {format(dateTo, 'MMM dd, yyyy')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => onDateToChange(undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function QuotesToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExportCSV,
  totalCount,
  isLoading = false
}: QuotesToolbarProps) {
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  return (
    <div className="glass-card rounded-lg p-6 mb-6 shadow-lg animate-slide-in-left">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search quotes by product, manufacturer, or category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="updated_at">Last Updated</SelectItem>
              <SelectItem value="calculated_price">Price</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300 hover:scale-105"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Responsive Filters */}
        <div className="hidden md:block">
          <DesktopFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            isOpen={isDesktopFiltersOpen}
            onOpenChange={setIsDesktopFiltersOpen}
          />
        </div>
        <div className="block md:hidden">
          <MobileFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            isOpen={isMobileFiltersOpen}
            onOpenChange={setIsMobileFiltersOpen}
          />
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCSV}
          disabled={totalCount === 0 || isLoading}
          className="gap-2 px-3 py-2 hover:bg-[#c6d3e1] hover:text-[#2d3e50] transition-all duration-300 hover:scale-105 hover:shadow-glow relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></span>
          <Download className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Export CSV</span>
        </Button>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-slate-600">
        {totalCount > 0 ? (
          `${totalCount} quote${totalCount === 1 ? '' : 's'} found`
        ) : (
          'No quotes found'
        )}
      </div>
    </div>
  )
}