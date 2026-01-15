'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function TubosPage() {
  const [tubos, setTubos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTubos()
  }, [])

  const fetchTubos = async () => {
    try {
      const { data, error } = await supabase
        .from('tubos')
        .select('*')
        .order('data_fabricacao', { ascending: false })
      
      if (error) throw error
      setTubos(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_serie_tubo: string) => {
    if (!confirm('Tem certeza que deseja excluir este tubo?')) return
    
    try {
      const { error } = await supabase
        .from('tubos')
        .delete()
        .eq('numero_serie_tubo', numero_serie_tubo)
      
      if (error) throw error
      // Atualizar a lista
      setTubos(prev => prev.filter(t => t.numero_serie_tubo !== numero_serie_tubo))
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tubos</h1>
          <p className="text-gray-600">Gerencie os tubos do sistema</p>
        </div>
        <Link
          href="/tubos/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Tubo
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
                  {tubos.map((tubo) => (
                    <tr key={tubo.numero_serie_tubo}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tubo.numero_serie_tubo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tubo.versao_tubo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tubo.profundidade_metros} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tubo.data_fabricacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tubo.data_atualizacao ? new Date(tubo.data_atualizacao).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/tubos/${tubo.numero_serie_tubo}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(tubo.numero_serie_tubo)}
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
            {tubos.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum tubo cadastrado.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
