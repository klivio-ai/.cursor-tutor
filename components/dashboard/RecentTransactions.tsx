import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Transaction {
  id: string
  type: "revenue" | "expense"
  amount: number
  description: string
  date: string
  property?: string
  category?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Transactions Récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={transaction.type === "revenue" ? "default" : "destructive"}>
                    {transaction.type === "revenue" ? "Revenu" : "Dépense"}
                  </Badge>
                  {transaction.category && <span className="text-xs text-gray-500">{transaction.category}</span>}
                </div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {transaction.property} • {new Date(transaction.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "revenue" ? "+" : "-"}
                  {transaction.amount.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-center text-gray-500 py-4">Aucune transaction trouvée</p>}
        </div>
      </CardContent>
    </Card>
  )
}
