"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Target, CheckCircle, Clock, Phone, Calendar, MapPin, Home } from "lucide-react"
import type { Metropole } from "@/types/lead"
import { useProductConfig } from "@/hooks/use-product-config"

interface DashboardStatsProps {
  refreshTrigger?: number
}

export function DashboardStats({ refreshTrigger }: DashboardStatsProps) {
  const [leads, setLeads] = useState<Metropole[]>([])
  const [loading, setLoading] = useState(true)
  const tenantId = process.env.NEXT_PUBLIC_CRM_TENANT_ID || "6"
  const { products } = useProductConfig()

  useEffect(() => {
    fetchLeads()
  }, [refreshTrigger])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      console.log("🔍 DashboardStats: Iniciando busca de leads...")
      
      // Buscar dados de todos os produtos
      const productIds = [
        "dimarzio-auto",
        "dimarzio-residencial", 
        "dimarzio-vida",
        "dimarzio-consorcio",
        "dimarzio-fianca-locaticia",
        "dimarzio-fiduciario",
        "dimarzio-contato",
        "dimarzio-portateis",
        "dimarzio-saude",
        "dimarzio-viagem",
        "dimarzio-rural",
        "dimarzio-empresarial",
        "dimarzio-rc-profissional"
      ]

      let allLeads: Metropole[] = []
      let successCount = 0
      let errorCount = 0

      for (const productId of productIds) {
        try {
          const url = `${process.env.NEXT_PUBLIC_CRM_API_BASE_URL}/data/${tenantId}/${productId}`
          console.log(`📡 Buscando: ${productId}`)
          
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              console.log(`✅ ${productId}: ${data.length} leads encontrados`)
              // Adicionar informação do produto aos leads
              const leadsWithProduct = data.map(lead => ({
                ...lead,
                product: productId
              }))
              allLeads = [...allLeads, ...leadsWithProduct]
              successCount++
            } else {
              console.log(`⚪ ${productId}: sem leads`)
            }
          } else {
            console.log(`❌ ${productId}: erro HTTP ${response.status}`)
            errorCount++
          }
        } catch (error) {
          console.error(`💥 Erro ao buscar ${productId}:`, error)
          errorCount++
        }
      }

      console.log(`📊 Resultado final:`)
      console.log(`   Total de leads: ${allLeads.length}`)
      console.log(`   Produtos com sucesso: ${successCount}`)
      console.log(`   Produtos com erro: ${errorCount}`)
      console.log(`   Leads por status:`, {
        total: allLeads.length,
        novo: allLeads.filter(l => !l.field03 || l.field03 === "NOVO").length,
        qualificado: allLeads.filter(l => l.field03 === "QUALIFICADO" || l.field03 === "QUALIFICADO_OP").length,
        proposta: allLeads.filter(l => l.field03 === "PROPOSTA").length,
        fechado: allLeads.filter(l => l.field03 === "FECHADO").length
      })
      
      setLeads(allLeads)
    } catch (error) {
      console.error("💥 Erro geral ao buscar dados:", error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => l.field03 === "QUALIFICADO" || l.field03 === "QUALIFICADO_OP").length
  const proposalLeads = leads.filter(l => l.field03 === "PROPOSTA").length
  const closedLeads = leads.filter(l => l.field03 === "FECHADO").length
  const newLeads = leads.filter(l => !l.field03 || l.field03 === "NOVO").length
  const contactedLeads = leads.filter(l => l.field03 === "CONTATO_FEITO").length

  // Leads por produto
  const leadsByProduct = leads.reduce((acc, lead) => {
    const product = lead.product || "Não especificado"
    // Converter o ID do produto para nome amigável
    let productName = product
    if (product.startsWith('dimarzio-')) {
      productName = product
        .replace('dimarzio-', '')
        .replace('-', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    acc[productName] = (acc[productName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Leads por cidade (field01)
  const leadsByCity = leads.reduce((acc, lead) => {
    const city = lead.field01 || "Não especificado"
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Taxa de conversão
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : "0"
  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : "0"

  // Leads recentes (últimas 24 horas)
  const recentLeads = leads.filter(lead => {
    const createdAt = new Date(lead.createdAt)
    const now = new Date()
    const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24
  }).length

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug temporário */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-800">Debug - Total de leads: {totalLeads}</p>
            <p className="text-xs text-yellow-600">
              Novos: {newLeads} | Qualificados: {qualifiedLeads} | Propostas: {proposalLeads} | Fechados: {closedLeads}
            </p>
          </div>
          <button 
            onClick={fetchLeads}
            className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm hover:bg-yellow-300"
          >
            🔄 Recarregar
          </button>
        </div>
      </div>

      {/* Cards principais de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                {recentLeads > 0 && (
                  <p className="text-xs text-green-600 mt-1">+{recentLeads} nas últimas 24h</p>
                )}
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualificados</p>
                <p className="text-2xl font-bold text-green-600">{qualifiedLeads}</p>
                <p className="text-xs text-gray-500 mt-1">{qualificationRate}% do total</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Propostas</p>
                <p className="text-2xl font-bold text-orange-600">{proposalLeads}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalLeads > 0 ? ((proposalLeads / totalLeads) * 100).toFixed(1) : "0"}% do total
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fechados</p>
                <p className="text-2xl font-bold text-teal-600">{closedLeads}</p>
                <p className="text-xs text-gray-500 mt-1">{conversionRate}% conversão</p>
              </div>
              <CheckCircle className="h-8 w-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards secundários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos Leads</p>
                <p className="text-xl font-bold text-blue-600">{newLeads}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-xs text-gray-500">
              Aguardando primeiro contato
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Contato Feito</p>
                <p className="text-xl font-bold text-yellow-600">{contactedLeads}</p>
              </div>
              <Phone className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-xs text-gray-500">
              Leads já contatados
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Qualificação</p>
                <p className="text-xl font-bold text-green-600">{qualificationRate}%</p>
              </div>
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-xs text-gray-500">
              Leads qualificados vs total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análises por produto e localização */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Leads por Produto
            </CardTitle>
            <CardDescription>
              Distribuição dos leads por tipo de produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(leadsByProduct)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([product, count]) => (
                  <div key={product} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1 truncate pr-2">
                      {product}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                      <div className="text-xs text-gray-400">
                        {totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : "0"}%
                      </div>
                    </div>
                  </div>
                ))}
              {Object.keys(leadsByProduct).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum dado disponível
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Leads por Cidade
            </CardTitle>
            <CardDescription>
              Distribuição geográfica dos leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(leadsByCity)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1 truncate pr-2">
                      {city}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                      <div className="text-xs text-gray-400">
                        {totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : "0"}%
                      </div>
                    </div>
                  </div>
                ))}
              {Object.keys(leadsByCity).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum dado disponível
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
