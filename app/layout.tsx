import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ProductConfigProvider } from "@/hooks/use-product-config"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: `${process.env.CRM_COMPANY_NAME || 'Dimarzio Seguros'} CRM`,
  description: "Sistema de gestão de leads e vendas especializado em seguros",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ProductConfigProvider>
            <SidebarProvider>
              <DashboardNav />
              <SidebarInset>
                <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
                  {children}
                </div>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          </ProductConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
