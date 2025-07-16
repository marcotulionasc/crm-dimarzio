"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

// Definição do tipo de produto
export interface Product {
  id: string
  name: string
  active: boolean
}

// Produtos da Dimarzio Seguros
const defaultProducts: Product[] = [
  { id: "dimarzioseguros", name: "Dimarzio Seguros", active: true },
  { id: "dimarzio-consorcio", name: "Consórcio", active: true },
  { id: "dimarzio-residencial", name: "Residencial", active: true },
  { id: "dimarzio-fianca-locaticia", name: "Fiança Locatícia", active: true },
  { id: "dimarzio-auto", name: "Auto", active: true },
  { id: "dimarzio-fiduciario", name: "Fiduciário", active: true },
  { id: "dimarzio-contato", name: "Contato", active: true },
  { id: "dimarzio-vida", name: "Vida", active: true },
  { id: "dimarzio-portateis", name: "Portáteis", active: true },
  { id: "dimarzio-saude", name: "Saúde", active: true },
  { id: "dimarzio-viagem", name: "Viagem", active: true },
  { id: "dimarzio-rural", name: "Rural", active: true },
  { id: "dimarzio-empresarial", name: "Empresarial", active: true },
  { id: "dimarzio-rc-profissional", name: "RC Profissional", active: true },
]

// Contexto para compartilhar a configuração de produtos
interface ProductConfigContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  removeProduct: (id: string) => void
  isLoading: boolean
}

const ProductConfigContext = createContext<ProductConfigContextType | undefined>(undefined)

// Provider para o contexto
export function ProductConfigProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar produtos do localStorage na inicialização
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("dimarzio-crm-products")
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts)
          // Verificar se os produtos salvos são válidos, senão usar os padrão
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed)
          } else {
            setProducts(defaultProducts)
          }
        } else {
          setProducts(defaultProducts)
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        // Em caso de erro, usar os produtos padrão
        setProducts(defaultProducts)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Salvar produtos no localStorage quando houver alterações
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("dimarzio-crm-products", JSON.stringify(products))
    }
  }, [products, isLoading])

  // Funções para gerenciar produtos
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return (
    <ProductConfigContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        removeProduct,
        isLoading,
      }}
    >
      {children}
    </ProductConfigContext.Provider>
  )
}

// Hook para usar a configuração de produtos
export function useProductConfig() {
  const context = useContext(ProductConfigContext)
  if (context === undefined) {
    throw new Error("useProductConfig must be used within a ProductConfigProvider")
  }
  return context
}
