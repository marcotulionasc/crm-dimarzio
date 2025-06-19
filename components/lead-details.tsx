"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Phone, ArrowLeft, Mail, User, MessageCircle, Calendar, MapPin, Home, Building } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Metropole } from "@/types/lead"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LEAD_STATUS = [
  { value: "NOVO", label: "Novo", color: "bg-blue-500" },
  { value: "CONTATO_FEITO", label: "Contato Feito", color: "bg-yellow-500" },
  { value: "QUALIFICADO", label: "Qualificado", color: "bg-green-500" },
  { value: "NÃO_QUALIFICADO", label: "Não Qualificado", color: "border-red-400 text-red-400" },
  { value: "QUALIFICADO_OP", label: "Qualificado OP", color: "bg-purple-500" },
  { value: "PROPOSTA", label: "Proposta", color: "bg-orange-500" },
  { value: "FECHADO", label: "Fechado", color: "bg-teal-500" },
]

interface LeadDetailsProps {
  leadId: string
}

export function LeadDetails({ leadId }: LeadDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<Metropole | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const tenantId = process.env.NEXT_PUBLIC_CRM_TENANT_ID || "6"
  const product = process.env.NEXT_PUBLIC_CRM_DEFAULT_PRODUCT || "dimarzio-auto"

  useEffect(() => {
    fetchLead()
  }, [leadId])

  const fetchLead = async () => {
    setLoading(true)
    try {
      // Buscar todos os leads e filtrar pelo ID (já que a API não tem endpoint individual)
      const response = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_BASE_URL}/data/${tenantId}/${product}`)
      if (!response.ok) {
        throw new Error("Falha ao buscar dados")
      }
      const data = await response.json()
      const foundLead = data.find((l: Metropole) => l.id.toString() === leadId)
      
      if (!foundLead) {
        throw new Error("Lead não encontrado")
      }
      
      setLead(foundLead)
    } catch (error) {
      console.error("Erro ao buscar lead:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar os detalhes do lead",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    if (!lead || !lead.cellPhone) return
    
    const formattedPhone = lead.cellPhone.replace(/\D/g, "")
    const template = process.env.NEXT_PUBLIC_CRM_WHATSAPP_TEMPLATE || 'Olá {nome}, estamos entrando em contato sobre seu interesse em nossos produtos de seguros.'
    const message = encodeURIComponent(template.replace('{nome}', lead.name || ""))
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank")
  }

  const handleEmailClick = () => {
    if (!lead || !lead.email) return
    
    const companyName = process.env.NEXT_PUBLIC_CRM_COMPANY_NAME || 'Dimarzio Seguros'
    const subject = encodeURIComponent(`${companyName} - Seu interesse em seguros`)
    const body = encodeURIComponent(`Olá ${lead.name || ""},\n\nEntramos em contato sobre seu interesse em nossos produtos de seguros.\n\nAtenciosamente,\nEquipe ${companyName}`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, "_blank")
  }

  const handleUpdateStatus = async (status: string) => {
    if (!lead) return
    
    setUpdatingStatus(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_BASE_URL}/update/${lead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field03: status,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar lead")
      }

      toast({
        title: "Sucesso!",
        description: `Status atualizado para ${status}`,
      })

      // Atualizar o lead local
      setLead({ ...lead, field03: status })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do lead",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Data inválida"
      }
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Carregando detalhes do lead...</span>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead não encontrado</h2>
            <p className="text-gray-600 mb-4">O lead solicitado não foi encontrado ou foi removido.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStatus = LEAD_STATUS.find(s => s.value === lead.field03) || LEAD_STATUS[0]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Lead</h1>
            <p className="text-gray-600">ID: {lead.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={lead.field03 || "NOVO"}
            onValueChange={handleUpdateStatus}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Informações principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações pessoais */}
        <Card>
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <p className="text-lg font-semibold text-gray-900">{lead.name || "Não informado"}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">E-mail</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{lead.email || "Não informado"}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Telefone</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{lead.cellPhone || "Não informado"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleWhatsAppClick}
                disabled={!lead.cellPhone}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailClick}
                disabled={!lead.email}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status e Datas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Status e Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Status Atual</label>
              <div className="mt-1">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {currentStatus.label}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Data de Criação</label>
              <p className="text-gray-900">{formatDate(lead.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Última Atualização</label>
              <p className="text-gray-900">{formatDate(lead.updatedAt)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Produto</label>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{lead.product || process.env.NEXT_PUBLIC_CRM_COMPANY_NAME || 'Dimarzio Seguros'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Informações do Projeto
          </CardTitle>
          <CardDescription>
            Detalhes sobre o interesse e projeto do cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Localização</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{lead.field01 || "Não informado"}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Interesse Principal</label>
              <p className="text-gray-900 mt-1">{lead.interessePrincipal || "Não especificado"}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Descrição do Projeto</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900">
                {lead.field02 || "Nenhuma descrição fornecida"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campos adicionais (se houver dados) */}
      {(lead.field04 || lead.field05 || lead.field06) && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {lead.field04 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Campo 4</label>
                  <p className="text-gray-900 mt-1">{lead.field04}</p>
                </div>
              )}
              {lead.field05 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Campo 5</label>
                  <p className="text-gray-900 mt-1">{lead.field05}</p>
                </div>
              )}
              {lead.field06 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Campo 6</label>
                  <p className="text-gray-900 mt-1">{lead.field06}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
