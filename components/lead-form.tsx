"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useProductConfig } from "@/hooks/use-product-config"

export function LeadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { products } = useProductConfig()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cellPhone: "",
    product: process.env.NEXT_PUBLIC_CRM_DEFAULT_PRODUCT || "dimarzio-auto",
    interessePrincipal: "seguros",
    field03: "", // Status (será definido automaticamente como NOVO)
    field04: "", // Campo extra 1
    field05: "", // Campo extra 2
    field06: "", // Campo extra 3
    field07: "", // Campo extra 4
    field08: "", // Campo extra 5
    field09: "", // Campo extra 6
    tenantId: parseInt(process.env.NEXT_PUBLIC_CRM_TENANT_ID || '6'),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      cellPhone: "",
      product: process.env.NEXT_PUBLIC_CRM_DEFAULT_PRODUCT || "dimarzio-auto",
      interessePrincipal: "seguros",
      field03: "",
      field04: "",
      field05: "",
      field06: "",
      field07: "",
      field08: "",
      field09: "",
      tenantId: parseInt(process.env.NEXT_PUBLIC_CRM_TENANT_ID || '6'),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        field03: "NOVO", // Status inicial
        tenantId: {
          id: formData.tenantId,
        },
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_BASE_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar dados")
      }

      toast({
        title: "Sucesso!",
        description: "Lead cadastrado com sucesso.",
      })

      resetForm()
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o lead.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
                          <CardTitle>Cadastrar Novo Lead - {process.env.NEXT_PUBLIC_CRM_COMPANY_NAME}</CardTitle>
          <CardDescription>Preencha os dados do novo lead para o CRM da Dimarzio Seguros.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo*</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cellPhone">Telefone/WhatsApp*</Label>
              <Input
                id="cellPhone"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Produto de Interesse*</Label>
              <Select value={formData.product} onValueChange={(value) => handleSelectChange("product", value)}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>




        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar Lead
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
