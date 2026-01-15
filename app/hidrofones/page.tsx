'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function HidrofonesPage() {
  const [hidrofones, setHidrofones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHidrofones()
  }, [])

  const fetchHidrofones = async () => {
    try {
      const { data, error } = await supabase
        .from('hidrofones')
        .select('*')
        .order('data_fabricacao', { ascending: false })
      
      if (error) throw error
      setHidrofones(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_serie_hidrofone: string) => {
    if (!confirm('Tem certeza que deseja excluir este hidrofone?')) return
    
    try {
      const { error } = await supabase
        .from('hidrofones')
        .delete()
        .eq('numero_serie_hidrofone', numero_serie_hidrofone)
      
      if (error) throw error
      // Atualizar a lista
      setHidrofones(prev => prev.filter(h => h.numero_serie_hidrofone !== numero_serie_hidrofone))
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hidrofones</h1>
          <p className="text-gray-600">Gerencie os hidrofones do sistema</p>
        </div>
        <Link
          href="/hidrofones/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Hidrofone
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Série
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Fabricação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Atualização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hidrofones.map((hidrofone) => (
                    <tr key={hidrofone.numero_serie_hidrofone}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {hidrofone.numero_serie_hidrofone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hidrofone.versao_hidrofone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(hidrofone.data_fabricacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hidrofone.data_atualizacao ? new Date(hidrofone.data_atualizacao).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/hidrofones/${hidrofone.numero_serie_hidrofone}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(hidrofone.numero_serie_hidrofone)}
                          className="inline-flex items-center text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hidrofones.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum hidrofone cadastrado.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
