import React from "react"
import { cn } from "../../lib/utils"

export function LoadingCard({ rows = 3, className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
        className
      )}
      {...props}
    >
      <div className="animate-pulse space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Spinner({ className, ...props }) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", className)}
      {...props}
    />
  )
}