import React from "react"
import { formatCurrency, formatDate } from "../../lib/utils"

export function RecentTransactions({ transactions, properties, categories }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Aucune transaction récente</p>
      </div>
    )
  }

  const getPropertyName = (propertyId) => {
    const property = properties?.find(p => p.id === propertyId)
    return property?.name || "Non spécifié"
  }

  const getCategoryName = (categoryId) => {
    const category = categories?.find(c => c.id === categoryId)
    return category?.name || "Non spécifié"
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  transaction.type === 'revenue' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="font-medium text-sm">
                {transaction.description || 'Transaction'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getPropertyName(transaction.property_id)} • {getCategoryName(transaction.category_id)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(transaction.date)}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-semibold ${
                transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}