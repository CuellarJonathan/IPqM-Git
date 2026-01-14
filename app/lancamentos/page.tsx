import LaunchTable from '@/components/lancamentos/LaunchTable'
import DeliveryForecast from '@/components/lancamentos/DeliveryForecast'

export default function LancamentosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lançamentos</h1>
        <p className="text-gray-600">Gestão de lançamentos, entregas e previsões</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LaunchTable />
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total de lançamentos</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SAASS ativos</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Próximo lançamento</p>
                <p className="text-2xl font-bold">L136</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeliveryForecast />
    </div>
  )
}
