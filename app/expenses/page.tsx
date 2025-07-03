import { Suspense } from 'react'
import Dashboard from '@/components/Dashboard'
import { Loading } from '@/components/ui/loading'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function ExpensesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
} 