'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function LancamentosSaassPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLancamentosSaass()
  }, [])

  const fetchLancamentosSaass = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos_saass')
        .select(`
          *,
          lancamentos(numero_lancamento, descricao),
          saass(numero_serie_saass, profundidade_metros)
        `)
        .order('id_lancamento_saass', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta associação de lançamento SAASS?')) return
    
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .delete()
        .eq('id_lancamento_saass', id)
      
      if (error) throw error
      setItems(prev => prev.filter(item => item.id_lancamento_saass !== id))
    } catch (error) {
      console.error('Erro ao excluir associação:', error)
      alert('Erro ao excluir. Verifique se não há entregas ou retornos associados.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lançamentos SAASS</h1>
          <p className="text-gray-600">Gerencie as associações entre lançamentos e SAASS</p>
        </div>
        <Link
          href="/lancamentos-saass/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Associação
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lançamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SAASS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id_lancamento_saass} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id_lancamento_saass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium">L{item.lancamentos?.numero_lancamento}</span>
                        <span className="text-xs text-gray-400">{item.lancamentos?.descricao || 'Sem descrição'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.saass?.numero_serie_saass}</span>
                        <span className="text-xs text-gray-400">{item.saass?.profundidade_metros}m de profundidade</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/lancamentos-saass/${item.id_lancamento_saass}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/lancamentos-saass/${item.id_lancamento_saass}`}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id_lancamento_saass)}
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
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhuma associação de lançamento SAASS cadastrada.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
