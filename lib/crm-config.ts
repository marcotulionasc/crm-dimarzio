// Configuração do CRM Dimarzio Seguros
export const CRM_CONFIG = {
  // Informações da empresa
  COMPANY_NAME: process.env.CRM_COMPANY_NAME || 'Dimarzio Seguros',
  TENANT_ID: process.env.CRM_TENANT_ID || '6',
  
  // API
  API_BASE_URL: process.env.CRM_API_BASE_URL || 'https://backend-ingressar.onrender.com/metropole/v1',
  
  // Produtos disponíveis
  PRODUCTS: [
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
  ],
  
  // Produto padrão
  DEFAULT_PRODUCT: process.env.CRM_DEFAULT_PRODUCT || 'dimarzio-auto',
  
  // Templates de mensagens
  WHATSAPP_TEMPLATE: process.env.CRM_WHATSAPP_TEMPLATE || 'Olá {nome}, estamos entrando em contato sobre seu interesse em nossos produtos de seguros.',
  
  // Status dos leads
  LEAD_STATUS: [
    { value: "NOVO", label: "Novo", color: "bg-blue-500" },
    { value: "CONTATO_FEITO", label: "Contato Feito", color: "bg-yellow-500" },
    { value: "QUALIFICADO", label: "Qualificado", color: "bg-green-500" },
    { value: "NÃO_QUALIFICADO", label: "Não Qualificado", color: "border-red-400 text-red-400" },
    { value: "QUALIFICADO_OP", label: "Qualificado OP", color: "bg-purple-500" },
    { value: "PROPOSTA", label: "Proposta", color: "bg-orange-500" },
    { value: "FECHADO", label: "Fechado", color: "bg-teal-500" },
  ],
  
  // Opções de origem dos leads
  LEAD_SOURCES: [
    "Indicação",
    "Google",
    "Facebook", 
    "Instagram",
    "LinkedIn",
    "WhatsApp",
    "Site",
    "Outros"
  ],
  
  // Cores do tema
  THEME_COLORS: {
    primary: "hsl(222.2 84% 4.9%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 96%)",
  }
} as const

// Helpers para acessar configurações
export const getCrmConfig = () => CRM_CONFIG
export const getProducts = () => CRM_CONFIG.PRODUCTS
export const getLeadStatus = () => CRM_CONFIG.LEAD_STATUS
export const getApiUrl = (endpoint: string) => `${CRM_CONFIG.API_BASE_URL}${endpoint}`
export const formatWhatsappMessage = (template: string, name: string) => 
  template.replace('{nome}', name) 