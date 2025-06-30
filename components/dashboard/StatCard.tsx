"use client"

import { Card } from "../ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down"
  icon: ReactNode
  color: "blue" | "green" | "red" | "purple"
}

const colorClasses = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    light: "bg-blue-50",
  },
  green: {
    bg: "from-green-500 to-green-600",
    text: "text-green-600",
    light: "bg-green-50",
  },
  red: {
    bg: "from-red-500 to-red-600",
    text: "text-red-600",
    light: "bg-red-50",
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    light: "bg-purple-50",
  },
}

export function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {change}
            </span>
            <span className="text-sm text-slate-500">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center`}>
          <div className={colors.text}>{icon}</div>
        </div>
      </div>
    </Card>
  )
}
