'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDateBR } from '@/lib/dateUtils';


export default function PacksBateriasPage() {
  const [packsBaterias, setPacksBaterias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPacksBaterias()
  }, [])

  const fetchPacksBaterias = async () => {
    try {
      const { data, error } = await supabase
        .from('packs_baterias')
        .select('*')
        .order('data_fabricacao', { ascending: false })
      
      if (error) throw error
      setPacksBaterias(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (numero_serie_pack_baterias: string) => {
    if (!confirm('Tem certeza que deseja excluir este pack de baterias?')) return
    
    try {
      const { error } = await supabase
        .from('packs_baterias')
        .delete()
        .eq('numero_serie_pack_baterias', numero_serie_pack_baterias)
      
      if (error) throw error
      // Atualizar a lista
      setPacksBaterias(prev => prev.filter(p => p.numero_serie_pack_baterias !== numero_serie_pack_baterias))
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packs de Baterias</h1>
          <p className="text-gray-600">Gerencie os packs de baterias do sistema</p>
        </div>
        <Link
          href="/packs-baterias/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Pack de Baterias
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
                  {packsBaterias.map((pack) => (
                    <tr key={pack.numero_serie_pack_baterias}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pack.numero_serie_pack_baterias}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pack.versao_pack_baterias}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateBR(pack.data_fabricacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pack.data_atualizacao ? formatDateBR(pack.data_atualizacao) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/packs-baterias/${pack.numero_serie_pack_baterias}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(pack.numero_serie_pack_baterias)}
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
            {packsBaterias.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum pack de baterias cadastrado.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
