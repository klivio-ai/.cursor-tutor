"use client"

import type { ReactNode } from "react"
import { Sidebar, MobileSidebar } from "./sidebar"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r bg-gray-50">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 md:hidden">
          <MobileSidebar />
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Property Finance Dashboard</div>
        </div>

        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
