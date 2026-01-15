'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditRetornoPage() {
  const router = useRouter()
  const params = useParams()
  const id_retorno_lancamento = parseInt(params.id_retorno_lancamento as string)

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lancamentosSaass, setLancamentosSaass] = useState<any[]>([])
  const [formData, setFormData] = useState({
    id_lancamento_saass: '',
    responsavel_retorno: '',
    data_hora_retorno: ''
  })

  useEffect(() => {
    fetchLancamentosSaass()
    fetchRetorno()
  }, [])

  const fetchLancamentosSaass = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos_saass')
        .select(`
          *,
          lancamentos(numero_lancamento),
          saass(numero_serie_saass)
        `)
        .order('id_lancamento_saass', { ascending: false })
      
      if (error) throw error
      setLancamentosSaass(data || [])
    } catch (error) {
      console.error('Erro ao buscar lançamentos SAASS:', error)
    }
  }

  const fetchRetorno = async () => {
    try {
      const { data, error } = await supabase
        .from('retornos_lancamentos')
        .select('*')
        .eq('id_retorno_lancamento', id_retorno_lancamento)
        .single()
      
      if (error) throw error
      if (data) {
        // Converter a data para o formato do input datetime-local
        const date = new Date(data.data_hora_retorno)
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        const formattedDate = localDate.toISOString().slice(0, 16)
        
        setFormData({
          id_lancamento_saass: data.id_lancamento_saass.toString(),
          responsavel_retorno: data.responsavel_retorno,
          data_hora_retorno: formattedDate
        })
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados do retorno.')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('retornos_lancamentos')
        .update({
          id_lancamento_saass: parseInt(formData.id_lancamento_saass),
          responsavel_retorno: formData.responsavel_retorno,
          data_hora_retorno: new Date(formData.data_hora_retorno).toISOString()
        })
        .eq('id_retorno_lancamento', id_retorno_lancamento)
      
      if (error) throw error
      router.push('/retornos')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este retorno?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('retornos_lancamentos')
        .delete()
        .eq('id_retorno_lancamento', id_retorno_lancamento)
      
      if (error) throw error
      router.push('/retornos')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir. Verifique se não há registros associados.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/retornos"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Retorno</h1>
            <p className="text-gray-600">Edite os dados do retorno #{id_retorno_lancamento}</p>
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
              Lançamento SAASS
            </label>
            <select
              name="id_lancamento_saass"
              required
              value={formData.id_lancamento_saass}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um lançamento SAASS</option>
              {lancamentosSaass.map((ls) => (
                <option key={ls.id_lancamento_saass} value={ls.id_lancamento_saass}>
                  Lançamento {ls.lancamentos?.numero_lancamento} - SAASS {ls.saass?.numero_serie_saass}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável pelo Retorno
            </label>
            <input
              type="text"
              name="responsavel_retorno"
              required
              value={formData.responsavel_retorno}
              onChange={handleChange}
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
              value={formData.data_hora_retorno}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/retornos"
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
    </div>
  )
}
