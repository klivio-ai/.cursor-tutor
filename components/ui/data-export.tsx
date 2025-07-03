"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver"

interface ExportOption {
  label: string
  value: string
  data: any[]
  columns: { header: string; accessor: string }[]
}

interface DataExportProps {
  options: ExportOption[]
  defaultOption?: string
  fileName?: string
}

export function DataExport({ 
  options, 
  defaultOption = options[0]?.value,
  fileName = "export"
}: DataExportProps) {
  const [selectedOption, setSelectedOption] = useState(defaultOption)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const selectedData = options.find(opt => opt.value === selectedOption)

  const exportToCSV = () => {
    if (!selectedData) return

    setExporting(true)
    try {
      const headers = selectedData.columns.map(col => col.header)
      const csvContent = [
        headers.join(','),
        ...selectedData.data.map(row => 
          selectedData.columns.map(col => {
            const value = row[col.accessor]
            // Échapper les virgules et guillemets dans les valeurs
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value || ''
          }).join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, `${fileName}_${selectedOption}_${new Date().toISOString().split('T')[0]}.csv`)

      toast({
        title: "Succès",
        description: "Export CSV terminé avec succès",
      })
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'exporter en CSV",
        variant: "destructive"
      })
    } finally {
      setExporting(false)
    }
  }

  const exportToPDF = () => {
    if (!selectedData) return

    setExporting(true)
    try {
      const doc = new jsPDF()
      
      // Titre
      doc.setFontSize(18)
      doc.text(`${selectedData.label} - ${new Date().toLocaleDateString('fr-FR')}`, 14, 22)
      
      // Tableau
      const tableData = selectedData.data.map(row => 
        selectedData.columns.map(col => {
          const value = row[col.accessor]
          if (typeof value === 'number') {
            return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
          if (value instanceof Date) {
            return value.toLocaleDateString('fr-FR')
          }
          return value || ''
        })
      )

      autoTable(doc, {
        head: [selectedData.columns.map(col => col.header)],
        body: tableData,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 30 },
      })

      doc.save(`${fileName}_${selectedOption}_${new Date().toISOString().split('T')[0]}.pdf`)

      toast({
        title: "Succès",
        description: "Export PDF terminé avec succès",
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'exporter en PDF",
        variant: "destructive"
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export de Données</span>
          {selectedData && (
            <Badge variant="secondary">{selectedData.data.length} éléments</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection du type de données */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type de données</label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {option.data.length}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Boutons d'export */}
        {selectedData && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={exportToCSV}
              disabled={exporting || selectedData.data.length === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={exportToPDF}
              disabled={exporting || selectedData.data.length === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        )}

        {/* Informations */}
        {selectedData && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• CSV : Format tableur compatible Excel</p>
            <p>• PDF : Rapport formaté avec mise en page</p>
            <p>• Date d'export : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 