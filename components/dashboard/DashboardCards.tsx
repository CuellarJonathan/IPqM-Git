'use client'

import { useState, useEffect } from 'react'
import { Rocket, Calendar, Package, AlertCircle } from 'lucide-react'
import { buscarEstatisticasDashboard } from '@/lib/logUtils'
import { formatNumberBR } from '@/lib/dateUtils'

export default function DashboardCards() {
  const [data, setData] = useState({
    currentLaunch: {
      numero_lancamento: 0,
      descricao: 'Carregando...',
    },
    daysSinceLastDelivery: 0,
    daysSinceLastSAASS: 0,
    totalSAASS: 0,
    loading: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const estatisticas = await buscarEstatisticasDashboard()
      
      setData({
        currentLaunch: {
          numero_lancamento: estatisticas.currentLaunch.numero_lancamento || 0,
          descricao: estatisticas.currentLaunch.descricao || 'Nenhum lançamento registrado',
        },
        daysSinceLastDelivery: estatisticas.daysSinceLastDelivery,
        daysSinceLastSAASS: estatisticas.daysSinceLastSAASS,
        totalSAASS: estatisticas.totalSAASS,
        loading: false
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      setData(prev => ({ ...prev, loading: false }))
    }
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card: Lançamento Atual */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2">Lançamento Atual</p>
            {data.loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-full max-w-[200px]"></div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">L{data.currentLaunch.numero_lancamento || 'N/A'}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 break-words">
                  {data.currentLaunch.descricao}
                </p>
              </>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <Rocket className="text-blue-500" size={36} />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Última atualização: hoje</p>
        </div>
      </div>

      {/* Card: Dias desde última entrega */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2">Dias desde última entrega</p>
            {data.loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{data.daysSinceLastDelivery} dias</h3>
                <p className="text-gray-600 text-sm">Considerando fuso horário UTC</p>
              </>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <Calendar className="text-green-500" size={36} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0 dias</span>
            <span>60+ dias</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((data.daysSinceLastDelivery / 60) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">
            {data.daysSinceLastDelivery <= 60 ? `${data.daysSinceLastDelivery} de 60 dias` : '60+ dias'}
          </div>
        </div>
      </div>

      {/* Card: Dias desde último SAASS registrado */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2">Dias desde último SAASS</p>
            {data.loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{data.daysSinceLastSAASS} dias</h3>
                <p className="text-gray-600 text-sm">Baseado na data de fabricação</p>
              </>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <Package className="text-amber-500" size={36} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0 dias</span>
            <span>4 anos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((data.daysSinceLastSAASS / 1460) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">
            {data.daysSinceLastSAASS <= 1460 ? `${data.daysSinceLastSAASS} de 1460 dias` : '4+ anos'}
          </div>
        </div>
      </div>

      {/* Card: Total de SAASS */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2">Total de SAASS</p>
            {data.loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatNumberBR(data.totalSAASS)}</h3>
                <p className="text-gray-600 text-sm">Sistemas completos registrados</p>
              </>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <AlertCircle className="text-purple-500" size={36} />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Atualizado em tempo real</p>
        </div>
      </div>
    </div>
  )
}
