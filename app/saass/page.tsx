'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function SAASSPage() {
  const [saass, setSaass] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSAASS()
  }, [])

  const fetchSAASS = async () => {
    try {
      const { data, error } = await supabase
        .from('saass')
        .select('*')
        .order('data_fabricacao', { ascending: false })
      
      if (error) throw error
      setSaass(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_serie_saass: string) => {
    if (!confirm('Tem certeza que deseja excluir este SAASS?')) return
    
    try {
      const { error } = await supabase
        .from('saass')
        .delete()
        .eq('numero_serie_saass', numero_serie_saass)
      
      if (error) throw error
      // Atualizar a lista
      setSaass(prev => prev.filter(s => s.numero_serie_saass !== numero_serie_saass))
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SAASS</h1>
          <p className="text-gray-600">Gerencie os SAASS do sistema</p>
        </div>
        <Link
          href="/saass/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo SAASS
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
                      Eletrônica
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hidrofone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pack Baterias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tubo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profundidade (m)
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
                  {saass.map((saas) => (
                    <tr key={saas.numero_serie_saass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {saas.numero_serie_saass}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.numero_serie_eletronica}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.numero_serie_hidrofone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.numero_serie_pack_baterias}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.numero_serie_tubo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.profundidade_metros} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(saas.data_fabricacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saas.data_atualizacao ? new Date(saas.data_atualizacao).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/saass/${saas.numero_serie_saass}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(saas.numero_serie_saass)}
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
            {saass.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum SAASS cadastrado.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
