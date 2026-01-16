'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { formatDateTimeBR } from '@/lib/dateUtils'

export default function EditLancamentoSaassPage() {
  const router = useRouter()
  const params = useParams()
  const id_lancamento_saass = parseInt(params.id_lancamento_saass as string)

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [saass, setSaass] = useState<any[]>([])
  const [entregas, setEntregas] = useState<any[]>([])
  const [retornos, setRetornos] = useState<any[]>([])
  const [formData, setFormData] = useState({
    numero_lancamento: '',
    numero_serie_saass: ''
  })
  const [entregaForm, setEntregaForm] = useState({
    responsavel_entrega: '',
    data_hora_entrega: ''
  })
  const [retornoForm, setRetornoForm] = useState({
    responsavel_retorno: '',
    data_hora_retorno: ''
  })
  const [showEntregaForm, setShowEntregaForm] = useState(false)
  const [showRetornoForm, setShowRetornoForm] = useState(false)
  const [editingEntregaId, setEditingEntregaId] = useState<number | null>(null)
  const [editingRetornoId, setEditingRetornoId] = useState<number | null>(null)

  useEffect(() => {
    fetchLancamentos()
    fetchSaass()
    fetchLancamentoSaass()
    fetchEntregas()
    fetchRetornos()
  }, [])

  const fetchLancamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .order('numero_lancamento', { ascending: false })
      
      if (error) throw error
      setLancamentos(data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error)
    }
  }

  const fetchSaass = async () => {
    try {
      const { data, error } = await supabase
        .from('saass')
        .select('*')
        .order('numero_serie_saass', { ascending: false })
      
      if (error) throw error
      setSaass(data || [])
    } catch (error) {
      console.error('Erro ao buscar SAASS:', error)
    }
  }

  const fetchLancamentoSaass = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos_saass')
        .select('*')
        .eq('id_lancamento_saass', id_lancamento_saass)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          numero_lancamento: data.numero_lancamento.toString(),
          numero_serie_saass: data.numero_serie_saass
        })
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados da associação.')
    }
  }

  const fetchEntregas = async () => {
    try {
      const { data, error } = await supabase
        .from('entregas_lancamentos')
        .select('*')
        .eq('id_lancamento_saass', id_lancamento_saass)
        .order('data_hora_entrega', { ascending: false })
      
      if (error) throw error
      setEntregas(data || [])
    } catch (error) {
      console.error('Erro ao buscar entregas:', error)
    }
  }

  const fetchRetornos = async () => {
    try {
      const { data, error } = await supabase
        .from('retornos_lancamentos')
        .select('*')
        .eq('id_lancamento_saass', id_lancamento_saass)
        .order('data_hora_retorno', { ascending: false })
      
      if (error) throw error
      setRetornos(data || [])
    } catch (error) {
      console.error('Erro ao buscar retornos:', error)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEntregaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEntregaForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRetornoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRetornoForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .update({
          numero_lancamento: parseInt(formData.numero_lancamento),
          numero_serie_saass: formData.numero_serie_saass
        })
        .eq('id_lancamento_saass', id_lancamento_saass)
      
      if (error) throw error
      router.push('/lancamentos-saass')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Verifique se esta associação já existe.')
    } finally {
      setLoading(false)
    }
  }

  const handleEntregaSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (editingEntregaId) {
        // Editar entrega existente
        const { error } = await supabase
          .from('entregas_lancamentos')
          .update({
            responsavel_entrega: entregaForm.responsavel_entrega,
            data_hora_entrega: new Date(entregaForm.data_hora_entrega).toISOString()
          })
          .eq('id_entrega_lancamento', editingEntregaId)
        
        if (error) throw error
      } else {
        // Criar nova entrega
        const { error } = await supabase
          .from('entregas_lancamentos')
          .insert([{
            id_lancamento_saass,
            responsavel_entrega: entregaForm.responsavel_entrega,
            data_hora_entrega: new Date(entregaForm.data_hora_entrega).toISOString()
          }])
        
        if (error) throw error
      }
      
      // Limpar formulário e atualizar lista
      setEntregaForm({ responsavel_entrega: '', data_hora_entrega: '' })
      setShowEntregaForm(false)
      setEditingEntregaId(null)
      await fetchEntregas()
    } catch (error) {
      console.error('Erro ao salvar entrega:', error)
      alert('Erro ao salvar entrega. Verifique os dados.')
    }
  }

  const handleRetornoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (editingRetornoId) {
        // Editar retorno existente
        const { error } = await supabase
          .from('retornos_lancamentos')
          .update({
            responsavel_retorno: retornoForm.responsavel_retorno,
            data_hora_retorno: new Date(retornoForm.data_hora_retorno).toISOString()
          })
          .eq('id_retorno_lancamento', editingRetornoId)
        
        if (error) throw error
      } else {
        // Criar novo retorno
        const { error } = await supabase
          .from('retornos_lancamentos')
          .insert([{
            id_lancamento_saass,
            responsavel_retorno: retornoForm.responsavel_retorno,
            data_hora_retorno: new Date(retornoForm.data_hora_retorno).toISOString()
          }])
        
        if (error) throw error
      }
      
      // Limpar formulário e atualizar lista
      setRetornoForm({ responsavel_retorno: '', data_hora_retorno: '' })
      setShowRetornoForm(false)
      setEditingRetornoId(null)
      await fetchRetornos()
    } catch (error) {
      console.error('Erro ao salvar retorno:', error)
      alert('Erro ao salvar retorno. Verifique os dados.')
    }
  }

  const handleEditEntrega = (entrega: any) => {
    setEntregaForm({
      responsavel_entrega: entrega.responsavel_entrega,
      data_hora_entrega: new Date(entrega.data_hora_entrega).toISOString().slice(0, 16)
    })
    setEditingEntregaId(entrega.id_entrega_lancamento)
    setShowEntregaForm(true)
  }

  const handleEditRetorno = (retorno: any) => {
    setRetornoForm({
      responsavel_retorno: retorno.responsavel_retorno,
      data_hora_retorno: new Date(retorno.data_hora_retorno).toISOString().slice(0, 16)
    })
    setEditingRetornoId(retorno.id_retorno_lancamento)
    setShowRetornoForm(true)
  }

  const handleDeleteEntrega = async (id_entrega_lancamento: number) => {
    if (!confirm('Tem certeza que deseja excluir esta entrega?')) return
    
    try {
      const { error } = await supabase
        .from('entregas_lancamentos')
        .delete()
        .eq('id_entrega_lancamento', id_entrega_lancamento)
      
      if (error) throw error
      await fetchEntregas()
    } catch (error) {
      console.error('Erro ao excluir entrega:', error)
      alert('Erro ao excluir entrega.')
    }
  }

  const handleDeleteRetorno = async (id_retorno_lancamento: number) => {
    if (!confirm('Tem certeza que deseja excluir este retorno?')) return
    
    try {
      const { error } = await supabase
        .from('retornos_lancamentos')
        .delete()
        .eq('id_retorno_lancamento', id_retorno_lancamento)
      
      if (error) throw error
      await fetchRetornos()
    } catch (error) {
      console.error('Erro ao excluir retorno:', error)
      alert('Erro ao excluir retorno.')
    }
  }

  const cancelEntregaForm = () => {
    setEntregaForm({ responsavel_entrega: '', data_hora_entrega: '' })
    setShowEntregaForm(false)
    setEditingEntregaId(null)
  }

  const cancelRetornoForm = () => {
    setRetornoForm({ responsavel_retorno: '', data_hora_retorno: '' })
    setShowRetornoForm(false)
    setEditingRetornoId(null)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta associação?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .delete()
        .eq('id_lancamento_saass', id_lancamento_saass)
      
      if (error) throw error
      router.push('/lancamentos-saass')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir. Verifique se não há entregas ou retornos associados.')
    } finally {
      setDeleting(false)
    }
  }

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/lancamentos-saass"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Associação</h1>
            <p className="text-gray-600">Edite a associação entre lançamento e SAASS</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lançamento
            </label>
            <select
              name="numero_lancamento"
              required
              value={formData.numero_lancamento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um lançamento</option>
              {lancamentos.map((lancamento) => (
                <option key={lancamento.numero_lancamento} value={lancamento.numero_lancamento}>
                  L{lancamento.numero_lancamento} - {lancamento.descricao || 'Sem descrição'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SAASS
            </label>
            <select
              name="numero_serie_saass"
              required
              value={formData.numero_serie_saass}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um SAASS</option>
              {saass.map((saas) => (
                <option key={saas.numero_serie_saass} value={saas.numero_serie_saass}>
                  {saas.numero_serie_saass} - {saas.profundidade_metros}m
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/lancamentos-saass"
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancelar
          </Link>
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

      {/* Seção de Entregas */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Entregas</h2>
          <button
            onClick={() => setShowEntregaForm(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Entrega
          </button>
        </div>

        {/* Formulário de Entrega */}
        {showEntregaForm && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleEntregaSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável pela Entrega
                  </label>
                  <input
                    type="text"
                    name="responsavel_entrega"
                    required
                    value={entregaForm.responsavel_entrega}
                    onChange={handleEntregaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome completo do responsável"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora da Entrega
                  </label>
                  <input
                    type="datetime-local"
                    name="data_hora_entrega"
                    required
                    value={entregaForm.data_hora_entrega}
                    onChange={handleEntregaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={cancelEntregaForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingEntregaId ? 'Atualizar' : 'Salvar'} Entrega
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Entregas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entregas.map((entrega) => (
                <tr key={entrega.id_entrega_lancamento} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {entrega.responsavel_entrega}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDateTimeBR(entrega.data_hora_entrega)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEntrega(entrega)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntrega(entrega.id_entrega_lancamento)}
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
          {entregas.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhuma entrega registrada.
            </div>
          )}
        </div>
      </div>

      {/* Seção de Retornos */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Retornos</h2>
          <button
            onClick={() => setShowRetornoForm(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Retorno
          </button>
        </div>

        {/* Formulário de Retorno */}
        {showRetornoForm && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleRetornoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável pelo Retorno
                  </label>
                  <input
                    type="text"
                    name="responsavel_retorno"
                    required
                    value={retornoForm.responsavel_retorno}
                    onChange={handleRetornoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome completo do responsável"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora do Retorno
                  </label>
                  <input
                    type="datetime-local"
                    name="data_hora_retorno"
                    required
                    value={retornoForm.data_hora_retorno}
                    onChange={handleRetornoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={cancelRetornoForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingRetornoId ? 'Atualizar' : 'Salvar'} Retorno
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Retornos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {retornos.map((retorno) => (
                <tr key={retorno.id_retorno_lancamento} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {retorno.responsavel_retorno}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDateTimeBR(retorno.data_hora_retorno)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditRetorno(retorno)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRetorno(retorno.id_retorno_lancamento)}
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
          {retornos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum retorno registrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
