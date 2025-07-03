"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Sidebar, MobileSidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  
  // Fonction pour obtenir le titre de la page
  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      "/": "Tableau de Bord",
      "/properties": "Propriétés",
      "/tenants": "Locataires", 
      "/revenue": "Revenus",
      "/expenses": "Dépenses",
      "/payments": "Paiements",
      "/settings": "Paramètres"
    }
    return titles[path] || "Dashboard"
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 border-r bg-white shadow-sm">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-72">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <MobileSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold leading-6 text-gray-900 truncate">
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(pathname)}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez votre portefeuille immobilier efficacement
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
