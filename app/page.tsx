import DashboardCards from '@/components/dashboard/DashboardCards'
import QuickLinks from '@/components/dashboard/QuickLinks'
import RecentActivity from '@/components/dashboard/RecentActivity'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de SAASS e lançamentos</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}
