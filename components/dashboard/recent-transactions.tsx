"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRevenues } from "@/hooks/use-revenues"
import { useExpenses } from "@/hooks/use-expenses"
import { TrendingUp, TrendingDown } from "lucide-react"

export function RecentTransactions() {
  const { revenues } = useRevenues()
  const { expenses } = useExpenses()

  // Combine and sort recent transactions
  const recentTransactions = [
    ...revenues.slice(0, 5).map((revenue) => ({
      id: revenue.id,
      type: "revenue" as const,
      description: revenue.description,
      amount: Number(revenue.amount),
      date: revenue.date,
      status: revenue.status,
    })),
    ...expenses.slice(0, 5).map((expense) => ({
      id: expense.id,
      type: "expense" as const,
      description: expense.description,
      amount: Number(expense.amount),
      date: expense.date,
      status: expense.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {transaction.type === "revenue" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    transaction.type === "revenue" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "revenue" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </span>
                <Badge variant={transaction.status === "paid" ? "default" : "secondary"}>{transaction.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
