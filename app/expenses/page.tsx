import { Suspense } from 'react'
import ExpensesPage from '@/components/expenses/ExpensesPage'
import { Loading } from '@/components/ui/loading'
import { MainLayout } from '@/components/layout/main-layout'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function ExpensesPageWrapper() {
  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <ExpensesPage />
      </Suspense>
    </MainLayout>
  )
} 