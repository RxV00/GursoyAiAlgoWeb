export interface ProductType {
    id: string
    name: string
    basePrice: number
    measurementFields: string[]
  }
  
  export interface Brand {
    id: string
    name: string
    products: ProductType[]
  }
  
  export interface ProductCategory {
    id: string
    name: string
    brands?: Brand[]
    products?: ProductType[]
  }
  
  export const productCategories: ProductCategory[] = [
    {
      id: 'aluminum',
      name: 'Alüminyum Pencere',
      brands: [
        {
          id: 'cortizo',
          name: 'Cortizo',
          products: [
            { id: 'cortizo-copision', name: 'Copision', basePrice: 300, measurementFields: ['width', 'height'] },
            { id: 'cortizo-copision-plus', name: 'Copision Plus', basePrice: 320, measurementFields: ['width', 'height'] },
            { id: 'cortizo-hebeschiebe', name: 'Hebeschiebe', basePrice: 340, measurementFields: ['width', 'height'] }
          ]
        },
        {
          id: 'asisim',
          name: 'Asisim',
          products: [
            { id: 'asisim-copision', name: 'Copision', basePrice: 290, measurementFields: ['width', 'height'] },
            { id: 'asisim-copision-plus', name: 'Copision Plus', basePrice: 310, measurementFields: ['width', 'height'] },
            { id: 'asisim-hebeschiebe', name: 'Hebeschiebe', basePrice: 330, measurementFields: ['width', 'height'] }
          ]
        }
      ]
    },
    {
      id: 'klasik',
      name: 'Klasik Pencere',
      products: [
        { id: 'cor70', name: 'Cor 70', basePrice: 250, measurementFields: ['width', 'height'] },
        { id: 'katlanir', name: 'Katlanır Kapalı Pencere', basePrice: 270, measurementFields: ['width', 'height'] },
        { id: 'dışkapi', name: 'Dış Kapı', basePrice: 300, measurementFields: ['width', 'height'] }
      ]
    },
    {
      id: 'rehau',
      name: 'Rehau Plastik Pencere',
      products: [
        { id: 'rehau-copision', name: 'Copision', basePrice: 200, measurementFields: ['width', 'height'] },
        { id: 'rehau-copision-plus', name: 'Copision Plus', basePrice: 220, measurementFields: ['width', 'height'] },
        { id: 'rehau-hebeschiebe', name: 'Hebeschiebe', basePrice: 240, measurementFields: ['width', 'height'] }
      ]
    },
    {
      id: 'others',
      name: 'Diğer Ürünler',
      products: [
        { id: 'panjur', name: 'Panjur', basePrice: 150, measurementFields: ['width', 'height'] },
        { id: 'zip-perde', name: 'Zip Perde', basePrice: 100, measurementFields: ['width', 'height'] },
        { id: 'giyotin', name: 'Giyotin Pencere', basePrice: 180, measurementFields: ['width', 'height'] },
        { id: 'pergola', name: 'Pergola', basePrice: 350, measurementFields: ['width', 'height'] },
        { id: 'kışbahcesi', name: 'Kışbahçesi', basePrice: 400, measurementFields: ['width', 'height'] },
        { id: 'gunes-kirici', name: 'Güneş Kırıcı', basePrice: 200, measurementFields: ['width', 'height'] }
      ]
    }
  ]
  
  export function getProductById(id: string): ProductType | null {
    for (const category of productCategories) {
      if (category.brands) {
        for (const brand of category.brands) {
          const product = brand.products.find((p) => p.id === id)
          if (product) return product
        }
      }
      if (category.products) {
        const product = category.products.find((p) => p.id === id)
        if (product) return product
      }
    }
    return null
  }