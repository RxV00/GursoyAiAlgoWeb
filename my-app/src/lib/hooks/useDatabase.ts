import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { 
  DatabaseManufacturer, 
  CategoryHierarchy,
  DatabaseProductCategory, 
  ProductWithDetails,
  DatabaseProduct,
  DatabaseProductVideo,
  DatabaseUserMeasurement,
  UserMeasurementWithDetails,
  ApiResponse
} from '@/lib/types/database'

// Utility function for API calls
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const data: ApiResponse<T> = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed')
  }
  
  return data.data!
}

// Manufacturer hooks
export function useManufacturers() {
  return useQuery<DatabaseManufacturer[]>({
    queryKey: ['manufacturers'],
    queryFn: () => fetchApi<DatabaseManufacturer[]>('/api/manufacturers'),
  })
}

export function useManufacturer(id: string) {
  return useQuery<DatabaseManufacturer>({
    queryKey: ['manufacturers', id],
    queryFn: () => fetchApi<DatabaseManufacturer>(`/api/manufacturers/${id}`),
    enabled: !!id,
  })
}

export function useManufacturerProducts(manufacturerId: string) {
  return useQuery<ProductWithDetails[]>({
    queryKey: ['manufacturers', manufacturerId, 'products'],
    queryFn: () => fetchApi<ProductWithDetails[]>(`/api/manufacturers/${manufacturerId}/products`),
    enabled: !!manufacturerId,
  })
}

// Category hooks
export function useCategories(options?: {
  hierarchy?: boolean
  parentId?: string
}) {
  const params = new URLSearchParams()
  if (options?.hierarchy) params.set('hierarchy', 'true')
  if (options?.parentId) params.set('parentId', options.parentId)

  const queryKey = options?.hierarchy 
    ? ['categories', 'hierarchy']
    : ['categories', { parentId: options?.parentId }]

  return useQuery<CategoryHierarchy[] | DatabaseProductCategory[]>({
    queryKey,
    queryFn: () => {
      const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`
      return options?.hierarchy 
        ? fetchApi<CategoryHierarchy[]>(url)
        : fetchApi<DatabaseProductCategory[]>(url)
    },
  })
}

export function useCategory(id: string, includeProducts?: boolean) {
  const params = new URLSearchParams()
  if (includeProducts) params.set('includeProducts', 'true')

  return useQuery<DatabaseProductCategory | CategoryHierarchy>({
    queryKey: ['categories', id, { includeProducts }],
    queryFn: () => {
      const url = `/api/categories/${id}${params.toString() ? `?${params.toString()}` : ''}`
      return fetchApi<DatabaseProductCategory | CategoryHierarchy>(url)
    },
    enabled: !!id,
  })
}

export function useCategoryProducts(categoryId: string, includeDetails?: boolean) {
  const params = new URLSearchParams()
  if (includeDetails) params.set('includeDetails', 'true')

  return useQuery<DatabaseProduct[] | ProductWithDetails[]>({
    queryKey: ['categories', categoryId, 'products', { includeDetails }],
    queryFn: () => {
      const url = `/api/categories/${categoryId}/products${params.toString() ? `?${params.toString()}` : ''}`
      return includeDetails 
        ? fetchApi<ProductWithDetails[]>(url)
        : fetchApi<DatabaseProduct[]>(url)
    },
    enabled: !!categoryId,
  })
}

// Product hooks
export function useProducts(options?: {
  includeDetails?: boolean
  categoryId?: string
  manufacturerId?: string
  search?: string
  hasVideos?: boolean
}) {
  const params = new URLSearchParams()
  if (options?.includeDetails) params.set('includeDetails', 'true')
  if (options?.categoryId) params.set('categoryId', options.categoryId)
  if (options?.manufacturerId) params.set('manufacturerId', options.manufacturerId)
  if (options?.search) params.set('search', options.search)
  if (options?.hasVideos !== undefined) params.set('hasVideos', options.hasVideos.toString())

  return useQuery<DatabaseProduct[] | ProductWithDetails[]>({
    queryKey: ['products', options],
    queryFn: () => {
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`
      return options?.includeDetails 
        ? fetchApi<ProductWithDetails[]>(url)
        : fetchApi<DatabaseProduct[]>(url)
    },
  })
}

export function useProduct(id: string, includeDetails?: boolean) {
  const params = new URLSearchParams()
  if (includeDetails === false) params.set('includeDetails', 'false')

  return useQuery<DatabaseProduct | ProductWithDetails>({
    queryKey: ['products', id, { includeDetails: includeDetails !== false }],
    queryFn: () => {
      const url = `/api/products/${id}${params.toString() ? `?${params.toString()}` : ''}`
      return includeDetails !== false
        ? fetchApi<ProductWithDetails>(url)
        : fetchApi<DatabaseProduct>(url)
    },
    enabled: !!id,
  })
}

