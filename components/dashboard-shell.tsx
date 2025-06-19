import type React from "react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex-1 space-y-4 md:space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col space-y-4 md:space-y-6 w-full">{children}</div>
    </div>
  )
}
