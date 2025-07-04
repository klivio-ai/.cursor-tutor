"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Home, 
  Building2, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Menu, 
  LogOut,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: "Tableau de Bord", href: "/", icon: Home },
  { name: "Propriétés", href: "/properties", icon: Building2 },
  { name: "Locataires", href: "/tenants", icon: Users },
  { name: "Revenus", href: "/revenue", icon: TrendingUp },
  { name: "Dépenses", href: "/expenses", icon: TrendingDown },
  { name: "Paiements", href: "/payments", icon: CreditCard },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo/Brand */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Property Finance</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon 
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t bg-gray-50 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          onClick={signOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
