"use client"

interface StatCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down"
  icon: string
  color: "blue" | "green" | "red" | "purple"
}

export function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  }

  const bgColorClasses = {
    blue: "from-blue-50 to-blue-100",
    green: "from-green-50 to-green-100",
    red: "from-red-50 to-red-100",
    purple: "from-purple-50 to-purple-100",
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${bgColorClasses[color]} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          <svg
            className={`w-4 h-4 ${trend === "up" ? "rotate-0" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          <span>{change}</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-slate-600 text-sm">{title}</p>
      </div>
    </div>
  )
}
