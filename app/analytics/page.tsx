'use client'

import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análises</h1>
        <p className="text-gray-600">Visualize métricas e insights do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de SAASS</p>
              <h3 className="text-2xl font-bold text-gray-900">42</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% em relação ao mês anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lançamentos Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span>4 em preparação • 4 em missão</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Disponibilidade</p>
              <h3 className="text-2xl font-bold text-gray-900">94.5%</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2.3% em relação ao trimestre</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Componentes em Manutenção</p>
              <h3 className="text-2xl font-bold text-gray-900">7</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-red-600">
              <span>3 eletrônicas • 2 hidrofones • 2 tubos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lançamentos por Mês</h2>
          <div className="space-y-4">
            {[
              { mes: 'Jan/2026', quantidade: 5 },
              { mes: 'Fev/2026', quantidade: 8 },
              { mes: 'Mar/2026', quantidade: 12 },
              { mes: 'Abr/2026', quantidade: 7 },
              { mes: 'Mai/2026', quantidade: 10 },
            ].map((item) => (
              <div key={item.mes} className="flex items-center">
                <div className="w-32 text-sm text-gray-600">{item.mes}</div>
                <div className="flex-1">
                  <div className="h-6 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(item.quantidade / 12) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right font-medium">{item.quantidade}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição de Componentes</h2>
          <div className="space-y-4">
            {[
              { tipo: 'Eletrônicas', quantidade: 25, cor: 'bg-blue-500' },
              { tipo: 'Hidrofones', quantidade: 22, cor: 'bg-green-500' },
              { tipo: 'Packs de Baterias', quantidade: 30, cor: 'bg-purple-500' },
              { tipo: 'Tubos', quantidade: 18, cor: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.tipo} className="flex items-center">
                <div className="w-40 text-sm text-gray-600">{item.tipo}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.cor} rounded-full`}
                      style={{ width: `${(item.quantidade / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right font-medium">{item.quantidade}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Insights e Recomendações</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800">Alta demanda de lançamentos em março</h4>
            <p className="text-blue-700">
              Prever aumento de 40% na demanda de SAASS para o próximo mês. Recomenda-se antecipar a preparação de componentes.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-800">Disponibilidade de componentes estável</h4>
            <p className="text-green-700">
              Taxa de disponibilidade acima de 94% por 3 meses consecutivos. Bom indicador de manutenção preventiva.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-bold text-amber-800">Atenção: Tubos com mais de 5 anos</h4>
            <p className="text-amber-700">
              3 tubos estão próximos do limite de vida útil. Agendar inspeção detalhada.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
