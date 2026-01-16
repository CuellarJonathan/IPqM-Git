'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertTriangle, Info, RefreshCw } from 'lucide-react'
import { buscarLogsRecentes } from '@/lib/logUtils'
import { formatRelativeTime } from '@/lib/dateUtils'

// Mapeamento de ícones baseado no tipo de ação
const getIconAndColor = (acao: string, modulo: string) => {
  switch (acao) {
    case 'criar':
      return { icon: Info, color: 'text-blue-500 bg-blue-100' }
    case 'editar':
      return { icon: RefreshCw, color: 'text-amber-500 bg-amber-100' }
    case 'excluir':
      return { icon: AlertTriangle, color: 'text-red-500 bg-red-100' }
    case 'entrega':
      return { icon: CheckCircle, color: 'text-green-500 bg-green-100' }
    case 'retorno':
      return { icon: CheckCircle, color: 'text-purple-500 bg-purple-100' }
    case 'associar':
      return { icon: Info, color: 'text-indigo-500 bg-indigo-100' }
    default:
      return { icon: Info, color: 'text-gray-500 bg-gray-100' }
  }
}


export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    paginaAtual: 1,
    porPagina: 10,
    totalRegistros: 0,
    totalPaginas: 0
  })
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchRecentActivities(1)
  }, [])

  const fetchRecentActivities = async (pagina: number) => {
    try {
      const resultado = await buscarLogsRecentes(pagina, 10)
      
      const formattedActivities = resultado.logs.map((log: any) => {
        const { icon, color } = getIconAndColor(log.acao, log.modulo)
        return {
          id: log.id_log,
          type: log.acao,
          title: log.titulo || `${log.entidade} ${log.acao}`,
          description: log.descricao_dashboard || log.descricao || `${log.modulo}: ${log.acao}`,
          time: formatRelativeTime(log.data_hora),
          icon,
          color,
          rawData: log
        }
      })
      
      setActivities(formattedActivities)
      setPagination({
        paginaAtual: resultado.paginaAtual,
        porPagina: resultado.porPagina,
        totalRegistros: resultado.totalRegistros,
        totalPaginas: resultado.totalPaginas
      })
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= pagination.totalPaginas) {
      setLoading(true)
      fetchRecentActivities(pagina)
    }
  }

  const irParaProximaPagina = () => {
    if (pagination.paginaAtual < pagination.totalPaginas) {
      setLoading(true)
      fetchRecentActivities(pagination.paginaAtual + 1)
    }
  }

  const irParaPaginaAnterior = () => {
    if (pagination.paginaAtual > 1) {
      setLoading(true)
      fetchRecentActivities(pagination.paginaAtual - 1)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Atividade Recente</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchRecentActivities(pagination.paginaAtual)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Atualizar
          </button>
        </div>
      </div>
      
      {!isClient || loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-gray-200 animate-pulse">
                <div className="w-5 h-5"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{isClient ? activity.time : ''}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Info className="mx-auto mb-3 text-gray-400" size={32} />
          <p>Nenhuma atividade recente registrada</p>
          <p className="text-sm mt-1">As atividades aparecerão aqui conforme o uso do sistema</p>
        </div>
      )}
      
      {/* Paginação */}
      {pagination.totalPaginas > 1 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {((pagination.paginaAtual - 1) * pagination.porPagina) + 1}-
              {Math.min(pagination.paginaAtual * pagination.porPagina, pagination.totalRegistros)} de {pagination.totalRegistros} atividades
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={irParaPaginaAnterior}
                disabled={pagination.paginaAtual <= 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.paginaAtual <= 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPaginas) }, (_, i) => {
                  let paginaNumero
                  if (pagination.totalPaginas <= 5) {
                    paginaNumero = i + 1
                  } else if (pagination.paginaAtual <= 3) {
                    paginaNumero = i + 1
                  } else if (pagination.paginaAtual >= pagination.totalPaginas - 2) {
                    paginaNumero = pagination.totalPaginas - 4 + i
                  } else {
                    paginaNumero = pagination.paginaAtual - 2 + i
                  }
                  
                  return (
                    <button
                      key={paginaNumero}
                      onClick={() => irParaPagina(paginaNumero)}
                      className={`w-8 h-8 text-sm rounded-md ${
                        pagination.paginaAtual === paginaNumero
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {paginaNumero}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={irParaProximaPagina}
                disabled={pagination.paginaAtual >= pagination.totalPaginas}
                className={`px-3 py-1 text-sm rounded-md ${
                  pagination.paginaAtual >= pagination.totalPaginas
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Info size={16} className="mr-2" />
          <p>Atualizações automáticas a cada 5 minutos</p>
        </div>
      </div>
    </div>
  )
}
