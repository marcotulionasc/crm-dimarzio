"use client"

import { useState, useEffect } from "react"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useProductConfig } from "@/hooks/use-product-config"
import { formatProductName } from "@/lib/crm-utils"

interface ProductSearchProps {
  selectedProducts: string[]
  onProductsChange: (products: string[]) => void
  placeholder?: string
}

export function ProductSearch({ 
  selectedProducts, 
  onProductsChange, 
  placeholder = "Buscar produtos..." 
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<string[]>([])
  const { products } = useProductConfig()

  // Filtrar produtos baseado na busca
  const filteredProducts = products.filter(product => {
    const name = formatProductName(product.id).toLowerCase()
    const id = product.id.toLowerCase()
    const term = searchTerm.toLowerCase()
    
    return name.includes(term) || id.includes(term)
  })

  // Toggle produto selecionado
  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onProductsChange(selectedProducts.filter(id => id !== productId))
    } else {
      onProductsChange([...selectedProducts, productId])
    }
  }

  // Remover produto
  const removeProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter(id => id !== productId))
  }

  // Selecionar todos
  const selectAll = () => {
    onProductsChange(products.map(p => p.id))
  }

  // Limpar seleção
  const clearAll = () => {
    onProductsChange([])
  }

  return (
    <div className="space-y-3">
      {/* Input de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Produtos selecionados */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((productId) => (
            <Badge key={productId} className="flex items-center gap-1">
              {formatProductName(productId)}
              <X 
                className="h-3 w-3 cursor-pointer hover:bg-red-500 rounded-full" 
                onClick={() => removeProduct(productId)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown de produtos */}
      {showDropdown && (
        <Card className="absolute z-10 w-full max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {/* Ações rápidas */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs"
              >
                Selecionar Todos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-red-600"
              >
                Limpar
              </Button>
            </div>

            {/* Lista de produtos */}
            <div className="space-y-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => toggleProduct(product.id)}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {formatProductName(product.id)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.id}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Filter className="h-3 w-3" />
        {selectedProducts.length === 0 && "Nenhum produto selecionado"}
        {selectedProducts.length === 1 && "1 produto selecionado"}
        {selectedProducts.length > 1 && `${selectedProducts.length} produtos selecionados`}
      </div>
    </div>
  )
} 