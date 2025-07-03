"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, Image, File } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileUploaded: (fileUrl: string) => void
  currentFileUrl?: string | null
  accept?: string
  maxSize?: number // en MB
  folder?: string
}

export function FileUpload({ 
  onFileUploaded, 
  currentFileUrl, 
  accept = "*/*", 
  maxSize = 10,
  folder = "documents"
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: `Le fichier est trop volumineux. Taille maximale : ${maxSize}MB`,
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      onFileUploaded(publicUrl)
      toast({
        title: "Succès",
        description: "Fichier uploadé avec succès",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le fichier",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async () => {
    if (!currentFileUrl) return

    try {
      // Extraire le chemin du fichier de l'URL
      const urlParts = currentFileUrl.split('/')
      const filePath = urlParts.slice(-2).join('/') // folder/filename

      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (error) throw error

      onFileUploaded("")
      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive"
      })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-4 w-4" />
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const getFileName = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="space-y-4">
      {currentFileUrl ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            {getFileIcon(currentFileUrl)}
            <span className="text-sm font-medium truncate">
              {getFileName(currentFileUrl)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteFile}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez un fichier ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Taille maximale : {maxSize}MB
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Upload en cours..." : "Sélectionner un fichier"}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
} 