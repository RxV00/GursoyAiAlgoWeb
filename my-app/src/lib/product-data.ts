export interface ProductType {
  id: string
  name: string
  basePrice: number
  measurementFields: string[]
}

export interface BrandProducts {
  brandId: string
  brandName: string
  products: ProductType[]
}

export interface WindowType {
  id: string
  name: string
  brands: BrandProducts[]
}

export interface ProductCategory {
  id: string
  name: string
  windowTypes?: WindowType[]
  products?: ProductType[]
}

export const productCategories: ProductCategory[] = [
  {
    id: 'aluminum',
    name: 'Alüminyum Pencere',
    windowTypes: [
      {
        id: 'surmeli',
        name: 'Sürmeli Pencere',
        brands: [
          {
            brandId: 'cortizo',
            brandName: 'Cortizo',
            products: [
              { id: 'cortizo-copision', name: 'Copision', basePrice: 300, measurementFields: ['width',
'height'] },
              { id: 'cortizo-copision-plus', name: 'Copision Plus', basePrice: 320, measurementFields:
['width', 'height'] },
              { id: 'cortizo-hebeschiebe', name: 'Hebeschiebe', basePrice: 340, measurementFields: ['width',
'height'] }
            ]
          },
          {
            brandId: 'asisim',
            brandName: 'Asisim',
            products: [
              { id: 'asisim-copision', name: 'Copision', basePrice: 290, measurementFields: ['width', 'height']
},
              { id: 'asisim-copision-plus', name: 'Copision Plus', basePrice: 310, measurementFields: ['width',
'height'] },
              { id: 'asisim-hebeschiebe', name: 'Hebeschiebe', basePrice: 330, measurementFields: ['width',
'height'] }
            ]
          }
        ]
      },
      {
        id: 'klasik',
        name: 'Klasik Pencere',
        brands: [
          {
            brandId: 'cortizo',
            brandName: 'Cortizo',
            products: [
              { id: 'cortizo-klasik-standart', name: 'Standart Klasik', basePrice: 280, measurementFields:
['width', 'height'] },
              { id: 'cortizo-klasik-premium', name: 'Premium Klasik', basePrice: 320, measurementFields:
['width', 'height'] }
            ]
          },
          {
            brandId: 'asisim',
            brandName: 'Asisim',
            products: [
              { id: 'asisim-klasik-standart', name: 'Standart Klasik', basePrice: 270, measurementFields:
['width', 'height'] },
              { id: 'asisim-klasik-premium', name: 'Premium Klasik', basePrice: 300, measurementFields:
['width', 'height'] }
            ]
          }
        ]
      },
      {
        id: 'katlanir',
        name: 'Katlanır Kapılı Pencere',
        brands: [
          {
            brandId: 'cortizo',
            brandName: 'Cortizo',
            products: [
              { id: 'cortizo-katlanir-standart', name: 'Standart Katlanır', basePrice: 350, measurementFields:
['width', 'height'] },
              { id: 'cortizo-katlanir-premium', name: 'Premium Katlanır', basePrice: 380, measurementFields:
['width', 'height'] }
            ]
          },
          {
            brandId: 'asisim',
            brandName: 'Asisim',
            products: [
              { id: 'asisim-katlanir-standart', name: 'Standart Katlanır', basePrice: 340, measurementFields:
['width', 'height'] },
              { id: 'asisim-katlanir-premium', name: 'Premium Katlanır', basePrice: 370, measurementFields:
['width', 'height'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'plastic',
    name: 'Plastik Pencere',
    windowTypes: [
      {
        id: 'surmeli',
        name: 'Sürmeli Pencere',
        brands: [
          {
            brandId: 'rehau',
            brandName: 'Rehau',
            products: [
              { id: 'rehau-copision', name: 'Copision', basePrice: 200, measurementFields: ['width', 'height']
},
              { id: 'rehau-copision-plus', name: 'Copision Plus', basePrice: 220, measurementFields: ['width',
'height'] },
              { id: 'rehau-hebeschiebe', name: 'Hebeschiebe', basePrice: 240, measurementFields: ['width',
'height'] }
            ]
          }
        ]
      },
      {
        id: 'klasik',
        name: 'Klasik Pencere',
        brands: [
          {
            brandId: 'rehau',
            brandName: 'Rehau',
            products: [
              { id: 'rehau-klasik-standart', name: 'Standart Klasik', basePrice: 180, measurementFields:
['width', 'height'] },
              { id: 'rehau-klasik-premium', name: 'Premium Klasik', basePrice: 210, measurementFields:
['width', 'height'] }
            ]
          }
        ]
      },
      {
        id: 'katlanir',
        name: 'Katlanır Kapılı Pencere',
        brands: [
          {
            brandId: 'rehau',
            brandName: 'Rehau',
            products: [
              { id: 'rehau-katlanir-standart', name: 'Standart Katlanır', basePrice: 250, measurementFields:
['width', 'height'] },
              { id: 'rehau-katlanir-premium', name: 'Premium Katlanır', basePrice: 280, measurementFields:
['width', 'height'] }
            ]
          }
        ]
      }
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
    if (category.windowTypes) {
      for (const windowType of category.windowTypes) {
        for (const brand of windowType.brands) {
          const product = brand.products.find((p) => p.id === id)
          if (product) return product
        }
      }
    }
    if (category.products) {
      const product = category.products.find((p) => p.id === id)
      if (product) return product
    }
  }
  return null
}