"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Loader2, Building } from "lucide-react"
import type { Metropole } from "@/types/lead"

// Constante com os status oficiais
const LEAD_STATUS = [
  { value: "NOVO", label: "Novo", color: "#3B82F6" },
  { value: "CONTATO_FEITO", label: "Contato Feito", color: "#EAB308" },
  { value: "QUALIFICADO", label: "Qualificado", color: "#22C55E" },
  { value: "NÃO_QUALIFICADO", label: "Não Qualificado", color: "#EF4444" },
  { value: "QUALIFICADO_OP", label: "Qualificado OP", color: "#A855F7" },
  { value: "PROPOSTA", label: "Proposta", color: "#F97316" },
  { value: "FECHADO", label: "Fechado", color: "#14B8A6" },
]

// Cores da LEVA MIDIA
const COLORS = ["#2E0854", "#CAFF00", "#4B0082", "#9FCC00", "#1A0330", "#E5FF66"]

interface LeadStatsProps {
  refreshTrigger?: number
}

const CHART_TYPES = {
  status: "Status dos Leads",
  origem: "Origem dos Leads",
  tempo: "Leads por Período",
  conversao: "Funil de Conversão"
}

export function LeadStats({ refreshTrigger }: LeadStatsProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const tenantId = process.env.CRM_TENANT_ID || "6"
  const product = process.env.CRM_DEFAULT_PRODUCT || "dimarzio-auto"

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [leads, setLeads] = useState<Metropole[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<string>("7")
  const [activeChart, setActiveChart] = useState<string>("status")

  useEffect(() => {
    fetchLeads()
  }, [refreshTrigger])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.CRM_API_BASE_URL}/data/${tenantId}/${product}`)
      const data = response.ok ? await response.json() : []
      setLeads(data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-40 sm:h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const getInterestStats = () => {
    const interestCounts: Record<string, number> = {}
    leads.forEach((lead) => {
      const interest = lead.interessePrincipal || "Não especificado"
      interestCounts[interest] = (interestCounts[interest] || 0) + 1
    })

    return Object.entries(interestCounts).map(([name, value]) => ({ name, value }))
  }

  const getCityStats = () => {
    const cityCounts: Record<string, number> = {}
    leads.forEach((lead) => {
      const city = lead.field01 || "Não especificado"
      cityCounts[city] = (cityCounts[city] || 0) + 1
    })

    return Object.entries(cityCounts).map(([name, value]) => ({ name, value }))
  }

  const getLeadsByDate = () => {
    const dateMap: Record<string, number> = {}
    leads.forEach((lead) => {
      const date = new Date(lead.createdAt).toLocaleDateString("pt-BR")
      dateMap[date] = (dateMap[date] || 0) + 1
    })

    // Determine how many days to show based on screen width
    const daysToShow = windowWidth < 768 ? 7 : 15

    return Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/")
        const [dayB, monthB, yearB] = b.date.split("/")
        return new Date(`${yearA}-${monthA}-${dayA}`).getTime() - new Date(`${yearB}-${monthB}-${dayB}`).getTime()
      })
      .slice(-daysToShow) // Adaptativo baseado no tamanho da tela
  }

  // Processar dados de status
  const getStatusStats = () => {
    const statusCounts: Record<string, number> = {}

    // Inicializar todos os status com 0
    LEAD_STATUS.forEach((status) => {
      statusCounts[status.value] = 0
    })

    // Contar leads por status
    leads.forEach((lead) => {
      const status = lead.field03 || "NOVO"
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++
      }
    })

    // Converter para formato do gráfico
    return LEAD_STATUS.map((status) => ({
      name: status.label,
      value: statusCounts[status.value],
      color: status.color,
    }))
  }

  const interestData = getInterestStats()
  const cityData = getCityStats()
  const leadsByDate = getLeadsByDate()
  const statusData = getStatusStats()

  // Função para determinar a altura do gráfico baseado no tamanho da tela
  const getChartHeight = () => {
    if (windowWidth < 640) return 200
    if (windowWidth < 1024) return 250
    return 300
  }

  // Função para determinar o ângulo do texto do eixo X baseado no tamanho da tela
  const getXAxisAngle = () => {
    return windowWidth < 640 ? -90 : -45
  }

  // Função para determinar o tamanho da fonte baseado no tamanho da tela
  const getFontSize = () => {
    return windowWidth < 640 ? 8 : 10
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
      {/* Header da empresa */}
      <Card className="bg-primary border-white/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-secondary" />
            <div>
              <h2 className="text-xl font-bold text-white">{process.env.CRM_COMPANY_NAME || 'Dimarzio Seguros'} - Estatísticas</h2>
              <p className="text-white/90 text-sm">Análise completa dos leads de seguros</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="status">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <TabsList className="mb-4 bg-primary w-full flex-nowrap">
            <TabsTrigger
              value="status"
              className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-white"
            >
              Status
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-white"
            >
              Linha do Tempo
            </TabsTrigger>
            <TabsTrigger
              value="interests"
              className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-white"
            >
              Interesses
            </TabsTrigger>
            <TabsTrigger
              value="cities"
              className="data-[state=active]:bg-secondary data-[state=active]:text-primary text-white"
            >
              Cidades
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="status">
          <div className="grid gap-4">
            {/* Cards de resumo */}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              <Card className="border-white/20">
                <CardHeader className="pb-2 bg-primary text-white p-2 sm:p-3">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total de Leads</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 p-2 sm:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-white">{leads.length}</div>
                  <p className="text-xs text-white/70 mt-1">
                    Leads de seguros
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/20">
                <CardHeader className="pb-2 bg-secondary text-primary p-2 sm:p-3">
                  <CardTitle className="text-xs sm:text-sm font-medium">Leads Qualificados</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 p-2 sm:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {leads.filter((lead) => lead.field03 === "QUALIFICADO" || lead.field03 === "QUALIFICADO_OP").length}
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    {leads.length > 0
                      ? Math.round(
                          (leads.filter((lead) => lead.field03 === "QUALIFICADO" || lead.field03 === "QUALIFICADO_OP")
                            .length /
                            leads.length) *
                            100,
                        )
                      : 0}
                    % do total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/20">
                <CardHeader className="pb-2 bg-primary text-white p-2 sm:p-3">
                  <CardTitle className="text-xs sm:text-sm font-medium">Em Proposta</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 p-2 sm:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {leads.filter((lead) => lead.field03 === "PROPOSTA").length}
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    {leads.length > 0
                      ? Math.round((leads.filter((lead) => lead.field03 === "PROPOSTA").length / leads.length) * 100)
                      : 0}
                    % do total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/20">
                <CardHeader className="pb-2 bg-secondary text-primary p-2 sm:p-3">
                  <CardTitle className="text-xs sm:text-sm font-medium">Fechados</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 p-2 sm:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {leads.filter((lead) => lead.field03 === "FECHADO").length}
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    Taxa de conversão:{" "}
                    {leads.length > 0
                      ? Math.round((leads.filter((lead) => lead.field03 === "FECHADO").length / leads.length) * 100)
                      : 0}
                    %
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de distribuição de status */}
            <Card className="border-white/20">
              <CardHeader className="bg-primary text-white p-2 sm:p-3">
                <CardTitle className="text-base sm:text-lg">
                  Distribuição por Status - {process.env.CRM_COMPANY_NAME || 'Dimarzio Seguros'}
                </CardTitle>
                <CardDescription className="text-white/80 text-xs sm:text-sm">
                  Visualização do funil de vendas de seguros
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 p-2 sm:p-4">
                <div style={{ height: getChartHeight(), width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusData}
                      margin={{ top: 10, right: 10, left: 0, bottom: windowWidth < 640 ? 60 : 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="name"
                        angle={getXAxisAngle()}
                        textAnchor="end"
                        height={windowWidth < 640 ? 60 : 40}
                        tick={{ fontSize: getFontSize(), fill: "#ffffff80" }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: getFontSize(), fill: "#ffffff80" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2E0854",
                          border: "1px solid #ffffff20",
                          borderRadius: "8px",
                          fontSize: windowWidth < 640 ? "12px" : "14px",
                        }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="border-white/20">
            <CardHeader className="bg-primary text-white p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Leads por Data</CardTitle>
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Evolução temporal dos leads de seguros
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div style={{ height: getChartHeight(), width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={leadsByDate}
                    margin={{ top: 10, right: 10, left: 0, bottom: windowWidth < 640 ? 40 : 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="date"
                      angle={windowWidth < 640 ? -45 : 0}
                      textAnchor={windowWidth < 640 ? "end" : "middle"}
                      height={windowWidth < 640 ? 40 : 30}
                      tick={{ fontSize: getFontSize(), fill: "#ffffff80" }}
                      interval={windowWidth < 640 ? "preserveStartEnd" : 0}
                    />
                    <YAxis tick={{ fontSize: getFontSize(), fill: "#ffffff80" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2E0854",
                        border: "1px solid #ffffff20",
                        borderRadius: "8px",
                        fontSize: windowWidth < 640 ? "12px" : "14px",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#CAFF00"
                      strokeWidth={2}
                      dot={{ fill: "#CAFF00", strokeWidth: 2, r: windowWidth < 640 ? 3 : 4 }}
                      activeDot={{ r: windowWidth < 640 ? 5 : 6, fill: "#CAFF00" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests">
          <Card className="border-white/20">
            <CardHeader className="bg-primary text-white p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Distribuição por Interesse</CardTitle>
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Tipos de projetos mais procurados
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {/* Gráfico de Pizza */}
                <div style={{ height: getChartHeight(), width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={interestData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) =>
                          windowWidth >= 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={windowWidth < 640 ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {interestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2E0854",
                          border: "1px solid #ffffff20",
                          borderRadius: "8px",
                          fontSize: windowWidth < 640 ? "12px" : "14px",
                        }}
                      />
                      {windowWidth >= 768 && <Legend />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras */}
                <div style={{ height: getChartHeight(), width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={interestData}
                      margin={{ top: 10, right: 10, left: 0, bottom: windowWidth < 640 ? 40 : 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="name"
                        angle={windowWidth < 640 ? -45 : 0}
                        textAnchor={windowWidth < 640 ? "end" : "middle"}
                        height={windowWidth < 640 ? 40 : 30}
                        tick={{ fontSize: getFontSize(), fill: "#ffffff80" }}
                      />
                      <YAxis tick={{ fontSize: getFontSize(), fill: "#ffffff80" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2E0854",
                          border: "1px solid #ffffff20",
                          borderRadius: "8px",
                          fontSize: windowWidth < 640 ? "12px" : "14px",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {interestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities">
          <Card className="border-white/20">
            <CardHeader className="bg-primary text-white p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Distribuição por Cidade</CardTitle>
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Localização geográfica dos projetos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {/* Gráfico de Pizza */}
                <div style={{ height: getChartHeight(), width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) =>
                          windowWidth >= 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={windowWidth < 640 ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {cityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2E0854",
                          border: "1px solid #ffffff20",
                          borderRadius: "8px",
                          fontSize: windowWidth < 640 ? "12px" : "14px",
                        }}
                      />
                      {windowWidth >= 768 && <Legend />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras */}
                <div style={{ height: getChartHeight(), width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cityData}
                      margin={{ top: 10, right: 10, left: 0, bottom: windowWidth < 640 ? 40 : 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="name"
                        angle={windowWidth < 640 ? -45 : 0}
                        textAnchor={windowWidth < 640 ? "end" : "middle"}
                        height={windowWidth < 640 ? 40 : 30}
                        tick={{ fontSize: getFontSize(), fill: "#ffffff80" }}
                      />
                      <YAxis tick={{ fontSize: getFontSize(), fill: "#ffffff80" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2E0854",
                          border: "1px solid #ffffff20",
                          borderRadius: "8px",
                          fontSize: windowWidth < 640 ? "12px" : "14px",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {cityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
