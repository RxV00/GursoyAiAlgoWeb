import { createClient } from '@/lib/supabase/server'
import type { 
  DatabaseManufacturer, 
  DatabaseProductCategory, 
  DatabaseProduct,
  DatabaseProductVideo,
  DatabaseUserMeasurement,
  CategoryHierarchy,
  ProductWithDetails,
  UserMeasurementWithDetails,
  QueryOptions,
  CategoryQueryOptions,
  ProductQueryOptions,
  ProductFilters,
  MeasurementFilters
} from '@/lib/types/database'

export class DatabaseService {
  private async getSupabase() {
    return await createClient()
  }

  // Manufacturer methods
  async getManufacturers(options: QueryOptions = {}): Promise<DatabaseManufacturer[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('manufacturers')
      .select('*')

    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc' 
      })
    } else {
      query = query.order('name')
    }

    if (options.limit) query = query.limit(options.limit)
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 50))

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch manufacturers: ${error.message}`)
    return data || []
  }

  async getManufacturerById(id: string): Promise<DatabaseManufacturer | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch manufacturer: ${error.message}`)
    }

    return data
  }

  // Category methods
  async getCategories(options: CategoryQueryOptions = {}): Promise<DatabaseProductCategory[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('product_categories')
      .select('*')

    if (options.parentId) {
      query = query.eq('parent_id', options.parentId)
    }

    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc' 
      })
    } else {
      query = query.order('name')
    }

    if (options.limit) query = query.limit(options.limit)
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 50))

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`)
    return data || []
  }

  async getCategoryHierarchy(): Promise<CategoryHierarchy[]> {
    const categories = await this.getCategories()
    
    // Build hierarchy
    const categoryMap = new Map<string, CategoryHierarchy>()
    const rootCategories: CategoryHierarchy[] = []

    // First pass: create all category objects
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })

    // Second pass: build hierarchy
    categories.forEach(cat => {
      const categoryItem = categoryMap.get(cat.id)!
      
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(categoryItem)
        }
      } else {
        rootCategories.push(categoryItem)
      }
    })

    return rootCategories
  }

  async getCategoryById(id: string): Promise<DatabaseProductCategory | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch category: ${error.message}`)
    }

    return data
  }

  // Product methods
  async getProducts(options: ProductQueryOptions = {}): Promise<DatabaseProduct[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('products')
      .select('*')

    if (options.categoryId) query = query.eq('category_id', options.categoryId)
    if (options.manufacturerId) query = query.eq('manufacturer_id', options.manufacturerId)

    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc' 
      })
    } else {
      query = query.order('name')
    }

    if (options.limit) query = query.limit(options.limit)
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 50))

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return data || []
  }

  async getProductsByCategory(categoryId: string): Promise<DatabaseProduct[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('name')

    if (error) throw new Error(`Failed to fetch products by category: ${error.message}`)
    return data || []
  }

  async getProductsWithDetails(filters: ProductFilters = {}): Promise<ProductWithDetails[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:product_categories(*),
        videos:product_videos(*)
      `)

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      query = query.in('category_id', filters.categoryIds)
    }

    if (filters.manufacturerIds && filters.manufacturerIds.length > 0) {
      query = query.in('manufacturer_id', filters.manufacturerIds)
    }

    if (filters.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`)
    }

    query = query.order('name')

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch products with details: ${error.message}`)
    
    let results = (data || []) as ProductWithDetails[]

    // Filter by hasVideos if specified
    if (filters.hasVideos !== undefined) {
      results = results.filter(product => 
        filters.hasVideos ? 
          (product.videos && product.videos.length > 0) : 
          (!product.videos || product.videos.length === 0)
      )
    }

    return results
  }

  async getProductWithDetails(productId: string): Promise<ProductWithDetails | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:product_categories(*),
        videos:product_videos(*)
      `)
      .eq('id', productId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch product details: ${error.message}`)
    }

    return data as ProductWithDetails
  }

  async getProductById(id: string): Promise<DatabaseProduct | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return data
  }

  // Video methods
  async getProductVideos(productId: string): Promise<DatabaseProductVideo[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('product_videos')
      .select('*')
      .eq('product_id', productId)
      .order('uploaded_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch product videos: ${error.message}`)
    return data || []
  }

  async getAllProductVideos(): Promise<DatabaseProductVideo[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('product_videos')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch all videos: ${error.message}`)
    return data || []
  }

  async getVideoById(videoId: string): Promise<DatabaseProductVideo | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('product_videos')
      .select('*')
      .eq('id', videoId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch video: ${error.message}`)
    }

    return data
  }

  // User measurement methods (require authentication)
  async saveUserMeasurement(
    userId: string,
    productId: string,
    measurements: Record<string, number>,
    quantity: number = 1
  ): Promise<DatabaseUserMeasurement> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_measurements')
      .insert({
        user_id: userId,
        product_id: productId,
        measurements,
        quantity
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to save user measurement: ${error.message}`)
    return data
  }

  async getUserMeasurements(userId: string, filters: MeasurementFilters = {}): Promise<UserMeasurementWithDetails[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('user_measurements')
      .select(`
        *,
        product:products(
          *,
          manufacturer:manufacturers(*),
          category:product_categories(*),
          videos:product_videos(*)
        )
      `)
      .eq('user_id', userId)

    if (filters.productId) query = query.eq('product_id', filters.productId)
    if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom)
    if (filters.dateTo) query = query.lte('created_at', filters.dateTo)

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch user measurements: ${error.message}`)
    return (data || []) as UserMeasurementWithDetails[]
  }

  async getUserMeasurementById(
    userId: string, 
    measurementId: string
  ): Promise<UserMeasurementWithDetails | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_measurements')
      .select(`
        *,
        product:products(
          *,
          manufacturer:manufacturers(*),
          category:product_categories(*),
          videos:product_videos(*)
        )
      `)
      .eq('id', measurementId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to fetch user measurement: ${error.message}`)
    }

    return data as UserMeasurementWithDetails
  }

  async updateUserMeasurement(
    userId: string,
    measurementId: string,
    measurements: Record<string, number>,
    quantity?: number
  ): Promise<DatabaseUserMeasurement> {
    const updateData: { 
      measurements: Record<string, number>
      updated_at: string
      quantity?: number
    } = { 
      measurements, 
      updated_at: new Date().toISOString() 
    }
    if (quantity !== undefined) updateData.quantity = quantity

    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_measurements')
      .update(updateData)
      .eq('id', measurementId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user measurement: ${error.message}`)
    return data
  }

  async deleteUserMeasurement(userId: string, measurementId: string): Promise<void> {
    const supabase = await this.getSupabase()
    const { error } = await supabase
      .from('user_measurements')
      .delete()
      .eq('id', measurementId)
      .eq('user_id', userId)

    if (error) throw new Error(`Failed to delete user measurement: ${error.message}`)
  }

  async getUserMeasurementsByProduct(
    userId: string, 
    productId: string
  ): Promise<DatabaseUserMeasurement[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_measurements')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch product measurements: ${error.message}`)
    return data || []
  }

  // Utility methods
  async searchProducts(searchTerm: string, limit?: number): Promise<ProductWithDetails[]> {
    const results = await this.getProductsWithDetails({
      searchTerm,
    })
    
    // Apply limit if specified
    return limit ? results.slice(0, limit) : results
  }

  async getProductsByManufacturer(manufacturerId: string): Promise<ProductWithDetails[]> {
    return this.getProductsWithDetails({
      manufacturerIds: [manufacturerId]
    })
  }

  async getCategoryWithProducts(categoryId: string): Promise<CategoryHierarchy | null> {
    const category = await this.getCategoryById(categoryId)
    if (!category) return null

    const products = await this.getProductsByCategory(categoryId)
    
    return {
      ...category,
      products
    }
  }
}