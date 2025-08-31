// Database Types for Supabase Integration
// This file contains all TypeScript interfaces matching the Supabase database schema

export interface DatabaseManufacturer {
  id: string
  name: string
  website?: string
  description?: string
  created_at: string
}

export interface DatabaseProductCategory {
  id: string
  name: string
  parent_id?: string
  description?: string
  created_at?: string
}

export interface DatabaseProduct {
  id: string
  category_id: string
  manufacturer_id: string
  name: string
  description?: string
  base_price?: number
  measurement_fields?: string[]
  created_at: string
}

export interface DatabaseProductVideo {
  id: string
  product_id: string
  title: string
  file_path: string
  uploaded_at: string
}

export interface DatabaseUserMeasurement {
  id: string
  user_id: string
  product_id: string
  measurements: Record<string, number> // JSONB as key-value pairs
  quantity?: number
  calculated_price?: number
  created_at: string
  updated_at: string
}

// Composite types for enhanced functionality

export interface CategoryHierarchy extends DatabaseProductCategory {
  children?: CategoryHierarchy[]
  products?: DatabaseProduct[]
}

export interface ProductWithDetails extends DatabaseProduct {
  manufacturer: DatabaseManufacturer
  category: DatabaseProductCategory
  videos?: DatabaseProductVideo[]
}

export interface UserMeasurementWithDetails extends DatabaseUserMeasurement {
  product: ProductWithDetails
}

// API Response types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ApiError {
  success: false
  error: string
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

// Quote calculation types

export interface QuoteResult {
  id: string
  product: ProductWithDetails
  measurements: Record<string, number>
  quantity: number
  calculated_price: number
  created_at: string
}

export interface MeasurementInput {
  width: number
  height: number
  quantity?: number
}

// Database query options

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface CategoryQueryOptions extends QueryOptions {
  includeChildren?: boolean
  includeProducts?: boolean
  parentId?: string
}

export interface ProductQueryOptions extends QueryOptions {
  categoryId?: string
  manufacturerId?: string
  includeDetails?: boolean
  includeVideos?: boolean
}

// Filter types for advanced queries

export interface ProductFilters {
  categoryIds?: string[]
  manufacturerIds?: string[]
  searchTerm?: string
  hasVideos?: boolean
  limit?: number
}

export interface MeasurementFilters {
  productId?: string
  dateFrom?: string
  dateTo?: string
}