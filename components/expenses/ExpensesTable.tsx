"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  FileText,
  Calendar,
  Building2,
  TrendingDown
} from "lucide-react"

interface ExpensesTableProps {
  expenses: any[]
  properties: any[]
  categories: any[]
  onEdit: (expense: any) => void
  onDelete: (expenseId: string) => void
  onView: (expense: any) => void
}

export function ExpensesTable({ expenses, properties, categories, onEdit, onDelete, onView }: ExpensesTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Paid': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Payé' },
      'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'En attente' },
      'Overdue': { color: 'bg-red-100 text-red-800 border-red-200', label: 'En retard' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    return <Badge className={`${config.color} border`}>{config.label}</Badge>
  }

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    return property?.name || 'N/A'
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'N/A'
  }

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense)
    setIsViewDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="h-5 w-5 mr-2 text-red-600" />
            Liste des Dépenses
            <Badge variant="secondary" className="ml-2">
              {expenses.length} dépense{expenses.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold text-right">Montant</TableHead>
                    <TableHead className="font-semibold">Fournisseur</TableHead>
                    <TableHead className="font-semibold">Propriété</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={expense.description}>
                          {expense.description}
                        </div>
                        {expense.category_id && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {getCategoryName(expense.category_id)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {expense.amount.toLocaleString('fr-FR')} €
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px]" title={expense.vendor}>
                          {expense.vendor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[120px]" title={getPropertyName(expense.property_id || '')}>
                            {getPropertyName(expense.property_id || '')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(expense.date)}</span>
                        </div>
                        {expense.due_date && (
                          <div className="text-xs text-gray-500 mt-1">
                            Échéance: {formatDate(expense.due_date)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewExpense(expense)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(expense)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(expense.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <TrendingDown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune dépense</h3>
                        <p className="text-sm text-gray-500">Commencez par ajouter votre première dépense.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de visualisation des détails */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la Dépense</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-600">{selectedExpense.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Montant</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedExpense.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Fournisseur</h4>
                  <p className="text-gray-600">{selectedExpense.vendor}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Propriété</h4>
                  <p className="text-gray-600">{getPropertyName(selectedExpense.property_id || '')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Date de facture</h4>
                  <p className="text-gray-600">{formatDate(selectedExpense.date)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Statut</h4>
                  <div className="mt-1">{getStatusBadge(selectedExpense.status)}</div>
                </div>
              </div>
              
              {selectedExpense.due_date && (
                <div>
                  <h4 className="font-semibold text-gray-900">Date d'échéance</h4>
                  <p className="text-gray-600">{formatDate(selectedExpense.due_date)}</p>
                </div>
              )}
              
              {selectedExpense.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900">Notes</h4>
                  <p className="text-gray-600">{selectedExpense.notes}</p>
                </div>
              )}
              
              {selectedExpense.category_id && (
                <div>
                  <h4 className="font-semibold text-gray-900">Catégorie</h4>
                  <Badge variant="outline">{getCategoryName(selectedExpense.category_id)}</Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 