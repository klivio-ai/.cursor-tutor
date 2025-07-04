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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Dépenses</h1>
          <p className="text-gray-600 mt-1">Suivez et gérez toutes vos dépenses immobilières.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle dépense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Réparation toiture"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Montant (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="vendor">Fournisseur *</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    placeholder="Ex: Entreprise ABC"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date de facture *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Date d'échéance</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
              </div>
              
                <div>
                  <Label htmlFor="property">Propriété</Label>
                  <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                    <SelectTrigger>
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
              
              <FileUpload
                onFileUploaded={(fileUrl) => setFormData({...formData, file_url: fileUrl})}
                currentFileUrl={formData.file_url}
                accept=".pdf"
                maxSize={10}
                folder="expenses"
              />
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notes optionnelles..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddExpense}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <ExpensesFilters 
        properties={properties}
        categories={categories}
        onFiltersChange={setFilters}
      />

      {/* Stats Cards */}
      <ExpensesStats 
        expenses={expenses} 
        properties={properties}
        filteredStats={filteredStats}
      />

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
            Évolution des Dépenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesChart expenses={filteredExpenses} />
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <ExpensesTable
        expenses={filteredExpenses}
        properties={properties}
        categories={categories}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onView={handleViewExpense}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la dépense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Réparation toiture"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Montant (€) *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-vendor">Fournisseur *</Label>
                <Input
                  id="edit-vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  placeholder="Ex: Entreprise ABC"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date de facture *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-due_date">Date d'échéance</Label>
                <Input
                  id="edit-due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
            </div>
            
              <div>
                <Label htmlFor="edit-property">Propriété</Label>
                <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                  <SelectTrigger>
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
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes optionnelles..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateExpense}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 