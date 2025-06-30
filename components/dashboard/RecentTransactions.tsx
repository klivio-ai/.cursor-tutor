"use client"

interface Transaction {
  id: string
  amount: number
  date: string
  description: string
  type: "revenue" | "expense"
  property_id?: string
  category?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-slate-500">No transactions found</p>
        <p className="text-sm text-slate-400">Your recent transactions will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "revenue" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {transaction.type === "revenue" ? "+" : "-"}
            </div>
            <div>
              <p className="font-medium text-slate-900">{transaction.description || "Transaction"}</p>
              <p className="text-sm text-slate-500">
                {formatDate(transaction.date)}
                {transaction.category && ` • ${transaction.category}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "revenue" ? "+" : "-"}€{Math.abs(transaction.amount || 0).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
