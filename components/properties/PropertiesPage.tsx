"use client"

import { useState } from 'react'
import { useData } from "@/hooks/use-data"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Building2, MapPin, DollarSign, Calendar, Edit, Trash2, Eye, Users } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"
import { PropertiesMap } from "./PropertiesMap"

export default function PropertiesPage() {
  const { 
    properties, 
    tenants,
    loading, 
    error,
    addProperty,
    updateProperty,
    deleteProperty
  } = useData()

  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    monthly_rent: '',
    rental_price: '',
    current_value: '',
    tenant_id: '',
    payment_status: 'Pending',
    next_due_date: ''
  })

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      type: '',
      monthly_rent: '',
      rental_price: '',
      current_value: '',
      tenant_id: '',
      payment_status: 'Pending',
      next_due_date: ''
    })
  }

  const handleAddProperty = async () => {
    if (!formData.name || !formData.address || !formData.monthly_rent) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (nom, adresse, loyer mensuel).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const propertyData = {
        name: formData.name,
        address: formData.address,
        type: formData.type || null,
        monthly_rent: parseFloat(formData.monthly_rent),
        rental_price: formData.rental_price ? parseFloat(formData.rental_price) : null,
        current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        tenant_id: formData.tenant_id === 'vacant' ? null : formData.tenant_id,
        payment_status: formData.payment_status as 'Paid' | 'Pending' | 'Overdue',
        next_due_date: formData.next_due_date || null
      } as any

      await addProperty(propertyData)
      
      toast({
        title: "Succès",
        description: "Propriété ajoutée avec succès.",
      })
      
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la propriété:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la propriété. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property)
    setFormData({
      name: property.name || '',
      address: property.address,
      type: property.type || '',
      monthly_rent: property.monthly_rent.toString(),
      rental_price: property.rental_price?.toString() || '',
      current_value: property.current_value?.toString() || '',
      tenant_id: property.tenant_id || 'vacant',
      payment_status: property.payment_status,
      next_due_date: property.next_due_date || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProperty = async () => {
    if (!formData.name || !formData.address || !formData.monthly_rent) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (nom, adresse, loyer mensuel).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const propertyData = {
        name: formData.name,
        address: formData.address,
        type: formData.type || null,
        monthly_rent: parseFloat(formData.monthly_rent),
        rental_price: formData.rental_price ? parseFloat(formData.rental_price) : null,
        current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        tenant_id: formData.tenant_id === 'vacant' ? null : formData.tenant_id,
        payment_status: formData.payment_status as 'Paid' | 'Pending' | 'Overdue',
        next_due_date: formData.next_due_date || null,
      }

      await updateProperty(selectedProperty.id, propertyData)
      
      toast({
        title: "Succès",
        description: "Propriété mise à jour avec succès.",
      })
      
      setIsEditDialogOpen(false)
      setSelectedProperty(null)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la propriété:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la propriété. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProperty = (property: any) => {
    setSelectedProperty(property)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProperty = async () => {
    if (!selectedProperty) return

    setIsSubmitting(true)
    try {
      await deleteProperty(selectedProperty.id)
      
      toast({
        title: "Succès",
        description: "Propriété supprimée avec succès.",
      })
      
      setIsDeleteDialogOpen(false)
      setSelectedProperty(null)
    } catch (error) {
      console.error('Erreur lors de la suppression de la propriété:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la propriété. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'Paid': { color: 'bg-green-100 text-green-800', label: 'Payé' },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'Overdue': { color: 'bg-red-100 text-red-800', label: 'En retard' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant?.name || 'Vacant'
  }

  const getPropertyTypeLabel = (type: string) => {
    const typeConfig = {
      'apartment': 'Appartement',
      'house': 'Maison',
      'commercial': 'Commercial',
      'land': 'Terrain'
    }
    return typeConfig[type as keyof typeof typeConfig] || type
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Propriétés</h1>
          <p className="text-gray-600 mt-1">Gérez votre portefeuille immobilier et suivez vos investissements.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Propriété
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle propriété</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de la propriété</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Appartement T3 Centre"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="house">Maison</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthly_rent">Loyer mensuel (€)</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={formData.monthly_rent}
                    onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="rental_price">Prix de location (€)</Label>
                  <Input
                    id="rental_price"
                    type="number"
                    value={formData.rental_price}
                    onChange={(e) => setFormData({...formData, rental_price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="current_value">Valeur actuelle (€)</Label>
                  <Input
                    id="current_value"
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData({...formData, current_value: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenant">Locataire</Label>
                  <Select value={formData.tenant_id} onValueChange={(value) => setFormData({...formData, tenant_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un locataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment_status">Statut de paiement</Label>
                  <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
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
                <Label htmlFor="next_due_date">Prochaine échéance</Label>
                <Input
                  id="next_due_date"
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button onClick={handleAddProperty} disabled={isSubmitting}>
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Propriétés
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
            <p className="text-xs text-gray-500 mt-1">Nombre total de propriétés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valeur Totale
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {properties.reduce((sum, prop) => sum + (prop.current_value || 0), 0).toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-gray-500 mt-1">Valeur totale du portefeuille</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Loyer Mensuel
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {properties.reduce((sum, prop) => sum + prop.monthly_rent, 0).toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-gray-500 mt-1">Revenus locatifs mensuels</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux d'Occupation
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-100">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {properties.length > 0 ? ((properties.filter(prop => prop.tenant_id).length / properties.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {properties.filter(prop => prop.tenant_id).length} occupées / {properties.filter(prop => !prop.tenant_id).length} vacantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Carte des Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertiesMap
            properties={properties}
            tenants={tenants}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
            getTenantName={getTenantName}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la propriété</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nom de la propriété</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Appartement T3 Centre"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Adresse</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Rue de la Paix, 75001 Paris"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-monthly_rent">Loyer mensuel (€)</Label>
                <Input
                  id="edit-monthly_rent"
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-rental_price">Prix de location (€)</Label>
                <Input
                  id="edit-rental_price"
                  type="number"
                  value={formData.rental_price}
                  onChange={(e) => setFormData({...formData, rental_price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-current_value">Valeur actuelle (€)</Label>
                <Input
                  id="edit-current_value"
                  type="number"
                  value={formData.current_value}
                  onChange={(e) => setFormData({...formData, current_value: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-tenant">Locataire</Label>
                <Select value={formData.tenant_id} onValueChange={(value) => setFormData({...formData, tenant_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un locataire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacant">Vacant</SelectItem>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-payment_status">Statut de paiement</Label>
                <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
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
              <Label htmlFor="edit-next_due_date">Prochaine échéance</Label>
              <Input
                id="edit-next_due_date"
                type="date"
                value={formData.next_due_date}
                onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button onClick={handleUpdateProperty} disabled={isSubmitting}>
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Supprimer la propriété</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Êtes-vous sûr de vouloir supprimer cette propriété ?</p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button onClick={confirmDeleteProperty} disabled={isSubmitting} variant="destructive">
                {isSubmitting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 