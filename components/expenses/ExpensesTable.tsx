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
      <Card className="w-full shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <DollarSign className="h-5 w-5 mr-2 text-red-600" />
            <span className="hidden sm:inline">Liste des Dépenses</span>
            <span className="sm:hidden">Dépenses</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {expenses.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-12 px-4">
              <TrendingDown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune dépense</h3>
              <p className="text-sm text-gray-500">Commencez par ajouter votre première dépense.</p>
            </div>
          ) : (
            <>
              {/* Vue mobile - Cards */}
              <div className="block sm:hidden space-y-4 p-4">
                {expenses.map((expense) => (
                  <Card key={expense.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate text-sm">
                            {expense.description}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {expense.vendor}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewExpense(expense)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
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
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-red-600">
                          {expense.amount.toLocaleString('fr-FR')} €
                        </span>
                        {getStatusBadge(expense.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(expense.date)}
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[100px]">
                            {getPropertyName(expense.property_id || '')}
                          </span>
                        </div>
                      </div>
                      {expense.category_id && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(expense.category_id)}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Vue desktop - Table */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-xs sm:text-sm">Description</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-right">Montant</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm hidden lg:table-cell">Fournisseur</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm hidden xl:table-cell">Propriété</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm">Statut</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-medium max-w-[200px] lg:max-w-[300px]">
                            <div className="space-y-1">
                              <div className="truncate text-sm" title={expense.description}>
                                {expense.description}
                              </div>
                              {expense.category_id && (
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryName(expense.category_id)}
                                </Badge>
                              )}
                              <div className="lg:hidden text-xs text-gray-500">
                                {expense.vendor}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600 text-sm">
                            {expense.amount.toLocaleString('fr-FR')} €
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="truncate max-w-[150px] text-sm" title={expense.vendor}>
                              {expense.vendor}
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[120px] text-sm" title={getPropertyName(expense.property_id || '')}>
                                {getPropertyName(expense.property_id || '')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-sm">{formatDate(expense.date)}</span>
                              </div>
                              {expense.due_date && (
                                <div className="text-xs text-gray-500">
                                  Échéance: {formatDate(expense.due_date)}
                                </div>
                              )}
                              <div className="xl:hidden text-xs text-gray-500 flex items-center">
                                <Building2 className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[80px]">
                                  {getPropertyName(expense.property_id || '')}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(expense.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de visualisation des détails */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Détails de la Dépense</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedExpense.description}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Montant</h4>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">
                    {selectedExpense.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Fournisseur</h4>
                  <p className="text-gray-600 text-sm">{selectedExpense.vendor}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Propriété</h4>
                  <p className="text-gray-600 text-sm">{getPropertyName(selectedExpense.property_id || '')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Date de facture</h4>
                  <p className="text-gray-600 text-sm">{formatDate(selectedExpense.date)}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Statut</h4>
                  <div className="mt-1">{getStatusBadge(selectedExpense.status)}</div>
                </div>
              </div>
              
              {selectedExpense.due_date && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Date d'échéance</h4>
                  <p className="text-gray-600 text-sm">{formatDate(selectedExpense.due_date)}</p>
                </div>
              )}
              
              {selectedExpense.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Notes</h4>
                  <p className="text-gray-600 text-sm">{selectedExpense.notes}</p>
                </div>
              )}
              
              {selectedExpense.category_id && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Catégorie</h4>
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