"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LeadStats } from "@/components/lead-stats"

export default function StatsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Estatísticas - ${process.env.NEXT_PUBLIC_CRM_COMPANY_NAME || 'Dimarzio Seguros'}`} 
        text="Análise detalhada de métricas e performance dos seus leads." 
      />
      <div className="grid gap-4">
        <LeadStats refreshTrigger={refreshTrigger} />
      </div>
    </DashboardShell>
  )
}
