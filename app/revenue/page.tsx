import { Suspense } from 'react'
import RevenuePage from '@/components/revenue/RevenuePage'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function RevenuePageWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <RevenuePage />
      </Suspense>
    </MainLayout>
  )
} 