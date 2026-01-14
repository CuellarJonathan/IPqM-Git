import { Rocket, Calendar, Package, AlertCircle } from 'lucide-react'

// Dados mockados (serão substituídos por consultas ao Supabase)
const mockData = {
  currentLaunch: {
    number: 134,
    description: 'Lançamento de teste no Atlântico Sul',
  },
  daysSinceLastDelivery: 5,
  daysSinceLastSAASS: 12,
  totalSAASS: 24,
}

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card: Lançamento Atual */}
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Lançamento Atual</p>
            <h3 className="text-2xl font-bold mt-2">L{mockData.currentLaunch.number}</h3>
            <p className="text-gray-600 text-sm mt-1 truncate">{mockData.currentLaunch.description}</p>
          </div>
          <Rocket className="text-blue-500" size={32} />
        </div>
        <div className="mt-4 text-xs text-gray-400">
          Última atualização: hoje
        </div>
      </div>

      {/* Card: Dias desde última entrega */}
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Dias desde última entrega de SAASS</p>
            <h3 className="text-2xl font-bold mt-2">{mockData.daysSinceLastDelivery} dias</h3>
            <p className="text-gray-600 text-sm mt-1">Considerando UTC</p>
          </div>
          <Calendar className="text-green-500" size={32} />
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min(mockData.daysSinceLastDelivery * 5, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card: Dias desde último SAASS registrado */}
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Dias desde último SAASS registrado</p>
            <h3 className="text-2xl font-bold mt-2">{mockData.daysSinceLastSAASS} dias</h3>
            <p className="text-gray-600 text-sm mt-1">Baseado na data de fabricação</p>
          </div>
          <Package className="text-amber-500" size={32} />
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full" 
              style={{ width: `${Math.min(mockData.daysSinceLastSAASS * 3, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card: Total de SAASS */}
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de SAASS no sistema</p>
            <h3 className="text-2xl font-bold mt-2">{mockData.totalSAASS}</h3>
            <p className="text-gray-600 text-sm mt-1">Sistemas completos registrados</p>
          </div>
          <AlertCircle className="text-purple-500" size={32} />
        </div>
        <div className="mt-4 text-xs text-gray-400">
          Atualizado em tempo real
        </div>
      </div>
    </div>
  )
}
