import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Transaction {
  id: string
  type: "revenue" | "expense"
  description: string
  amount: number
  date: string
  property?: any
  category?: any
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={transaction.type === "revenue" ? "default" : "destructive"}>
                    {transaction.type === "revenue" ? "Revenue" : "Expense"}
                  </Badge>
                  {transaction.category && <span className="text-xs text-gray-500">{transaction.category.name}</span>}
                </div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {transaction.property?.name} • {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "revenue" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && <p className="text-center text-gray-500 py-4">No transactions found</p>}
        </div>
      </CardContent>
    </Card>
  )
}
