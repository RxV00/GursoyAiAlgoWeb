import { Metadata } from 'next'
import Link from 'next/link'
import { DatabaseService } from '@/lib/services/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ArrowRight, Layers, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Product Categories - Gursoylar Architectural Products',
  description: 'Explore our product categories including aluminum windows, plastic windows, doors, skylights, and more architectural solutions.',
  openGraph: {
    title: 'Product Categories - Gursoylar Architectural Products',
    description: 'Explore our comprehensive range of architectural product categories',
    type: 'website'
  }
}

// Revalidate every 5 minutes for public category catalog
export const revalidate = 300

export default async function CategoriesPage() {
  const db = new DatabaseService()
  
  // Fetch public category data
  const [categories, manufacturers] = await Promise.all([
    db.getCategoryHierarchy(),
    db.getManufacturers({ limit: 10 })
  ])

  // Get product counts per category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const products = await db.getProductsByCategory(category.id)
      return {
        ...category,
        productCount: products.length
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light text-slate-900 mb-6">
              Product <span className="font-semibold text-blue-900">Categories</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Browse our organized catalog of architectural products by category. 
              Find exactly what you need for your construction project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/products">
                  View All Products <Package className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/pricing">
                  Get Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Each category contains specialized products designed for specific 
              architectural needs and applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithCounts.map((category) => (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-medium text-slate-900 group-hover:text-blue-900 transition-colors mb-2">
                        {category.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-slate-500">
                        <Package className="w-4 h-4 mr-1" />
                        {category.productCount} products available
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {category.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    <Button 
                      asChild 
                      className="w-full group-hover:bg-blue-700 transition-colors"
                    >
                      <Link href={`/products?category=${category.id}`}>
                        Browse Products
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                    >
                      <Link href="/pricing">
                        Get Quote for {category.name}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturers Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-4">
              Trusted Manufacturers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We partner with leading manufacturers to bring you quality 
              architectural products you can rely on.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {manufacturers.map((manufacturer) => (
              <Card key={manufacturer.id} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    {manufacturer.name}
                  </h3>
                  {manufacturer.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {manufacturer.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-4">
              Why Choose Our Products?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Quality Materials</h3>
              <p className="text-slate-600">
                Premium materials sourced from trusted manufacturers ensure 
                long-lasting performance and durability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Custom Solutions</h3>
              <p className="text-slate-600">
                Tailored products designed to meet your specific architectural 
                requirements and design preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Instant Quotes</h3>
              <p className="text-slate-600">
                Get accurate pricing immediately with our advanced quoting system. 
                No waiting, no hidden costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Browse our complete product catalog or get an instant quote 
            for your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
              <Link href="/products">
                Browse All Products <Package className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg border-white text-white hover:bg-white hover:text-slate-900">
              <Link href="/pricing">
                Get Instant Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}