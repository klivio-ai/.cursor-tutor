"use client"

import { Card } from "../ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign } from "lucide-react"

interface Transaction {
  id: string
  description?: string
  montant: number
  date: string
  type?: string
  categorie?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No transactions yet</p>
            <p className="text-sm text-slate-400">Your recent transactions will appear here</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {transaction.description || `${transaction.type || "Transaction"}`}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-slate-500">{formatDate(transaction.date)}</span>
                    {transaction.categorie && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.categorie}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "revenue" ? "+" : "-"}
                  {formatAmount(Math.abs(transaction.montant))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
