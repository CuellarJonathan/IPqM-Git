'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'

export default function LaunchTable() {
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLaunches()
  }, [])

  const fetchLaunches = async () => {
    try {
      // Buscar lançamentos com uma consulta mais simples
      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .order('numero_lancamento', { ascending: false })
      
      if (error) throw error
      
      if (!data) {
        setLaunches([])
        setLoading(false)
        return
      }
      
      // Para cada lançamento, buscar contagem de SAASS
      const launchesWithCounts = await Promise.all(
        data.map(async (launch) => {
          try {
            // Buscar contagem de SAASS associados
            const { count } = await supabase
              .from('lancamentos_saass')
              .select('*', { count: 'exact', head: true })
              .eq('numero_lancamento', launch.numero_lancamento)
            
            return {
              ...launch,
              quantidade_saass: count || 0,
              // Para simplificar, não buscamos entregas e retornos nesta versão
              // pois podem não existir para lançamentos novos
              ultima_entrega: null,
              ultimo_retorno: null
            }
          } catch (error) {
            console.error(`Erro ao buscar SAASS para lançamento ${launch.numero_lancamento}:`, error)
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

  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {launch.quantidade_saass} SAASS
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {launch.ultima_entrega ? (
                        <span className="text-gray-900">{formatDate(launch.ultima_entrega)}</span>
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {launch.ultimo_retorno ? (
                        <span className="text-gray-900">{formatDate(launch.ultimo_retorno)}</span>
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
    </div>
  )
}
