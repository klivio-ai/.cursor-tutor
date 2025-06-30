"use client"

interface Transaction {
  id?: string
  montant: number
  description?: string
  date: string
  type: "revenue" | "expense"
  property_id?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
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
            <p className="text-slate-500">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <div
              key={transaction.id || index}
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
                  <p className="font-medium text-slate-900">
                    {transaction.description || `${transaction.type === "revenue" ? "Revenue" : "Expense"} Transaction`}
                  </p>
                  <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "revenue" ? "+" : "-"}€{Math.abs(transaction.montant).toLocaleString()}
                </p>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === "revenue" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.type === "revenue" ? "Revenue" : "Expense"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
