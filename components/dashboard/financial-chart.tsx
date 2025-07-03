"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LabelList } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"
import { useState } from "react"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type Expense = Database["public"]["Tables"]["expenses"]["Row"]

interface FinancialChartProps {
  revenues: Revenue[]
  expenses: Expense[]
}

export function FinancialChart({ revenues, expenses }: FinancialChartProps) {
  // Préparer les données sur 12 mois glissants
  const getLast12Months = () => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleDateString("fr-FR", { month: "short" }),
        revenue: 0,
        expense: 0,
        net: 0,
      })
    }
    return months
  }

  const chartData = getLast12Months()

  // Remplir les revenus
  revenues.forEach((revenue) => {
    const date = new Date(revenue.date)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    const month = chartData.find((item) => item.key === key)
    if (month) {
      month.revenue += revenue.amount
    }
  })

  // Remplir les dépenses (en négatif)
  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    const month = chartData.find((item) => item.key === key)
    if (month) {
      month.expense -= Math.abs(expense.amount) // Toujours négatif
    }
  })

  // Calculer le cash flow net
  chartData.forEach((item) => {
    item.net = item.revenue + item.expense // Additionne car expense est négatif
  })

  // Pour l'effet de survol
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Tooltip custom moderne
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p: any) => p.dataKey === "revenue")?.value || 0
      const exp = payload.find((p: any) => p.dataKey === "expense")?.value || 0
      const net = payload.find((p: any) => p.dataKey === "net")?.value || 0
      return (
        <div className="bg-white/95 p-4 border border-gray-200 rounded-xl shadow-xl min-w-[160px]">
          <div className="font-semibold text-gray-800 mb-2 text-base">{label}</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-700 font-medium">Revenus</span>
            <span className="ml-auto font-bold">{formatCurrency(rev)}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-700 font-medium">Dépenses</span>
            <span className="ml-auto font-bold">{formatCurrency(Math.abs(exp))}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black" />
            <span className="text-gray-900 font-medium">Cash Flow Net</span>
            <span className={`ml-auto font-bold ${net >= 0 ? "text-black" : "text-red-600"}`}>{formatCurrency(net)}</span>
          </div>
        </div>
      )
    }
    return null
  }

  // Styles custom pour les labels
  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value, fill } = props
    if (!value || value === 0) return null
    return (
      <foreignObject x={x + width / 2 - 30} y={y - 32} width={60} height={28} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          padding: '2px 8px',
          fontWeight: 700,
          fontSize: 13,
          color: fill,
          textAlign: 'center',
          border: `1.5px solid ${fill}`
        }}>{value > 0 ? `€${value.toLocaleString()}` : `€${Math.abs(value).toLocaleString()}`}</div>
      </foreignObject>
    )
  }

  const renderCustomLineLabel = (props: any) => {
    const { x, y, value } = props
    if (!value || value === 0) return <g />
    return (
      <g>
        <rect x={x - 30} y={y - 36} width={60} height={28} rx={12} fill="#fff" stroke="#111" strokeWidth={1.5} filter="url(#shadow)" />
        <text x={x} y={y - 18} textAnchor="middle" fontWeight={700} fontSize={13} fill="#111">{`€${value.toLocaleString()}`}</text>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.07" />
          </filter>
        </defs>
      </g>
    )
  }

  return (
    <Card className="border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            📊 Cash Flow (Revenus, Dépenses & Net)
          </CardTitle>
          {/* Légende custom moderne */}
          <div className="flex items-center gap-5 text-sm font-semibold">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500" /> Revenus</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Dépenses</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-black" /> Cash Flow Net</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] bg-white rounded-2xl shadow-inner flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 0, bottom: 10 }}
              barCategoryGap={10}
              barGap={2}
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex != null && !isNaN(Number(state.activeTooltipIndex))) {
                  setActiveIndex(Number(state.activeTooltipIndex))
                } else {
                  setActiveIndex(null)
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="label" stroke="#A0AEC0" fontSize={14} tickLine={false} axisLine={false} />
              <YAxis stroke="#A0AEC0" fontSize={14} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v.toLocaleString()}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#e0e7ef", opacity: 0.25 }} />
              {/* Barres revenus */}
              <Bar dataKey="revenue" name="Revenus" fill="#10B981" radius={[8, 8, 0, 0]} minPointSize={2} isAnimationActive={true} stackId="cashflow" >
                <LabelList dataKey="revenue" content={renderCustomBarLabel} />
              </Bar>
              {/* Barres dépenses */}
              <Bar dataKey="expense" name="Dépenses" fill="#EF4444" radius={[8, 8, 8, 8]} minPointSize={2} isAnimationActive={true} stackId="cashflow" >
                <LabelList dataKey="expense" content={(props: any) => {
                  const { x, y, width, value, fill } = props
                  if (!value || value === 0) return null
                  return (
                    <foreignObject x={x + width / 2 - 30} y={y - 32} width={60} height={28} style={{ pointerEvents: 'none' }}>
                      <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        padding: '2px 8px',
                        fontWeight: 700,
                        fontSize: 13,
                        color: fill,
                        textAlign: 'center',
                        border: `1.5px solid ${fill}`
                      }}>{value < 0 ? `-€${Math.abs(value).toLocaleString()}` : `€${value.toLocaleString()}`}</div>
                    </foreignObject>
                  )
                }} />
              </Bar>
              {/* Courbe cash flow net */}
              <Line
                type="monotone"
                dataKey="net"
                name="Cash Flow Net"
                stroke="#111"
                strokeWidth={4}
                dot={{ r: 6, fill: '#fff', stroke: '#111', strokeWidth: 3, filter: activeIndex !== null ? 'drop-shadow(0 0 6px #1116)' : undefined }}
                activeDot={{ r: 9, fill: '#111', stroke: '#fff', strokeWidth: 3 }}
                isAnimationActive={true}
                label={renderCustomLineLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
