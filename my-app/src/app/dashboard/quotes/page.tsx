import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/services/database'
import { QuotesClient } from '@/components/dashboard/quotes-client'
import type { UserMeasurementWithDetails } from '@/lib/types/database'

async function getInitialQuotes(): Promise<{
  data: UserMeasurementWithDetails[]
  total: number
  hasMore: boolean
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: [], total: 0, hasMore: false }
    }

    const db = new DatabaseService()
    const measurements = await db.getUserMeasurements(user.id, {})

    // Apply initial pagination (first 20 items)
    const limit = 20
    const paginatedData = measurements.slice(0, limit)
    const hasMore = measurements.length > limit

    return {
      data: paginatedData,
      total: measurements.length,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching initial quotes:', error)
    return { data: [], total: 0, hasMore: false }
  }
}

export default async function QuotesPage() {
  const { data: initialData, total: initialTotal, hasMore: initialHasMore } = await getInitialQuotes()

  return (
    <QuotesClient 
      initialData={initialData}
      initialTotal={initialTotal}
      initialHasMore={initialHasMore}
    />
  )
}