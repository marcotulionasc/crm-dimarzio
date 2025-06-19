import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LeadForm } from "@/components/lead-form"

export default function CreatePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Criar Novo Lead" text={`Adicione um novo lead ao CRM da ${process.env.CRM_COMPANY_NAME}.`} />
      <div className="grid gap-4">
        <LeadForm />
      </div>
    </DashboardShell>
  )
}
