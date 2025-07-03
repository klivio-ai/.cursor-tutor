import { Suspense } from 'react'
import TenantsPage from '@/components/tenants/TenantsPage'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function TenantsPageWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <TenantsPage />
      </Suspense>
    </MainLayout>
  )
} 