import { getCrmConfig } from './crm-config'
import type { Lead } from '@/types/lead'

// Função para verificar se um produto é da Dimarzio
export const isDimarzioProduct = (productId: string): boolean => {
  return productId?.startsWith('dimarzio-') || false
}

// Função para formatar nome do produto
export const formatProductName = (productId: string): string => {
  const config = getCrmConfig()
  const product = config.PRODUCTS.find(p => p.id === productId)
  
  if (product) {
    return product.name
  }
  
  // Fallback para produtos não configurados mas válidos da Dimarzio
  if (isDimarzioProduct(productId)) {
    const name = productId.replace('dimarzio-', '').replace(/-/g, ' ')
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  return productId || 'Produto não informado'
}

// Função para extrair informações principais do lead
export const getLeadMainInfo = (lead: Lead) => {
  return {
    interesse: lead.field19 || lead.interessePrincipal || 'Não informado',
    observacoes: lead.field18 || lead.field01 || lead.field02 || '',
    produto: formatProductName(lead.product),
    status: lead.field03 || 'NOVO'
  }
}

// Função para validar se um lead é da Dimarzio
export const isValidDimarzioLead = (lead: Lead): boolean => {
  return !!(isDimarzioProduct(lead.product) && 
           lead.name && 
           (lead.email || lead.cellPhone))
}

// Função para filtrar apenas leads da Dimarzio
export const filterDimarzioLeads = (leads: Lead[]): Lead[] => {
  return leads.filter(isValidDimarzioLead)
}

// Função para buscar em campos específicos dos leads
export const searchInLead = (lead: Lead, searchTerm: string): boolean => {
  if (!searchTerm) return true
  
  const term = searchTerm.toLowerCase()
  const searchFields = [
    lead.name,
    lead.email,
    lead.cellPhone,
    lead.product,
    lead.interessePrincipal,
    lead.field01,
    lead.field02,
    lead.field18,
    lead.field19,
    formatProductName(lead.product)
  ]
  
  return searchFields.some(field => 
    field?.toLowerCase().includes(term)
  )
}

// Função para formatar WhatsApp message
export const formatWhatsAppMessage = (leadName: string): string => {
  const config = getCrmConfig()
  return config.WHATSAPP_TEMPLATE.replace('{nome}', leadName)
}

// Função para obter URL da API
export const getApiEndpoint = (path: string): string => {
  const config = getCrmConfig()
  return `${config.API_BASE_URL}${path}`
}

// Função para descobrir produtos automaticamente do backend
export const discoverAvailableProducts = async (): Promise<string[]> => {
  try {
    const config = getCrmConfig()
    const tenantId = config.TENANT_ID
    const dimarzioProducts = config.PRODUCTS.map(p => p.id)
    
    // Testar cada produto para ver quais têm dados
    const promises = dimarzioProducts.map(async (productId) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/data/${tenantId}/${productId}`)
        if (response.ok) {
          const data = await response.json()
          return data.length > 0 ? productId : null
        }
        return null
      } catch {
        return null
      }
    })
    
    const results = await Promise.all(promises)
    return results.filter(Boolean) as string[]
  } catch (error) {
    console.error('Erro ao descobrir produtos:', error)
    return []
  }
}

// Função para buscar leads de múltiplos produtos
export const fetchMultipleProducts = async (productIds: string[], tenantId: string): Promise<Lead[]> => {
  try {
    const config = getCrmConfig()
    
    const promises = productIds.map(productId =>
      fetch(`${config.API_BASE_URL}/data/${tenantId}/${productId}`)
        .then(res => res.ok ? res.json() : [])
        .catch(() => [])
    )
    
    const results = await Promise.all(promises)
    return results.flat()
  } catch (error) {
    console.error('Erro ao buscar múltiplos produtos:', error)
    return []
  }
}

// Função para buscar com cache inteligente
const productCache = new Map<string, { data: Lead[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export const fetchWithCache = async (productId: string, tenantId: string): Promise<Lead[]> => {
  const cacheKey = `${tenantId}-${productId}`
  const cached = productCache.get(cacheKey)
  
  // Verificar se o cache ainda é válido
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }
  
  try {
    const config = getCrmConfig()
    const response = await fetch(`${config.API_BASE_URL}/data/${tenantId}/${productId}`)
    
    if (response.ok) {
      const data = await response.json()
      // Salvar no cache
      productCache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    }
    
    return []
  } catch (error) {
    console.error(`Erro ao buscar produto ${productId}:`, error)
    return []
  }
}