'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save, Trash2, Plus, Eye, Edit, X } from 'lucide-react'
import Link from 'next/link'
import { formatDateShort } from '@/lib/dateUtils';



export default function LancamentoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const numero_lancamento = parseInt(params.numero_lancamento as string)

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lancamento, setLancamento] = useState<any>(null)
  const [saassAssociados, setSaassAssociados] = useState<any[]>([])
  const [saassDisponiveis, setSaassDisponiveis] = useState<any[]>([])
  const [showAddSaass, setShowAddSaass] = useState(false)
  const [selectedSaass, setSelectedSaass] = useState('')
  const [addingSaass, setAddingSaass] = useState(false)
  const [activeTab, setActiveTab] = useState('detalhes') // 'detalhes' ou 'editar'
  const [formData, setFormData] = useState({
    descricao: ''
  })

  useEffect(() => {
    fetchLancamento()
    fetchSaassAssociados()
    fetchSaassDisponiveis()
  }, [])

  const fetchLancamento = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('numero_lancamento', numero_lancamento)
        .single()
      
      if (error) throw error
      if (data) {
        setLancamento(data)
        setFormData({ descricao: data.descricao || '' })
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados do lançamento.')
    }
  }

  const fetchSaassAssociados = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos_saass')
        .select(`
          *,
          saass(*),
          entregas_lancamentos!left(data_hora_entrega),
          retornos_lancamentos!left(data_hora_retorno)
        `)
        .eq('numero_lancamento', numero_lancamento)
      
      if (error) throw error
      
      // Processar dados para obter últimas entregas e retornos (mais recentes)
      const processedData = data?.map(item => {
        // Ordenar entregas por data (mais recente primeiro) e pegar a primeira
        const entregasOrdenadas = item.entregas_lancamentos
          ?.filter((e: any) => e.data_hora_entrega)
          ?.sort((a: any, b: any) => 
            new Date(b.data_hora_entrega).getTime() - new Date(a.data_hora_entrega).getTime()
          ) || []
        
        // Ordenar retornos por data (mais recente primeiro) e pegar a primeira
        const retornosOrdenados = item.retornos_lancamentos
          ?.filter((r: any) => r.data_hora_retorno)
          ?.sort((a: any, b: any) => 
            new Date(b.data_hora_retorno).getTime() - new Date(a.data_hora_retorno).getTime()
          ) || []
        
        return {
          ...item,
          ultima_entrega: entregasOrdenadas[0]?.data_hora_entrega || null,
          ultimo_retorno: retornosOrdenados[0]?.data_hora_retorno || null
        }
      }) || []
      
      setSaassAssociados(processedData)
    } catch (error) {
      console.error('Erro ao buscar SAASS associados:', error)
    }
  }

  const fetchSaassDisponiveis = async () => {
    try {
      // Buscar SAASS que ainda não estão associados a este lançamento
      const { data: saassData, error } = await supabase
        .from('saass')
        .select('*')
        .order('numero_serie_saass', { ascending: false })
      
      if (error) throw error
      
      // Filtrar SAASS já associados
      const { data: associadosData } = await supabase
        .from('lancamentos_saass')
        .select('numero_serie_saass')
        .eq('numero_lancamento', numero_lancamento)
      
      const associadosIds = associadosData?.map(item => item.numero_serie_saass) || []
      const disponiveis = saassData?.filter(saas => !associadosIds.includes(saas.numero_serie_saass)) || []
      
      setSaassDisponiveis(disponiveis)
    } catch (error) {
      console.error('Erro ao buscar SAASS disponíveis:', error)
    }
  }

  const handleAddSaass = async () => {
    if (!selectedSaass) {
      alert('Selecione um SAASS para adicionar.')
      return
    }
    
    setAddingSaass(true)
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .insert([{
          numero_lancamento,
          numero_serie_saass: selectedSaass
        }])
      
      if (error) throw error
      
      // Atualizar listas
      await fetchSaassAssociados()
      await fetchSaassDisponiveis()
      setSelectedSaass('')
      setShowAddSaass(false)
    } catch (error) {
      console.error('Erro ao adicionar SAASS:', error)
      alert('Erro ao adicionar SAASS. Verifique se já está associado.')
    } finally {
      setAddingSaass(false)
    }
  }

  const handleRemoveSaass = async (id_lancamento_saass: number) => {
    if (!confirm('Tem certeza que deseja remover este SAASS do lançamento?')) return
    
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .delete()
        .eq('id_lancamento_saass', id_lancamento_saass)
      
      if (error) throw error
      
      // Atualizar listas
      await fetchSaassAssociados()
      await fetchSaassDisponiveis()
    } catch (error) {
      console.error('Erro ao remover SAASS:', error)
      alert('Erro ao remover SAASS. Verifique se há entregas ou retornos associados.')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('lancamentos')
        .update({
          descricao: formData.descricao
        })
        .eq('numero_lancamento', numero_lancamento)
      
      if (error) throw error
      await fetchLancamento()
      setActiveTab('detalhes')
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('lancamentos')
        .delete()
        .eq('numero_lancamento', numero_lancamento)
      
      if (error) throw error
      router.push('/lancamentos')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir. Verifique se não há registros associados.')
    } finally {
      setDeleting(false)
    }
  }

  

  const formatDateShort = (dateString: string) => {
    if (!dateString) return 'Nenhuma'
    const date = new Date(dateString)
    return formatDateBR(date)
  }

  if (!lancamento) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/lancamentos"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lançamento L{numero_lancamento}</h1>
            <p className="text-gray-600">Detalhes e gerenciamento do lançamento</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {deleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('detalhes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'detalhes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('editar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'editar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Editar
          </button>
        </nav>
      </div>

      {activeTab === 'detalhes' ? (
        <div className="space-y-6">
          {/* Informações do Lançamento */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Lançamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Número do Lançamento</p>
                <p className="text-lg font-medium">L{lancamento.numero_lancamento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="text-lg font-medium">{lancamento.descricao || 'Sem descrição'}</p>
              </div>
            </div>
          </div>

          {/* SAASS Associados */}
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">SAASS Associados</h2>
              <button
                onClick={() => setShowAddSaass(!showAddSaass)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar SAASS
              </button>
            </div>

            {/* Formulário para adicionar SAASS */}
            {showAddSaass && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedSaass}
                    onChange={(e) => setSelectedSaass(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um SAASS</option>
                    {saassDisponiveis.map((saas) => (
                      <option key={saas.numero_serie_saass} value={saas.numero_serie_saass}>
                        {saas.numero_serie_saass} - {saas.profundidade_metros}m
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSaass}
                    disabled={addingSaass || !selectedSaass}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {addingSaass ? 'Adicionando...' : 'Adicionar'}
                  </button>
                  <button
                    onClick={() => setShowAddSaass(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                {saassDisponiveis.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">Todos os SAASS já estão associados a este lançamento.</p>
                )}
              </div>
            )}

            {/* Lista de SAASS associados */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SAASS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profundidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Entrega
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Retorno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {saassAssociados.map((item) => (
                    <tr key={item.id_lancamento_saass} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.saass?.numero_serie_saass}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.saass?.profundidade_metros}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.ultima_entrega ? (
                          <span title={formatDate(item.ultima_entrega)}>
                            {formatDateShort(item.ultima_entrega)}
                          </span>
                        ) : (
                          'Nenhuma'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.ultimo_retorno ? (
                          <span title={formatDate(item.ultimo_retorno)}>
                            {formatDateShort(item.ultimo_retorno)}
                          </span>
                        ) : (
                          'Nenhum'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/lancamentos-saass/${item.id_lancamento_saass}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleRemoveSaass(item.id_lancamento_saass)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {saassAssociados.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Nenhum SAASS associado a este lançamento.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Tab de Edição */
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Editar Lançamento</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Lançamento
                </label>
                <input
                  type="text"
                  value={lancamento.numero_lancamento}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  rows={3}
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o propósito ou detalhes do lançamento"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('detalhes')}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
