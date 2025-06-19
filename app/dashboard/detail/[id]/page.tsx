import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LeadDetails } from "@/components/lead-details"

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <DashboardShell>
      <DashboardHeader heading="Detalhes do Lead" text={`Visualizando lead #${id}`} />
      <div className="grid gap-4">
        <LeadDetails leadId={id} />
      </div>
    </DashboardShell>
  )
}
