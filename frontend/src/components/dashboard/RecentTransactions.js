export function RecentTransactions({ transactions }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <span className="text-lg font-semibold">Transactions Récentes</span>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    transaction.type === "revenue" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.type === "revenue" ? "Revenu" : "Dépense"}
                </span>
                {transaction.category && <span className="text-xs text-gray-500">{transaction.category}</span>}
                {transaction.paid !== undefined && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      transaction.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.paid ? "Payé" : "En attente"}
                  </span>
                )}
              </div>
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {transaction.property} • {new Date(transaction.date).toLocaleDateString("fr-FR")}
              </p>
              {transaction.status && <p className="text-xs text-gray-500 capitalize">Status: {transaction.status}</p>}
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
    </div>
  )
}
