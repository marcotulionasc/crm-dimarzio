"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardStats } from "@/components/dashboard-stats"
import { LeadList } from "@/components/lead-list"

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleStatusUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Dashboard - ${process.env.CRM_COMPANY_NAME || 'Dimarzio Seguros'}`} 
        text="Visão geral dos seus leads e controle de vendas." 
      />
      <div className="grid gap-4">
        <DashboardStats refreshTrigger={refreshTrigger} />
        <LeadList onStatusUpdate={handleStatusUpdate} />
      </div>
    </DashboardShell>
  )
}
