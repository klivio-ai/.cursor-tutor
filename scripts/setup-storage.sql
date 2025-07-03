-- Script de configuration du stockage Supabase
-- À exécuter dans l'interface SQL de Supabase

-- Créer le bucket pour les documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  5242880, -- 5MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Politique RLS pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Politique RLS pour permettre la lecture des documents publics
CREATE POLICY "Documents are publicly accessible" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
  );

-- Politique RLS pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Users can delete their documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Politique RLS pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Users can update their documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  ); 