// Convenience hook for product with details (most common use case)
export function useProductWithDetails(id: string) {
  return useProduct(id, true) as ReturnType<typeof useQuery<ProductWithDetails>>
}

// Video hooks
export function useProductVideos(productId: string) {
  return useQuery<DatabaseProductVideo[]>({
    queryKey: ['products', productId, 'videos'],
    queryFn: () => fetchApi<DatabaseProductVideo[]>(`/api/products/${productId}/videos`),
    enabled: !!productId,
  })
}

export function useAllVideos() {
  return useQuery<DatabaseProductVideo[]>({
    queryKey: ['videos'],
    queryFn: () => fetchApi<DatabaseProductVideo[]>('/api/videos'),
  })
}

export function useVideo(videoId: string) {
  return useQuery<DatabaseProductVideo>({
    queryKey: ['videos', videoId],
    queryFn: () => fetchApi<DatabaseProductVideo>(`/api/videos/${videoId}`),
    enabled: !!videoId,
  })
}

// Search hook
export function useSearchProducts(query: string, limit?: number) {
  const params = new URLSearchParams()
  params.set('q', query)
  if (limit) params.set('limit', limit.toString())

  return useQuery<{
    query: string
    results: ProductWithDetails[]
    count: number
  }>({
    queryKey: ['search', query, limit],
    queryFn: () => fetchApi<{
      query: string
      results: ProductWithDetails[]
      count: number
    }>(`/api/search?${params.toString()}`),
    enabled: !!query && query.trim().length >= 2,
  })
}

// User measurement hooks (require authentication)
export function useUserMeasurements(filters?: {
  productId?: string
  dateFrom?: string
  dateTo?: string
}) {
  const params = new URLSearchParams()
  if (filters?.productId) params.set('productId', filters.productId)
  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.set('dateTo', filters.dateTo)

  return useQuery<UserMeasurementWithDetails[]>({
    queryKey: ['user', 'measurements', filters],
    queryFn: () => {
      const url = `/api/user/measurements${params.toString() ? `?${params.toString()}` : ''}`
      return fetchApi<UserMeasurementWithDetails[]>(url)
    },
  })
}

export function useUserMeasurement(measurementId: string) {
  return useQuery<UserMeasurementWithDetails>({
    queryKey: ['user', 'measurements', measurementId],
    queryFn: () => fetchApi<UserMeasurementWithDetails>(`/api/user/measurements/${measurementId}`),
    enabled: !!measurementId,
  })
}

// User measurement mutations
export function useSaveUserMeasurement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      product_id: string
      measurements: Record<string, number>
      quantity?: number
    }) => {
      const response = await fetch('/api/user/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      
      const data: ApiResponse<DatabaseUserMeasurement> = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to save measurement')
      }
      
      return data.data!
    },
    onSuccess: () => {
      // Invalidate user measurements to refresh the list
      queryClient.invalidateQueries({ queryKey: ['user', 'measurements'] })
    },
  })
}

export function useUpdateUserMeasurement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      measurementId: string
      measurements: Record<string, number>
      quantity?: number
    }) => {
      const response = await fetch(`/api/user/measurements/${params.measurementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measurements: params.measurements,
          quantity: params.quantity,
        }),
      })
      
      const data: ApiResponse<DatabaseUserMeasurement> = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to update measurement')
      }
      
      return data.data!
    },
    onSuccess: (_, variables) => {
      // Invalidate specific measurement and list
      queryClient.invalidateQueries({ 
        queryKey: ['user', 'measurements', variables.measurementId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['user', 'measurements'] 
      })
    },
  })
}

export function useDeleteUserMeasurement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (measurementId: string) => {
      const response = await fetch(`/api/user/measurements/${measurementId}`, {
        method: 'DELETE',
      })
      
      const data: ApiResponse<{ message: string }> = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete measurement')
      }
      
      return data.data!
    },
    onSuccess: () => {
      // Invalidate user measurements to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['user', 'measurements'] 
      })
    },
  })
}

// Convenience hooks for common patterns
export function useProductsWithDetails(filters?: {
  categoryId?: string
  manufacturerId?: string
  search?: string
  hasVideos?: boolean
}) {
  return useProducts({ ...filters, includeDetails: true }) as ReturnType<
    typeof useQuery<ProductWithDetails[]>
  >
}

export function useCategoriesHierarchy() {
  return useCategories({ hierarchy: true }) as ReturnType<
    typeof useQuery<CategoryHierarchy[]>
  >
}