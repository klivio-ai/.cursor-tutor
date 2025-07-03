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
import { Plus, Building2, MapPin, DollarSign, Calendar, Edit, Trash2, Eye, Users } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"
import { PropertiesStats } from "./PropertiesStats"
import { PropertiesMap } from "./PropertiesMap"

export default function PropertiesPage() {
  const { 
    properties, 
    tenants,
    loading, 
    error 
  } = useData()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
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

  const handleAddProperty = () => {
    // TODO: Implémenter l'ajout de propriété
    console.log('Ajouter propriété:', formData)
    setIsAddDialogOpen(false)
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

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property)
    setFormData({
      name: property.name || '',
      address: property.address,
      type: property.type || '',
      monthly_rent: property.monthly_rent.toString(),
      rental_price: property.rental_price?.toString() || '',
      current_value: property.current_value?.toString() || '',
      tenant_id: property.tenant_id || '',
      payment_status: property.payment_status,
      next_due_date: property.next_due_date || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProperty = () => {
    // TODO: Implémenter la mise à jour de propriété
    console.log('Mettre à jour propriété:', selectedProperty.id, formData)
    setIsEditDialogOpen(false)
    setSelectedProperty(null)
  }

  const handleDeleteProperty = (propertyId: string) => {
    // TODO: Implémenter la suppression de propriété
    console.log('Supprimer propriété:', propertyId)
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
                      <SelectItem value="">Vacant</SelectItem>
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddProperty}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <PropertiesStats properties={properties} tenants={tenants} />

      {/* Properties Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Carte des Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertiesMap properties={properties} />
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building2 className="h-5 w-5 mr-2 text-purple-600" />
            Liste des Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPropertyTypeLabel(property.type || '')}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{property.address}</TableCell>
                    <TableCell>{property.monthly_rent.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>{property.current_value?.toLocaleString('fr-FR') || '-'} €</TableCell>
                    <TableCell>{getTenantName(property.tenant_id || '')}</TableCell>
                    <TableCell>{getPaymentStatusBadge(property.payment_status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune propriété</h3>
                      <p className="text-sm text-gray-500">Commencez par ajouter votre première propriété.</p>
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
                    <SelectItem value="">Vacant</SelectItem>
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateProperty}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 