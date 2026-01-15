'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function EletronicasPage() {
  const [eletronicas, setEletronicas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEletronicas()
  }, [])

  const fetchEletronicas = async () => {
    try {
      const { data, error } = await supabase
        .from('eletronicas')
        .select('*')
        .order('data_fabricacao', { ascending: false })
      
      if (error) throw error
      setEletronicas(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_serie_eletronica: string) => {
    if (!confirm('Tem certeza que deseja excluir esta eletrônica?')) return
    
    try {
      const { error } = await supabase
        .from('eletronicas')
        .delete()
        .eq('numero_serie_eletronica', numero_serie_eletronica)
      
      if (error) throw error
      // Atualizar a lista
      setEletronicas(prev => prev.filter(e => e.numero_serie_eletronica !== numero_serie_eletronica))
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eletrônicas</h1>
          <p className="text-gray-600">Gerencie as eletrônicas do sistema</p>
        </div>
        <Link
          href="/eletronicas/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Eletrônica
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
                      Firmware
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
                  {eletronicas.map((eletronica) => (
                    <tr key={eletronica.numero_serie_eletronica}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {eletronica.numero_serie_eletronica}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eletronica.versao_eletronica}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eletronica.firmware || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(eletronica.data_fabricacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eletronica.data_atualizacao ? new Date(eletronica.data_atualizacao).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/eletronicas/${eletronica.numero_serie_eletronica}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(eletronica.numero_serie_eletronica)}
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
            {eletronicas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhuma eletrônica cadastrada.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
