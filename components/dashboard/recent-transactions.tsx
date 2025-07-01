"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  type: "revenue" | "expense"
  description: string
  amount: number
  date: string
  property?: { name: string | null }
  category?: { name: string }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.property?.name} • {transaction.category?.name}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={transaction.type === "revenue" ? "default" : "destructive"}>{transaction.type}</Badge>
                <div
                  className={`text-sm font-medium ${
                    transaction.type === "revenue" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "revenue" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
