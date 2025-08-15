'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PriceDisplay } from './price-display'
import { User } from '@supabase/supabase-js'
import { Measurements } from '@/lib/pricing'

interface ProtectedPricingProps {
  product: string | null
  measurements: Measurements | null
  price: number | null
}

export function ProtectedPricing({ product, measurements, price }: ProtectedPricingProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login?next=' + encodeURIComponent(window.location.pathname))
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600">Checking authentication...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <PriceDisplay
      product={product}
      measurements={measurements}
      price={price}
    />
  )
}