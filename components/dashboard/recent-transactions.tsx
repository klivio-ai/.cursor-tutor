"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type Expense = Database["public"]["Tables"]["expenses"]["Row"]

interface RecentTransactionsProps {
  revenues: Revenue[]
  expenses: Expense[]
}

export function RecentTransactions({ revenues, expenses }: RecentTransactionsProps) {
  // Combine and sort transactions
  const transactions = [
    ...revenues.slice(0, 5).map((revenue) => ({
      id: revenue.id,
      type: "revenue" as const,
      amount: revenue.amount,
      date: revenue.date,
      description: revenue.description || "Revenue",
      category: (revenue as any).categories?.name || "Unknown",
    })),
    ...expenses.slice(0, 5).map((expense) => ({
      id: expense.id,
      type: "expense" as const,
      amount: expense.amount,
      date: expense.date,
      description: expense.description || "Expense",
      category: (expense as any).categories?.name || "Unknown",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Récentes</CardTitle>
        <CardDescription>Vos dernières activités financières</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "revenue" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "revenue" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "revenue" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <Badge variant={transaction.type === "revenue" ? "default" : "destructive"}>
                  {transaction.type === "revenue" ? "Revenu" : "Dépense"}
                </Badge>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">Aucune transaction trouvée</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
