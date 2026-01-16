'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Eye, Edit, Trash2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { formatDateBR, formatDateTimeBR } from '@/lib/dateUtils'

export default function LaunchTable() {
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSaassModal, setShowSaassModal] = useState(false)
  const [selectedLaunch, setSelectedLaunch] = useState<number | null>(null)
  const [saassList, setSaassList] = useState<any[]>([])
  const [loadingSaass, setLoadingSaass] = useState(false)

  useEffect(() => {
    fetchLaunches()
  }, [])

  const fetchLaunches = async () => {
    try {
      // Buscar lançamentos com últimas entregas e retornos
      const { data, error } = await supabase
        .from('lancamentos')
        .select(`
          *,
          lancamentos_saass!left(
            id_lancamento_saass,
            entregas_lancamentos(data_hora_entrega),
            retornos_lancamentos(data_hora_retorno)
          )
        `)
        .order('numero_lancamento', { ascending: false })
      
      if (error) throw error
      
      if (!data) {
        setLaunches([])
        setLoading(false)
        return
      }
      
      // Processar dados para obter contagem de SAASS e últimas datas
      const launchesWithCounts = await Promise.all(
        data.map(async (launch) => {
          try {
            // Buscar contagem de SAASS associados
            const { count } = await supabase
              .from('lancamentos_saass')
              .select('*', { count: 'exact', head: true })
              .eq('numero_lancamento', launch.numero_lancamento)
            
            // Extrair todas as datas de entrega e retorno
            const entregas = launch.lancamentos_saass
              ?.flatMap((ls: any) => ls.entregas_lancamentos || [])
              ?.map((e: any) => e.data_hora_entrega)
              ?.filter(Boolean) || []
            
            const retornos = launch.lancamentos_saass
              ?.flatMap((ls: any) => ls.retornos_lancamentos || [])
              ?.map((r: any) => r.data_hora_retorno)
              ?.filter(Boolean) || []
            
            // Encontrar a data mais recente (mais próxima no futuro ou mais recente no passado)
            const ultimaEntrega = entregas.length > 0 
              ? new Date(Math.max(...entregas.map((d: string) => new Date(d).getTime()))).toISOString()
              : null
            
            const ultimoRetorno = retornos.length > 0
              ? new Date(Math.max(...retornos.map((d: string) => new Date(d).getTime()))).toISOString()
              : null
            
            return {
              ...launch,
              quantidade_saass: count || 0,
              ultima_entrega: ultimaEntrega,
              ultimo_retorno: ultimoRetorno
            }
          } catch (error) {
            console.error(`Erro ao processar lançamento ${launch.numero_lancamento}:`, error)
            return {
              ...launch,
              quantidade_saass: 0,
              ultima_entrega: null,
              ultimo_retorno: null
            }
          }
        })
      )
      
      setLaunches(launchesWithCounts)
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_lancamento: number) => {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return
    
    try {
      const { error } = await supabase
        .from('lancamentos')
        .delete()
        .eq('numero_lancamento', numero_lancamento)
      
      if (error) throw error
      // Atualizar a lista
      setLaunches(prev => prev.filter(l => l.numero_lancamento !== numero_lancamento))
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error)
      alert('Erro ao excluir. Verifique se não há registros associados.')
    }
  }

  const fetchSaassForLaunch = async (numero_lancamento: number) => {
    setLoadingSaass(true)
    try {
      const { data, error } = await supabase
        .from('lancamentos_saass')
        .select(`
          saass!inner(
            numero_serie_saass,
            profundidade_metros
          )
        `)
        .eq('numero_lancamento', numero_lancamento)
        .order('saass(numero_serie_saass)', { ascending: true })
      
      if (error) throw error
      
      const saass = data?.map(item => item.saass) || []
      setSaassList(saass)
      setSelectedLaunch(numero_lancamento)
      setShowSaassModal(true)
    } catch (error) {
      console.error('Erro ao buscar SAASS:', error)
      alert('Erro ao carregar lista de SAASS.')
    } finally {
      setLoadingSaass(false)
    }
  }

  const closeSaassModal = () => {
    setShowSaassModal(false)
    setSelectedLaunch(null)
    setSaassList([])
  }


  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Lista de Lançamentos</h2>
        <Link
          href="/lancamentos/novo"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Lançamento
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lançamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade de SAASS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última entrega</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último retorno</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {launches.map((launch) => (
                  <tr key={launch.numero_lancamento} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-lg">L{launch.numero_lancamento}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{launch.descricao || 'Sem descrição'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchSaassForLaunch(launch.numero_lancamento)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                        title="Clique para ver os números de série dos SAASS"
                      >
                        {launch.quantidade_saass} SAASS
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {launch.ultima_entrega ? (
                        <span className="text-gray-900" title={formatDateTimeBR(launch.ultima_entrega) || ''}>
                          {formatDateBR(launch.ultima_entrega)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {launch.ultimo_retorno ? (
                        <span className="text-gray-900" title={formatDateTimeBR(launch.ultimo_retorno) || ''}>
                          {formatDateBR(launch.ultimo_retorno)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Nenhum</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/lancamentos/${launch.numero_lancamento}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/lancamentos/${launch.numero_lancamento}`}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(launch.numero_lancamento)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {launches.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum lançamento cadastrado.
            </div>
          )}
          
          <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-500">
            <div>Mostrando {launches.length} lançamentos</div>
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-700">Anterior</button>
              <span className="font-medium">Página 1 de 1</span>
              <button className="hover:text-gray-700">Próxima</button>
            </div>
          </div>
        </>
      )}

      {/* Modal para exibir SAASS do lançamento */}
      {showSaassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                SAASS do Lançamento L{selectedLaunch}
              </h3>
              <button
                onClick={closeSaassModal}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingSaass ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : saassList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum SAASS associado a este lançamento.
                </div>
              ) : (
                <div className="space-y-3">
                  {saassList.map((saas, index) => (
                    <div 
                      key={saas.numero_serie_saass} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {saas.numero_serie_saass}
                        </div>
                        <div className="text-sm text-gray-500">
                          Profundidade: {saas.profundidade_metros}m
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total: {saassList.length} SAASS
                </span>
                <button
                  onClick={closeSaassModal}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
