"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Code, Database, Settings, Palette, FileText, Globe } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SwaggerPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    })
  }

  const apis = [
    {
      name: "Listar Leads",
      method: "GET",
      url: "https://backend-ingressar.onrender.com/metropole/v1/data/{tenantId}/{produto}",
      description: "Busca todos os leads de um produto específico",
      params: {
        tenantId: "ID do cliente/tenant (ex: '2')",
        produto: "Nome do produto (ex: 'citygalleria', 'avenida105')"
      },
      response: "Array de objetos Lead",
      example: "https://backend-ingressar.onrender.com/metropole/v1/data/2/citygalleria"
    },
    {
      name: "Atualizar Status do Lead", 
      method: "PUT",
      url: "https://backend-ingressar.onrender.com/metropole/v1/update/{leadId}",
      description: "Atualiza o status de um lead específico",
      params: {
        leadId: "ID único do lead"
      },
      body: {
        field03: "Novo status do lead"
      },
      response: "Confirmação de atualização",
      example: "https://backend-ingressar.onrender.com/metropole/v1/update/123"
    }
  ]

  const leadSchema = {
    id: "number - ID único do lead",
    name: "string - Nome do lead",
    email: "string - Email do lead", 
    cellPhone: "string - Telefone celular",
    createdAt: "string - Data de criação (ISO)",
 
    field03: "string - Status do lead",
    field04: "string - Campo customizado 4",
    field05: "string - Campo customizado 5",
    field06: "string - Campo customizado 6 (live/invest)",
    interessePrincipal: "string - Interesse principal do lead",
    product: "string - Produto de interesse"
  }

  const statusOptions = [
    { value: "NOVO", label: "Novo", color: "bg-blue-500" },
    { value: "CONTATO_FEITO", label: "Contato Feito", color: "bg-yellow-500" },
    { value: "QUALIFICADO", label: "Qualificado", color: "bg-green-500" },
    { value: "NÃO_QUALIFICADO", label: "Não Qualificado", color: "border-red-400 text-red-400" },
    { value: "QUALIFICADO_OP", label: "Qualificado OP", color: "bg-purple-500" },
    { value: "PROPOSTA", label: "Proposta", color: "bg-orange-500" },
    { value: "FECHADO", label: "Fechado", color: "bg-teal-500" },
  ]

  const configuracoesCliente = {
    tenantId: "2",
    produtos: [
      { id: "citygalleria", name: "City Galleria" },
      { id: "avenida105", name: "Avenida 105" }
    ],
    cores: {
      primary: "rgb(139, 69, 19)", // Marrom
      secondary: "rgb(255, 193, 7)", // Amarelo/Dourado
      accent: "rgb(255, 215, 0)" // Dourado
    },
    whatsappTemplate: "Olá {nome}, estamos entrando em contato sobre seu interesse em nossos produtos."
  }

  const componentesReutilizaveis = [
    "DashboardStats - Estatísticas principais",
    "MetropoleList - Lista/tabela de leads", 
    "LeadStats - Gráficos e estatísticas",
    "DashboardShell - Layout principal",
    "DashboardHeader - Cabeçalho responsivo",
    "ProductConfig - Configuração de produtos"
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">CRM Template Documentation</h1>
          </div>
          <p className="text-white/90 text-lg">
            Documentação completa para replicar o padrão Metropole CRM para outros clientes
          </p>
          <p className="text-white/70 mt-2">
            Use esta documentação para gerar prompts de IA e configurar novos projetos
          </p>
        </div>

        <Tabs defaultValue="apis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="prompt">Prompt IA</TabsTrigger>
          </TabsList>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Endpoints de API
                </CardTitle>
                <CardDescription>
                  Todas as rotas utilizadas no sistema CRM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {apis.map((api, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={api.method === "GET" ? "secondary" : "default"}>
                          {api.method}
                        </Badge>
                        <h3 className="font-semibold">{api.name}</h3>
                      </div>
                      
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm flex items-center justify-between">
                        <span>{api.url}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(api.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-gray-600">{api.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Parâmetros:</h4>
                          <div className="space-y-1 text-sm">
                            {Object.entries(api.params).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{key}</span>
                                <span className="ml-2 text-gray-600">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {api.body && (
                          <div>
                            <h4 className="font-medium mb-2">Body (JSON):</h4>
                            <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                              <pre>{JSON.stringify(api.body, null, 2)}</pre>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Exemplo:</h4>
                        <div className="bg-blue-50 p-3 rounded font-mono text-sm flex items-center justify-between">
                          <span>{api.example}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(api.example)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Schema de Dados
                </CardTitle>
                <CardDescription>
                  Estrutura dos objetos utilizados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Lead Object</h3>
                    <div className="space-y-2">
                      {Object.entries(leadSchema).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                          <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm font-medium">
                            {key}
                          </span>
                          <span className="text-gray-600 text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Status Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {statusOptions.map((status) => (
                        <div key={status.value} className="flex items-center gap-3 p-3 border rounded">
                          <div className={`w-4 h-4 rounded ${status.color}`}></div>
                          <span className="font-mono text-sm">{status.value}</span>
                          <span className="text-gray-600">{status.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Lógica de Origem dos Leads</h3>
                    <div className="bg-yellow-50 p-4 rounded border">
                      <h4 className="font-medium mb-2">Lead tipo "Quiz":</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Um lead é considerado do Quiz se qualquer um destes campos for "yes", "no", "live" ou "invest":
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        <span>field04, field05</span>
                        <span>field06 (live/invest)</span>
                      </div>
                      
                      <h4 className="font-medium mb-2 mt-4">Lead tipo "Premium":</h4>
                      <p className="text-sm text-gray-600">
                        Todos os outros leads que não se enquadram na lógica do Quiz
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Cliente
                </CardTitle>
                <CardDescription>
                  Configurações específicas do Metropole que precisam ser adaptadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Configurações Básicas</h3>
                    <div className="bg-gray-100 p-4 rounded">
                      <pre className="text-sm">{JSON.stringify(configuracoesCliente, null, 2)}</pre>
                      <Button
                        className="mt-3"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(configuracoesCliente, null, 2))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Configuração
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Variáveis de Ambiente</h3>
                    <div className="space-y-2">
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <h4 className="font-medium text-red-800">⚠️ Configurações Obrigatórias</h4>
                        <div className="space-y-1 mt-2 text-sm">
                          <div><code>TENANT_ID</code> - ID único do cliente</div>
                          <div><code>API_BASE_URL</code> - URL base da API</div>
                          <div><code>PRODUCT_IDS</code> - IDs dos produtos (array)</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <h4 className="font-medium text-blue-800">🔧 Configurações Opcionais</h4>
                        <div className="space-y-1 mt-2 text-sm">
                          <div><code>WHATSAPP_TEMPLATE</code> - Template da mensagem do WhatsApp</div>
                          <div><code>ITEMS_PER_PAGE</code> - Itens por página (padrão: 10)</div>
                          <div><code>ENABLE_QUIZ_FILTER</code> - Habilitar filtro Quiz/Premium</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Customizações por Cliente</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded border">
                        <h4 className="font-medium text-green-800 mb-2">✅ Personalizável</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Cores do tema (primary, secondary)</li>
                          <li>• Logo e branding</li>
                          <li>• Nomes dos produtos</li>
                          <li>• Status de leads customizados</li>
                          <li>• Template do WhatsApp</li>
                          <li>• Campos customizados (field04-06)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded border">
                        <h4 className="font-medium text-orange-800 mb-2">⚡ Estrutura Fixa</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Layout responsivo</li>
                          <li>• Fluxo de navegação</li>
                          <li>• Componentes base</li>
                          <li>• Lógica de filtros</li>
                          <li>• Paginação</li>
                          <li>• Ordenação por data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Componentes Reutilizáveis
                </CardTitle>
                <CardDescription>
                  Componentes que podem ser reutilizados em outros projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {componentesReutilizaveis.map((component, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Componente</Badge>
                        <span className="font-medium">{component}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded border">
                  <h4 className="font-medium text-blue-800 mb-2">🏗️ Estrutura de Arquivos</h4>
                  <pre className="text-sm text-blue-700">
{`components/
├── ui/              # Componentes base (shadcn/ui)
├── dashboard-*.tsx  # Componentes do dashboard
├── metropole-*.tsx  # Componentes específicos do CRM
├── lead-*.tsx       # Componentes de leads
└── chart-*.tsx      # Componentes de gráficos

app/
├── dashboard/       # Páginas do dashboard
├── swagger/         # Esta documentação
└── layout.tsx       # Layout principal

hooks/
├── use-product-config.ts
└── use-toast.ts

types/
└── metropole.ts     # Tipos TypeScript`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Sistema de Design
                </CardTitle>
                <CardDescription>
                  Padrões visuais e de UX utilizados no projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Paleta de Cores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-primary p-4 rounded text-white">
                        <div className="font-medium">Primary</div>
                        <div className="text-sm opacity-90">rgb(139, 69, 19)</div>
                      </div>
                      <div className="bg-secondary p-4 rounded text-black">
                        <div className="font-medium">Secondary</div>
                        <div className="text-sm opacity-75">rgb(255, 193, 7)</div>
                      </div>
                      <div className="bg-green-500 p-4 rounded text-white">
                        <div className="font-medium">Success</div>
                        <div className="text-sm opacity-90">Qualificado</div>
                      </div>
                      <div className="bg-red-500 p-4 rounded text-white">
                        <div className="font-medium">Danger</div>
                        <div className="text-sm opacity-90">Não Qualif.</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Breakpoints Responsivos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="bg-blue-100 p-3 rounded">
                          <div className="font-medium">Mobile First</div>
                          <div className="text-sm text-gray-600">xs: 475px (extra small)</div>
                        </div>
                        <div className="bg-green-100 p-3 rounded">
                          <div className="font-medium">Tablet</div>
                          <div className="text-sm text-gray-600">sm: 640px, md: 768px, lg: 1024px</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-purple-100 p-3 rounded">
                          <div className="font-medium">Desktop</div>
                          <div className="text-sm text-gray-600">xl: 1280px, 2xl: 1536px</div>
                        </div>
                        <div className="bg-orange-100 p-3 rounded">
                          <div className="font-medium">Layouts</div>
                          <div className="text-sm text-gray-600">Mobile Cards + Desktop Table</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Padrões UX</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">📱 Mobile First Design</h4>
                        <p className="text-sm text-gray-600">
                          Interface otimizada para mobile com cards responsivos e navegação touch-friendly
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">🎯 Progressive Disclosure</h4>
                        <p className="text-sm text-gray-600">
                          Informações principais sempre visíveis, detalhes em seções colapsáveis
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">⚡ Loading States</h4>
                        <p className="text-sm text-gray-600">
                          Skeletons e spinners para feedback visual durante carregamento
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">🔄 Real-time Updates</h4>
                        <p className="text-sm text-gray-600">
                          Atualizações de status em tempo real com feedback de sucesso/erro
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prompt IA Tab */}
          <TabsContent value="prompt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prompt para IA
                </CardTitle>
                <CardDescription>
                  Prompt completo para recriar este padrão para outro cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-6 rounded border">
                  <pre className="text-sm whitespace-pre-wrap">
{`Crie um CRM Dashboard seguindo exatamente este padrão:

## ESTRUTURA TÉCNICA
- Next.js 14+ com TypeScript
- Tailwind CSS + shadcn/ui
- Layout responsivo (mobile-first)
- 3 breakpoints: Mobile Cards, Tablet View, Desktop Table

## CONFIGURAÇÕES DO CLIENTE
- Tenant ID: [INSERIR_TENANT_ID]
- Produtos: [INSERIR_LISTA_DE_PRODUTOS]
- API Base: [INSERIR_URL_DA_API]
- Cores Primary: [INSERIR_COR_PRIMARY]
- Cores Secondary: [INSERIR_COR_SECONDARY]

## ENDPOINTS OBRIGATÓRIOS
GET: {baseUrl}/v1/data/{tenantId}/{produto}
PUT: {baseUrl}/v1/update/{leadId}

## SCHEMA DO LEAD
- id: number
- name: string
- email: string
- cellPhone: string
- createdAt: string (ISO)
                    - field04-06: string (campos customizados)
- interessePrincipal: string
- product: string

## STATUS DE LEADS
["NOVO", "CONTATO_FEITO", "QUALIFICADO", "NÃO_QUALIFICADO", "QUALIFICADO_OP", "PROPOSTA", "FECHADO"]

## COMPONENTES OBRIGATÓRIOS
1. DashboardStats - Cards com estatísticas principais
2. MetropoleList - Tabela/cards de leads responsiva
3. LeadStats - Gráficos de distribuição
4. Sidebar com navegação
5. Header responsivo

## FUNCIONALIDADES CORE
- ✅ Listagem de leads ordenada por mais recente
- ✅ Filtros: busca, produto, origem (Quiz/Premium)
- ✅ Paginação responsiva
- ✅ Atualização de status em tempo real
- ✅ Integração WhatsApp
- ✅ Estatísticas dinâmicas
- ✅ Formato de data inteligente
- ✅ Loading states e tratamento de erro

## LÓGICA DE ORIGEM DOS LEADS
                    Quiz: field04-05 = "yes/no" OU field06 = "live/invest"
Premium: todos os outros

## RESPONSIVIDADE
- Mobile (< lg): Cards empilhados
- Tablet (lg-xl): Tabela compacta 
- Desktop (xl+): Tabela completa com todas as colunas

## UX PATTERNS
- Progressive disclosure (seções colapsáveis)
- Feedback visual imediato
- Mobile-first design
- Touch-friendly interactions

Replique EXATAMENTE esta estrutura alterando apenas:
- Configurações do cliente
- Cores e branding
- Nomes dos produtos
- URL da API`}
                  </pre>
                  <Button
                    className="mt-4"
                    onClick={() => copyToClipboard(document.querySelector('pre')?.textContent || '')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Prompt Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 