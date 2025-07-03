"use client"

import { useState } from 'react'
import { useData } from "@/hooks/use-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, TrendingUp, DollarSign, Calendar, Building2, Edit, Trash2, Eye } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"
import { RevenueChart } from "./RevenueChart"
import { RevenueStats } from "./RevenueStats"

export default function RevenuePage() {
  const { 
    properties, 
    revenues, 
    loading, 
    error 
  } = useData()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    source: '',
    status: 'Pending',
    property_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const handleAddRevenue = () => {
    // TODO: Implémenter l'ajout de revenu
    console.log('Ajouter revenu:', formData)
    setIsAddDialogOpen(false)
    setFormData({
      description: '',
      amount: '',
      source: '',
      status: 'Pending',
      property_id: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const handleEditRevenue = (revenue: any) => {
    setSelectedRevenue(revenue)
    setFormData({
      description: revenue.description,
      amount: revenue.amount.toString(),
      source: revenue.source,
      status: revenue.status,
      property_id: revenue.property_id || '',
      date: revenue.date,
      notes: revenue.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRevenue = () => {
    // TODO: Implémenter la mise à jour de revenu
    console.log('Mettre à jour revenu:', selectedRevenue.id, formData)
    setIsEditDialogOpen(false)
    setSelectedRevenue(null)
  }

  const handleDeleteRevenue = (revenueId: string) => {
    // TODO: Implémenter la suppression de revenu
    console.log('Supprimer revenu:', revenueId)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Paid': { color: 'bg-green-100 text-green-800', label: 'Payé' },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'Overdue': { color: 'bg-red-100 text-red-800', label: 'En retard' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    return property?.name || 'N/A'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Revenus</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos revenus immobiliers en un seul endroit.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Revenu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau revenu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Loyer mensuel"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Montant (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="Ex: Loyer, Charges"
                  />
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
              <div>
                <Label htmlFor="property">Propriété</Label>
                <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une propriété" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notes optionnelles..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddRevenue}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <RevenueStats revenues={revenues} properties={properties} />

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Évolution des Revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart revenues={revenues} />
        </CardContent>
      </Card>

      {/* Revenues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            Liste des Revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenues.map((revenue) => (
                  <TableRow key={revenue.id}>
                    <TableCell className="font-medium">{revenue.description}</TableCell>
                    <TableCell>{revenue.amount.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>{revenue.source}</TableCell>
                    <TableCell>{getPropertyName(revenue.property_id || '')}</TableCell>
                    <TableCell>{new Date(revenue.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{getStatusBadge(revenue.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditRevenue(revenue)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteRevenue(revenue.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {revenues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Aucun revenu</h3>
                      <p className="text-sm text-gray-500">Commencez par ajouter votre premier revenu.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le revenu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Loyer mensuel"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Montant (€)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-source">Source</Label>
                <Input
                  id="edit-source"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  placeholder="Ex: Loyer, Charges"
                />
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
            <div>
              <Label htmlFor="edit-property">Propriété</Label>
              <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une propriété" />
                </SelectTrigger>
                <SelectContent>
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
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateRevenue}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 