import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-light text-slate-900 mb-4">
            Welcome to Your Dashboard
          </h1>
          <div className="space-y-4">
            <p className="text-lg text-slate-600">
              Hello, <span className="font-medium text-slate-900">{user.email}</span>!
            </p>
            <p className="text-slate-600">
              Your email has been successfully verified and your account is ready to use.
            </p>
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 Account Setup Complete
              </p>
              <p className="text-green-700 text-sm mt-1">
                You can now access all features of the application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}