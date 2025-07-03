import { Suspense } from 'react'
import PaymentsPage from '@/components/payments/PaymentsPage'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function PaymentsPageWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <PaymentsPage />
      </Suspense>
    </MainLayout>
  )
} 