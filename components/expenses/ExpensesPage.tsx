"use client"

import { useState, useMemo } from 'react'
import { useData } from "@/hooks/use-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, TrendingDown, DollarSign, Calendar, Building2, Edit, Trash2, Eye, FileText, Upload } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"
import { ExpensesChart } from "./ExpensesChart"
import { ExpensesStats } from "./ExpensesStats"
import { ExpensesFilters } from "./ExpensesFilters"
import { ExpensesTable } from "./ExpensesTable"
import { FileUpload } from "@/components/ui/file-upload"
import { supabase } from "@/lib/supabase"

export default function ExpensesPage() {
  const { 
    properties, 
    expenses, 
    categories,
    loading, 
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch
  } = useData()

  const [filters, setFilters] = useState({
    search: '',
    property: 'all',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  })

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    vendor: '',
    status: 'Pending',
    property_id: 'none',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
    category: 'none',
    file_url: ''
  })

  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  // Filtrage des dépenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filtre de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          expense.description.toLowerCase().includes(searchLower) ||
          expense.vendor.toLowerCase().includes(searchLower) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Filtre par propriété
      if (filters.property !== 'all' && expense.property_id !== filters.property) {
        return false
      }

      // Filtre par statut
      if (filters.status !== 'all' && expense.status !== filters.status) {
        return false
      }

      // Filtre par catégorie
      if (filters.category !== 'all' && expense.category_id !== filters.category) {
        return false
      }

      // Filtre par date de début
      if (filters.dateFrom) {
        const expenseDate = new Date(expense.date)
        const fromDate = new Date(filters.dateFrom)
        if (expenseDate < fromDate) return false
      }

      // Filtre par date de fin
      if (filters.dateTo) {
        const expenseDate = new Date(expense.date)
        const toDate = new Date(filters.dateTo)
        if (expenseDate > toDate) return false
      }

      // Filtre par montant minimum
      if (filters.amountMin) {
        const minAmount = parseFloat(filters.amountMin)
        if (expense.amount < minAmount) return false
      }

      // Filtre par montant maximum
      if (filters.amountMax) {
        const maxAmount = parseFloat(filters.amountMax)
        if (expense.amount > maxAmount) return false
      }

      return true
    })
  }, [expenses, filters])

  // Statistiques calculées sur les dépenses filtrées
  const filteredStats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const paid = filteredExpenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0)
    const pending = filteredExpenses.filter(exp => exp.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0)
    const overdue = filteredExpenses.filter(exp => exp.status === 'Overdue').reduce((sum, exp) => sum + exp.amount, 0)
    const avg = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0

    return {
      total,
      paid,
      pending,
      overdue,
      average: avg,
      count: filteredExpenses.length
    }
  }, [filteredExpenses])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const handleAddExpense = async () => {
    try {
      let fileUrl = null
      
      // Upload du fichier si sélectionné
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `expenses/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)
        
        fileUrl = publicUrl
      }

      // Préparation des données de la dépense
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor,
        status: formData.status,
        property_id: formData.property_id === 'none' ? null : formData.property_id,
        category_id: formData.category === 'none' ? '' : formData.category,
        date: formData.date,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        file_url: fileUrl,
        paid: formData.status === 'Paid',
        reference: null,
        user_id: null
      }

      await addExpense(expenseData)
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error)
      // TODO: Afficher une notification d'erreur
    }
  }

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      vendor: expense.vendor,
      status: expense.status,
      property_id: expense.property_id || 'none',
      date: expense.date,
      due_date: expense.due_date || '',
      notes: expense.notes || '',
      category: expense.category_id || 'none',
      file_url: expense.file_url || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateExpense = async () => {
    try {
      let fileUrl = selectedExpense?.file_url || null
      
      // Upload du nouveau fichier si sélectionné
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `expenses/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)
        
        fileUrl = publicUrl
      }

      // Préparation des données de mise à jour
      const updateData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor,
        status: formData.status,
        property_id: formData.property_id === 'none' ? null : formData.property_id,
        category_id: formData.category === 'none' ? '' : formData.category,
        date: formData.date,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        file_url: fileUrl,
        paid: formData.status === 'Paid'
      }

      await updateExpense(selectedExpense.id, updateData)
      setIsEditDialogOpen(false)
      setSelectedExpense(null)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense:', error)
      // TODO: Afficher une notification d'erreur
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId)
      // TODO: Afficher une notification de succès
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error)
      // TODO: Afficher une notification d'erreur
    }
  }

  const handleViewExpense = (expense: any) => {
    // Cette fonction sera gérée par le composant ExpensesTable
    console.log('Voir dépense:', expense)
  }

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      vendor: '',
      status: 'Pending',
      property_id: 'none',
      date: new Date().toISOString().split('T')[0],
      due_date: '',
      notes: '',
      category: 'none',
      file_url: ''
    })
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 truncate">
                Gestion des Dépenses
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
                Suivez et gérez toutes vos dépenses immobilières en temps réel.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Nouvelle Dépense</span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Ajouter une nouvelle dépense</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Ex: Réparation toiture"
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-medium">Montant (€) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor" className="text-sm font-medium">Fournisseur *</Label>
                        <Input
                          id="vendor"
                          value={formData.vendor}
                          onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                          placeholder="Ex: Entreprise ABC"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune catégorie</SelectItem>
                            {expenseCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">Statut</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">En attente</SelectItem>
                            <SelectItem value="Paid">Payé</SelectItem>
                            <SelectItem value="Overdue">En retard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium">Date de facture *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_date" className="text-sm font-medium">Date d'échéance</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property" className="text-sm font-medium">Propriété</Label>
                      <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une propriété" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune propriété</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Document</Label>
                      <FileUpload
                        onFileUploaded={(fileUrl) => setFormData({...formData, file_url: fileUrl})}
                        currentFileUrl={formData.file_url}
                        accept=".pdf"
                        maxSize={10}
                        folder="expenses"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Notes optionnelles..."
                        rows={3}
                        className="w-full resize-none"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                        Annuler
                      </Button>
                      <Button onClick={handleAddExpense} className="w-full sm:w-auto">
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filtres */}
          <div className="w-full">
            <ExpensesFilters 
              properties={properties}
              categories={categories}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Stats Cards */}
          <div className="w-full">
            <ExpensesStats 
              expenses={expenses} 
              properties={properties}
              filteredStats={filteredStats}
            />
          </div>

          {/* Chart */}
          <Card className="w-full shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Évolution des Dépenses
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ExpensesChart expenses={filteredExpenses} showTitle={false} />
            </CardContent>
          </Card>

          {/* Expenses Table */}
          <div className="w-full">
            <ExpensesTable
              expenses={filteredExpenses}
              properties={properties}
              categories={categories}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onView={handleViewExpense}
            />
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Modifier la dépense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Ex: Réparation toiture"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount" className="text-sm font-medium">Montant (€) *</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor" className="text-sm font-medium">Fournisseur *</Label>
                    <Input
                      id="edit-vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      placeholder="Ex: Entreprise ABC"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-sm font-medium">Catégorie</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune catégorie</SelectItem>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-sm font-medium">Statut</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">En attente</SelectItem>
                        <SelectItem value="Paid">Payé</SelectItem>
                        <SelectItem value="Overdue">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date" className="text-sm font-medium">Date de facture *</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-due_date" className="text-sm font-medium">Date d'échéance</Label>
                    <Input
                      id="edit-due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-property" className="text-sm font-medium">Propriété</Label>
                  <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une propriété" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune propriété</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notes optionnelles..."
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateExpense} className="w-full sm:w-auto">
                    Mettre à jour
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
} 