import { Suspense } from 'react'
import PropertiesPage from '@/components/properties/PropertiesPage'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function PropertiesPageWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <PropertiesPage />
      </Suspense>
    </MainLayout>
  )
} 