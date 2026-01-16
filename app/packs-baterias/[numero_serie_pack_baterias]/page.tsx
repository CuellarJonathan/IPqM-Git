'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDateBR } from '@/lib/dateUtils';


export default function EditPackBateriasPage() {
  const router = useRouter()
  const params = useParams()
  const numero_serie_pack_baterias = params.numero_serie_pack_baterias as string

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    numero_serie_pack_baterias: '',
    versao_pack_baterias: '',
    data_fabricacao: ''
  })

  useEffect(() => {
    fetchPackBaterias()
  }, [])

  const fetchPackBaterias = async () => {
    try {
      const { data, error } = await supabase
        .from('packs_baterias')
        .select('*')
        .eq('numero_serie_pack_baterias', numero_serie_pack_baterias)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          numero_serie_pack_baterias: data.numero_serie_pack_baterias,
          versao_pack_baterias: data.versao_pack_baterias,
          data_fabricacao: data.data_fabricacao
        })
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados do pack de baterias.')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('packs_baterias')
        .update({
          versao_pack_baterias: formData.versao_pack_baterias,
          data_fabricacao: formData.data_fabricacao,
          data_atualizacao: new Date().toISOString()
        })
        .eq('numero_serie_pack_baterias', numero_serie_pack_baterias)
      
      if (error) throw error
      router.push('/packs-baterias')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este pack de baterias?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('packs_baterias')
        .delete()
        .eq('numero_serie_pack_baterias', numero_serie_pack_baterias)
      
      if (error) throw error
      router.push('/packs-baterias')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/packs-baterias"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Pack de Baterias</h1>
            <p className="text-gray-600">Edite os dados do pack de baterias {numero_serie_pack_baterias}</p>
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
              Número de Série do Pack de Baterias
            </label>
            <input
              type="text"
              name="numero_serie_pack_baterias"
              value={formData.numero_serie_pack_baterias}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão do Pack de Baterias
            </label>
            <input
              type="text"
              name="versao_pack_baterias"
              required
              value={formData.versao_pack_baterias}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Fabricação
            </label>
            <input
              type="date"
              name="data_fabricacao"
              required
              value={formData.data_fabricacao}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Atualização
            </label>
            <input
              type="text"
              value={formatDateBR(new Date().toISOString())}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Atualizada automaticamente</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/packs-baterias"
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
