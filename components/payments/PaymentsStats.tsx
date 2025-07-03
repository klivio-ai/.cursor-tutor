"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign, TrendingUp, Calendar } from "lucide-react"

interface PaymentsStatsProps {
  payments: any[]
  properties: any[]
}

export function PaymentsStats({ payments, properties }: PaymentsStatsProps) {
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const thisMonthPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date)
    const now = new Date()
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
  }).reduce((sum, payment) => sum + payment.amount, 0)
  const avgPaymentAmount = payments.length > 0 ? totalPayments / payments.length : 0
  const totalPropertiesWithPayments = new Set(payments.map(p => p.property_id)).size

  const stats = [
    {
      title: "Total Paiements",
      value: `${totalPayments.toLocaleString('fr-FR')} €`,
      description: "Tous les paiements confondus",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Ce Mois",
      value: `${thisMonthPayments.toLocaleString('fr-FR')} €`,
      description: "Paiements du mois en cours",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Moyenne par Paiement",
      value: `${avgPaymentAmount.toLocaleString('fr-FR')} €`,
      description: "Montant moyen par paiement",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Propriétés Payantes",
      value: totalPropertiesWithPayments.toString(),
      description: `${properties.length} propriétés au total`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 