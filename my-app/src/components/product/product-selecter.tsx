import { useState } from "react"
import { Check, ChevronRight, Play, Video } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const productCategories = [
  {
    id: "windows",
    name: "Pencere Sistemleri",
    windowTypes: [
      {
        id: "sliding",
        name: "Sürme Sistemler",
        brands: [
          {
            brandId: "cortizo",
            brandName: "Cortizo",
            products: [
              { id: "cortizo-copision", name: "Copision Sürme" },
              { id: "cortizo-copision-plus", name: "Copision Plus" },
              { id: "cortizo-hebeschiebe", name: "Hebeschiebe" },
            ],
          },
          {
            brandId: "asisim",
            brandName: "Asisim",
            products: [
              { id: "asisim-copision", name: "Copision Sürme" },
              { id: "asisim-copision-plus", name: "Copision Plus" },
            ],
          },
        ],
      },
      {
        id: "classic",
        name: "Klasik Sistemler",
        brands: [
          {
            brandId: "rehau",
            brandName: "Rehau",
            products: [
              { id: "rehau-klasik-standart", name: "Klasik Standart" },
              { id: "rehau-klasik-premium", name: "Klasik Premium" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "outdoor",
    name: "Dış Mekan Sistemleri",
    products: [
      { id: "panjur", name: "Panjur Sistemleri" },
      { id: "zip-perde", name: "Zip Perde" },
      { id: "pergola", name: "Pergola" },
      { id: "gunes-kirici", name: "Güneş Kırıcı" },
    ],
  },
]

interface ProductSelectorProps {
  onProductSelect: (productId: string) => void
  selectedProduct: string | null
}

export function ProductSelector({ onProductSelect, selectedProduct }: ProductSelectorProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [openWindowTypes, setOpenWindowTypes] = useState<string[]>([])
  const [openBrands, setOpenBrands] = useState<string[]>([])
  const [openProducts, setOpenProducts] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleWindowType = (windowTypeId: string) => {
    setOpenWindowTypes((prev) =>
      prev.includes(windowTypeId) ? prev.filter((id) => id !== windowTypeId) : [...prev, windowTypeId],
    )
  }

  const toggleBrand = (brandId: string) => {
    setOpenBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const toggleProduct = (productId: string) => {
    setOpenProducts((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const getExampleVideos = (productId: string) => {
    // Mock video data
    return [`Demo Video 1 - ${productId}`, `Demo Video 2 - ${productId}`]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="space-y-2 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 font-inter"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {productCategories.map((category) => {
        const isCategoryOpen = openCategories.includes(category.id)
        return (
          <motion.div key={category.id} variants={itemVariants}>
            <Collapsible open={isCategoryOpen} onOpenChange={() => toggleCategory(category.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-500 rounded-xl group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full group-hover:h-10 transition-all duration-300" />
                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 tracking-tight">
                      {category.name}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isCategoryOpen ? 90 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="text-slate-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.div>
                </Button>
              </CollapsibleTrigger>

              <AnimatePresence>
                {isCategoryOpen && (
                  <CollapsibleContent asChild>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      {category.windowTypes ? (
                        <div className="space-y-3 ml-6">
                          {category.windowTypes.map((windowType) => {
                            const isWindowTypeOpen = openWindowTypes.includes(windowType.id)
                            return (
                              <Collapsible
                                key={windowType.id}
                                open={isWindowTypeOpen}
                                onOpenChange={() => toggleWindowType(windowType.id)}
                              >
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between p-4 h-auto bg-white/70 border border-slate-200 hover:bg-white/90 hover:shadow-md hover:border-blue-200 transition-all duration-400 rounded-xl group hover:scale-[1.01] active:scale-[0.99]"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full group-hover:h-8 group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300" />
                                      <span className="font-semibold text-base text-slate-700 group-hover:text-slate-900 transition-colors duration-300 tracking-tight">
                                        {windowType.name}
                                      </span>
                                    </div>
                                    <motion.div
                                      animate={{ rotate: isWindowTypeOpen ? 90 : 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="text-slate-400 group-hover:text-slate-600 group-hover:scale-105 transition-all duration-300"
                                    >
                                      <ChevronRight className="h-5 w-5" />
                                    </motion.div>
                                  </Button>
                                </CollapsibleTrigger>

                                <AnimatePresence>
                                  {isWindowTypeOpen && (
                                    <CollapsibleContent asChild>
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="mt-3 space-y-2 ml-4 overflow-hidden"
                                      >
                                        {windowType.brands.map((brand) => {
                                          const brandKey = `${windowType.id}-${brand.brandId}`
                                          const isBrandOpen = openBrands.includes(brandKey)
                                          return (
                                            <Collapsible
                                              key={brandKey}
                                              open={isBrandOpen}
                                              onOpenChange={() => toggleBrand(brandKey)}
                                            >
                                              <CollapsibleTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  className="w-full justify-between p-3 h-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md hover:border-blue-300 transition-all duration-400 rounded-xl group hover:scale-[1.01] active:scale-[0.99]"
                                                >
                                                  <div className="flex items-center space-x-3">
                                                    <Badge
                                                      variant="secondary"
                                                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium text-sm px-2 py-1 group-hover:scale-105 transition-all duration-300"
                                                    >
                                                      {brand.brandName}
                                                    </Badge>
                                                  </div>
                                                  <motion.div
                                                    animate={{ rotate: isBrandOpen ? 90 : 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="text-blue-400 group-hover:text-blue-600 group-hover:scale-105 transition-all duration-300"
                                                  >
                                                    <ChevronRight className="h-5 w-5" />
                                                  </motion.div>
                                                </Button>
                                              </CollapsibleTrigger>

                                              <AnimatePresence>
                                                {isBrandOpen && (
                                                  <CollapsibleContent asChild>
                                                    <motion.div
                                                      initial={{ opacity: 0, height: 0 }}
                                                      animate={{ opacity: 1, height: "auto" }}
                                                      exit={{ opacity: 0, height: 0 }}
                                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                                      className="mt-2 space-y-2 ml-4 overflow-hidden"
                                                    >
                                                      {brand.products.map((product) => {
                                                        const isProductOpen = openProducts.includes(product.id)
                                                        const productVideos = getExampleVideos(product.id)
                                                        const isSelected = selectedProduct === product.id

                                                        return (
                                                          <motion.div
                                                            key={product.id}
                                                            className="space-y-2"
                                                            whileHover={{ scale: 1.01 }}
                                                            transition={{ duration: 0.2 }}
                                                          >
                                                            <div className="flex items-center space-x-2">
                                                              <motion.button
                                                                onClick={() => onProductSelect(product.id)}
                                                                className={cn(
                                                                  "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-400 group font-medium",
                                                                  isSelected
                                                                    ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02]"
                                                                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
                                                                )}
                                                                whileTap={{ scale: 0.97 }}
                                                                whileHover={{ y: -2 }}
                                                                transition={{ duration: 0.2 }}
                                                              >
                                                                <span
                                                                  className={cn(
                                                                    "font-semibold text-sm transition-colors duration-300 tracking-tight",
                                                                    isSelected
                                                                      ? "text-blue-700"
                                                                      : "text-slate-700 group-hover:text-blue-600",
                                                                  )}
                                                                >
                                                                  {product.name}
                                                                </span>
                                                                {isSelected && (
                                                                  <motion.div
                                                                    initial={{ scale: 0, rotate: -180 }}
                                                                    animate={{ scale: 1, rotate: 0 }}
                                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                                  >
                                                                    <Check className="h-5 w-5 text-blue-600" />
                                                                  </motion.div>
                                                                )}
                                                              </motion.button>

                                                              {productVideos.length > 0 && (
                                                                <motion.div
                                                                  whileHover={{ scale: 1.1, y: -2 }}
                                                                  whileTap={{ scale: 0.9 }}
                                                                  transition={{ duration: 0.2 }}
                                                                >
                                                                  <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => toggleProduct(product.id)}
                                                                    className={cn(
                                                                      "px-2 py-2 h-auto border-2 transition-all duration-300 font-medium",
                                                                      isProductOpen
                                                                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md"
                                                                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm",
                                                                    )}
                                                                  >
                                                                    <Video className="h-4 w-4" />
                                                                  </Button>
                                                                </motion.div>
                                                              )}
                                                            </div>

                                                            <AnimatePresence>
                                                              {isProductOpen && productVideos.length > 0 && (
                                                                <motion.div
                                                                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                                                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                                                                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                                                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl ml-4 border border-blue-200 shadow-sm overflow-hidden"
                                                                >
                                                                  <div className="flex items-center space-x-2 mb-3">
                                                                    <Video className="h-4 w-4 text-blue-600" />
                                                                    <h6 className="text-sm font-bold text-blue-800 tracking-tight">
                                                                      {product.name} - Örnek Videolar
                                                                    </h6>
                                                                  </div>
                                                                  <div className="grid grid-cols-1 gap-2">
                                                                    {productVideos.map((video, index) => (
                                                                      <motion.div
                                                                        key={index}
                                                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        transition={{
                                                                          duration: 0.4,
                                                                          delay: index * 0.1,
                                                                          ease: "easeOut",
                                                                        }}
                                                                        className="relative bg-white rounded-xl aspect-video flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer border border-blue-200 group shadow-sm hover:shadow-lg"
                                                                        whileHover={{ scale: 1.03, y: -4 }}
                                                                        whileTap={{ scale: 0.97 }}
                                                                      >
                                                                        <div className="flex flex-col items-center space-y-3">
                                                                          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                                                                            <Play className="h-7 w-7 text-blue-600 ml-1" />
                                                                          </div>
                                                                          <span className="text-sm font-semibold text-blue-700 tracking-tight">
                                                                            Video {index + 1}
                                                                          </span>
                                                                        </div>
                                                                        <div className="absolute top-3 right-3">
                                                                          <Badge
                                                                            variant="secondary"
                                                                            className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 group-hover:scale-105 transition-all duration-300"
                                                                          >
                                                                            Demo
                                                                          </Badge>
                                                                        </div>
                                                                      </motion.div>
                                                                    ))}
                                                                  </div>
                                                                </motion.div>
                                                              )}
                                                            </AnimatePresence>
                                                          </motion.div>
                                                        )
                                                      })}
                                                    </motion.div>
                                                  </CollapsibleContent>
                                                )}
                                              </AnimatePresence>
                                            </Collapsible>
                                          )
                                        })}
                                      </motion.div>
                                    </CollapsibleContent>
                                  )}
                                </AnimatePresence>
                              </Collapsible>
                            )
                          })}
                        </div>
                      ) : (
                                                  <div className="space-y-2 ml-6">
                          <Collapsible
                            open={openWindowTypes.includes(category.id)}
                            onOpenChange={() => toggleWindowType(category.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between p-3 h-auto bg-white/60 border border-slate-200 hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg group"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-1.5 h-5 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full" />
                                  <span className="font-medium text-slate-700 group-hover:text-slate-900">Ürünler</span>
                                </div>
                                <motion.div
                                  animate={{ rotate: openWindowTypes.includes(category.id) ? 90 : 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="text-slate-400 group-hover:text-slate-600"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </CollapsibleTrigger>

                            <AnimatePresence>
                              {openWindowTypes.includes(category.id) && (
                                <CollapsibleContent asChild>
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                            className="mt-2 space-y-2 ml-4 overflow-hidden"
                                      >
                                        {category.products?.map((product) => {
                                          const isProductOpen = openProducts.includes(product.id)
                                          const productVideos = getExampleVideos(product.id)
                                          const isSelected = selectedProduct === product.id

                                          return (
                                            <motion.div
                                              key={product.id}
                                              className="space-y-1"
                                              whileHover={{ scale: 1.01 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                          <div className="flex items-center space-x-2">
                                            <motion.button
                                              onClick={() => onProductSelect(product.id)}
                                              className={cn(
                                                "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-400 group font-medium",
                                                isSelected
                                                  ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02]"
                                                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
                                              )}
                                              whileTap={{ scale: 0.97 }}
                                              whileHover={{ y: -2 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              <span
                                                className={cn(
                                                  "font-semibold text-sm transition-colors duration-300 tracking-tight",
                                                  isSelected
                                                    ? "text-blue-700"
                                                    : "text-slate-700 group-hover:text-blue-600",
                                                )}
                                              >
                                                {product.name}
                                              </span>
                                              {isSelected && (
                                                <motion.div
                                                  initial={{ scale: 0, rotate: -180 }}
                                                  animate={{ scale: 1, rotate: 0 }}
                                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                                >
                                                  <Check className="h-5 w-5 text-blue-600" />
                                                </motion.div>
                                              )}
                                            </motion.button>

                                            {productVideos.length > 0 && (
                                              <motion.div
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                              >
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => toggleProduct(product.id)}
                                                  className={cn(
                                                    "px-2 py-2 h-auto border-2 transition-all duration-300 font-medium",
                                                    isProductOpen
                                                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md"
                                                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm",
                                                  )}
                                                >
                                                  <Video className="h-4 w-4" />
                                                </Button>
                                              </motion.div>
                                            )}
                                          </div>

                                          <AnimatePresence>
                                            {isProductOpen && productVideos.length > 0 && (
                                              <motion.div
                                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl ml-4 border border-blue-200 shadow-sm overflow-hidden"
                                              >
                                                <div className="flex items-center space-x-3 mb-4">
                                                  <Video className="h-5 w-5 text-blue-600" />
                                                  <h6 className="text-base font-bold text-blue-800 tracking-tight">
                                                    {product.name} - Örnek Videolar
                                                  </h6>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                  {productVideos.map((video, index) => (
                                                    <motion.div
                                                      key={index}
                                                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                                      transition={{
                                                        duration: 0.4,
                                                        delay: index * 0.1,
                                                        ease: "easeOut",
                                                      }}
                                                      className="relative bg-white rounded-xl aspect-video flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer border border-blue-200 group shadow-sm hover:shadow-lg"
                                                      whileHover={{ scale: 1.03, y: -4 }}
                                                      whileTap={{ scale: 0.97 }}
                                                    >
                                                      <div className="flex flex-col items-center space-y-3">
                                                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                                                          <Play className="h-7 w-7 text-blue-600 ml-1" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-blue-700 tracking-tight">
                                                          Video {index + 1}
                                                        </span>
                                                      </div>
                                                      <div className="absolute top-3 right-3">
                                                        <Badge
                                                          variant="secondary"
                                                          className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 group-hover:scale-105 transition-all duration-300"
                                                        >
                                                          Demo
                                                        </Badge>
                                                      </div>
                                                    </motion.div>
                                                  ))}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </motion.div>
                                      )
                                    })}
                                  </motion.div>
                                </CollapsibleContent>
                              )}
                            </AnimatePresence>
                          </Collapsible>
                        </div>
                      )}
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
