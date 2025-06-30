import { Card } from "../ui/card"

const StatCard = ({ title, value, change, trend, icon, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      light: "from-blue-50 to-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "from-green-500 to-green-600",
      light: "from-green-50 to-green-100",
      text: "text-green-600",
      border: "border-green-200",
    },
    red: {
      bg: "from-red-500 to-red-600",
      light: "from-red-50 to-red-100",
      text: "text-red-600",
      border: "border-red-200",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      light: "from-purple-50 to-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
  }

  const currentColor = colorClasses[color]

  return (
    <Card
      className={`p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${currentColor.border} bg-gradient-to-br ${currentColor.light} hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-10 h-10 bg-gradient-to-r ${currentColor.bg} rounded-lg flex items-center justify-center text-lg`}
            >
              {icon}
            </div>
            <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">{title}</h3>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
              {change && (
                <div className="flex items-center space-x-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trend === "up" ? "↗" : "↘"} {change}
                  </span>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StatCard
