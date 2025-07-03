import { Suspense } from 'react'
import Dashboard from '@/components/Dashboard'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </MainLayout>
  )
} 