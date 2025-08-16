import { Metadata } from 'next'
import Link from 'next/link'
import { DatabaseService } from '@/lib/services/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products - Gursoylar Architectural Products',
  description: 'Browse our complete catalog of custom windows, doors, and skylights. Quality architectural products for modern construction.',
  openGraph: {
    title: 'Products - Gursoylar Architectural Products',
    description: 'Browse our complete catalog of custom windows, doors, and skylights',
    type: 'website'
  }
}

// Revalidate every 5 minutes for public product catalog
export const revalidate = 300

export default async function ProductsPage() {
  const db = new DatabaseService()
  
  // Fetch public product data (no pricing or sensitive info)
  const [products, categories, manufacturers] = await Promise.all([
    db.getProductsWithDetails({ limit: 50 }),
    db.getCategoryHierarchy(),
    db.getManufacturers({ limit: 20 })
  ])

  // Group products by category for display
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light text-slate-900 mb-6">
              Architectural <span className="font-semibold text-blue-900">Product Catalog</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Discover our comprehensive range of custom windows, doors, and skylights. 
              Quality craftsmanship meets modern design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/pricing">
                  Get Instant Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/categories">
                  Browse Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">{products.length}+</div>
              <div className="text-slate-600">Product Variants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">{categories.length}</div>
              <div className="text-slate-600">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">{manufacturers.length}</div>
              <div className="text-slate-600">Trusted Manufacturers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
            <div key={categoryName} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-light text-slate-900">
                  {categoryName}
                </h2>
                <span className="text-slate-500 text-sm">
                  {categoryProducts.length} products
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.slice(0, 6).map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-medium text-slate-900 group-hover:text-blue-900 transition-colors">
                            {product.name}
                          </CardTitle>
                          <p className="text-sm text-slate-500 mt-1">
                            {product.manufacturer.name}
                          </p>
                        </div>
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {product.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {product.category.name}
                        </div>
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-blue-50 group-hover:border-blue-200"
                        >
                          <Link href="/pricing">
                            Get Quote
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Product videos indicator */}
                      {product.videos && product.videos.length > 0 && (
                        <div className="mt-3 text-xs text-blue-600 flex items-center">
                          <Package className="w-3 h-3 mr-1" />
                          Video available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {categoryProducts.length > 6 && (
                <div className="text-center mt-8">
                  <Button variant="outline" asChild>
                    <Link href={`/categories`}>
                      View All {categoryName} Products ({categoryProducts.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get instant quotes for any of our products. Simply select your product 
            and provide measurements for accurate pricing.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
            <Link href="/pricing">
              Start Your Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}