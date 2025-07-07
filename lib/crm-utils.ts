import { getCrmConfig } from './crm-config'
import type { Lead } from '@/types/lead'

// Função para verificar se um produto é da Dimarzio
export const isDimarzioProduct = (productId: string): boolean => {
  return productId === 'dimarzioseguros'
}

// Função para formatar nome do produto
export const formatProductName = (productId: string): string => {
  const config = getCrmConfig()
  const product = config.PRODUCTS[productId as keyof typeof config.PRODUCTS]
  
  if (product) {
    return product.name
  }
  
  // Tratamento especial para o produto dimarzioseguros
  if (productId === 'dimarzioseguros') {
    return 'Dimarzio Seguros'
  }
  
  return 'Dimarzio Seguros'
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
    
    // Testar apenas o produto dimarzioseguros
    const response = await fetch(`${config.API_BASE_URL}/data/${tenantId}/dimarzioseguros`)
    if (response.ok) {
      const data = await response.json()
      return data.length > 0 ? ['dimarzioseguros'] : []
    }
    
    return []
  } catch (error) {
    console.error('Erro ao descobrir produtos:', error)
    return []
  }
}

// Função para buscar leads (apenas dimarzioseguros agora)
export const fetchDimarzioLeads = async (tenantId: string): Promise<Lead[]> => {
  try {
    const config = getCrmConfig()
    
    const response = await fetch(`${config.API_BASE_URL}/data/${tenantId}/dimarzioseguros`)
    if (response.ok) {
      const data = await response.json()
      return data.map((lead: any) => ({ ...lead, product: 'dimarzioseguros' }))
    }
    
    return []
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return []
  }
}

// Função para buscar com cache inteligente (apenas dimarzioseguros)
const productCache = new Map<string, { data: Lead[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export const fetchWithCache = async (tenantId: string): Promise<Lead[]> => {
  const cacheKey = `${tenantId}-dimarzioseguros`
  const cached = productCache.get(cacheKey)
  
  // Verificar se o cache ainda é válido
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data
  }
  
  try {
    const config = getCrmConfig()
    const response = await fetch(`${config.API_BASE_URL}/data/${tenantId}/dimarzioseguros`)
    
    if (response.ok) {
      const data = await response.json()
      const leads = data.map((lead: any) => ({ ...lead, product: 'dimarzioseguros' }))
      
      // Salvar no cache
      productCache.set(cacheKey, { data: leads, timestamp: Date.now() })
      return leads
    }
    
    return []
  } catch (error) {
    console.error(`Erro ao buscar leads:`, error)
    return []
  }
}