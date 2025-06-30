import React from "react"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../lib/utils"

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendDirection = "neutral",
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {icon && <div className="rounded-full p-2 bg-gray-100">{icon}</div>}
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {trend && (
          <p
            className={cn(
              "text-xs flex items-center mt-1",
              trendDirection === "up" ? "text-green-600" :
              trendDirection === "down" ? "text-red-600" : "text-gray-500"
            )}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}