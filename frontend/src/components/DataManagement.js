import React, { useState } from 'react'
import { addSampleData, clearAllData } from '../utils/sample-data'
import { createDatabaseTables, getManualSQLCommands } from '../utils/database-setup'
import { createProperty, createRevenu, createDepense } from '../lib/data-service'
import { Card, CardContent } from './ui/card'

export function DataManagement({ onDataAdded }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForms, setShowForms] = useState(false)

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    address: '',
    type: 'Appartement',
    status: 'Vacant',
    rental_price: ''
  })

  const [revenueForm, setRevenueForm] = useState({
    description: '',
    amount: '',
    source: '',
    property_id: '',
    category_id: 'cat-1',
    date: new Date().toISOString().split('T')[0]
  })

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    vendor: '',
    property_id: '',
    category_id: 'cat-2',
    date: new Date().toISOString().split('T')[0]
  })

  const handleAddSampleData = async () => {
    setIsLoading(true)
    setMessage('Ajout des données d\'exemple...')
    
    const success = await addSampleData()
    
    if (success) {
      setMessage('✅ Données d\'exemple ajoutées avec succès!')
      if (onDataAdded) onDataAdded()
    } else {
      setMessage('❌ Erreur lors de l\'ajout des données')
    }
    
    setIsLoading(false)
  }

  const handleClearData = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
      return
    }
    
    setIsLoading(true)
    setMessage('Suppression des données...')
    
    const success = await clearAllData()
    
    if (success) {
      setMessage('✅ Toutes les données ont été supprimées')
      if (onDataAdded) onDataAdded()
    } else {
      setMessage('❌ Erreur lors de la suppression')
    }
    
    setIsLoading(false)
  }

  const handleAddProperty = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const propertyData = {
        ...propertyForm,
        id: `prop-${Date.now()}`,
        rental_price: propertyForm.rental_price ? Number(propertyForm.rental_price) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await createProperty(propertyData)
      setMessage('✅ Propriété ajoutée avec succès!')
      setPropertyForm({ name: '', address: '', type: 'Appartement', status: 'Vacant', rental_price: '' })
      if (onDataAdded) onDataAdded()
    } catch (error) {
      setMessage('❌ Erreur lors de l\'ajout de la propriété: ' + error.message)
    }
    
    setIsLoading(false)
  }

  const handleAddRevenue = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const revenueData = {
        ...revenueForm,
        id: `rev-${Date.now()}`,
        amount: Number(revenueForm.amount),
        status: 'Reçu',
        paid: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await createRevenu(revenueData)
      setMessage('✅ Revenu ajouté avec succès!')
      setRevenueForm({ 
        description: '', 
        amount: '', 
        source: '', 
        property_id: '', 
        category_id: 'cat-1',
        date: new Date().toISOString().split('T')[0] 
      })
      if (onDataAdded) onDataAdded()
    } catch (error) {
      setMessage('❌ Erreur lors de l\'ajout du revenu: ' + error.message)
    }
    
    setIsLoading(false)
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const expenseData = {
        ...expenseForm,
        id: `exp-${Date.now()}`,
        amount: Number(expenseForm.amount),
        status: 'Payé',
        paid: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await createDepense(expenseData)
      setMessage('✅ Dépense ajoutée avec succès!')
      setExpenseForm({ 
        description: '', 
        amount: '', 
        vendor: '', 
        property_id: '', 
        category_id: 'cat-2',
        date: new Date().toISOString().split('T')[0] 
      })
      if (onDataAdded) onDataAdded()
    } catch (error) {
      setMessage('❌ Erreur lors de l\'ajout de la dépense: ' + error.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Sample Data Controls */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Gestion des Données</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleAddSampleData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : 'Ajouter Données d\'Exemple'}
            </button>
            
            <button
              onClick={handleClearData}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Supprimer Toutes les Données
            </button>
            
            <button
              onClick={() => setShowForms(!showForms)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {showForms ? 'Masquer' : 'Afficher'} Formulaires
            </button>
          </div>
          
          {message && (
            <div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forms */}
      {showForms && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Property Form */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Ajouter une Propriété</h4>
              <form onSubmit={handleAddProperty} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nom de la propriété"
                  value={propertyForm.name}
                  onChange={(e) => setPropertyForm({...propertyForm, name: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={propertyForm.address}
                  onChange={(e) => setPropertyForm({...propertyForm, address: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <select
                  value={propertyForm.type}
                  onChange={(e) => setPropertyForm({...propertyForm, type: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                  <option value="Studio">Studio</option>
                </select>
                <input
                  type="number"
                  placeholder="Loyer mensuel (€)"
                  value={propertyForm.rental_price}
                  onChange={(e) => setPropertyForm({...propertyForm, rental_price: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Ajouter Propriété
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Revenue Form */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Ajouter un Revenu</h4>
              <form onSubmit={handleAddRevenue} className="space-y-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={revenueForm.description}
                  onChange={(e) => setRevenueForm({...revenueForm, description: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Montant (€)"
                  value={revenueForm.amount}
                  onChange={(e) => setRevenueForm({...revenueForm, amount: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Source"
                  value={revenueForm.source}
                  onChange={(e) => setRevenueForm({...revenueForm, source: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="ID Propriété (ex: prop-1)"
                  value={revenueForm.property_id}
                  onChange={(e) => setRevenueForm({...revenueForm, property_id: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={revenueForm.date}
                  onChange={(e) => setRevenueForm({...revenueForm, date: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Ajouter Revenu
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Expense Form */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Ajouter une Dépense</h4>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Montant (€)"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Fournisseur"
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="ID Propriété (ex: prop-1)"
                  value={expenseForm.property_id}
                  onChange={(e) => setExpenseForm({...expenseForm, property_id: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Ajouter Dépense
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}