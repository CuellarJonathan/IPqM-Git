'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditSAASSPage() {
  const router = useRouter()
  const params = useParams()
  const numero_serie_saass = params.numero_serie_saass as string

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    numero_serie_saass: '',
    numero_serie_eletronica: '',
    numero_serie_hidrofone: '',
    numero_serie_pack_baterias: '',
    numero_serie_tubo: '',
    profundidade_metros: '',
    data_fabricacao: ''
  })

  const [eletronicas, setEletronicas] = useState<any[]>([])
  const [hidrofones, setHidrofones] = useState<any[]>([])
  const [packsBaterias, setPacksBaterias] = useState<any[]>([])
  const [tubos, setTubos] = useState<any[]>([])

  useEffect(() => {
    fetchSAASS()
    fetchDropdownData()
  }, [])

  const fetchSAASS = async () => {
    try {
      const { data, error } = await supabase
        .from('saass')
        .select('*')
        .eq('numero_serie_saass', numero_serie_saass)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          numero_serie_saass: data.numero_serie_saass,
          numero_serie_eletronica: data.numero_serie_eletronica,
          numero_serie_hidrofone: data.numero_serie_hidrofone,
          numero_serie_pack_baterias: data.numero_serie_pack_baterias,
          numero_serie_tubo: data.numero_serie_tubo,
          profundidade_metros: data.profundidade_metros.toString(),
          data_fabricacao: data.data_fabricacao
        })
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados do SAASS.')
    }
  }

  const fetchDropdownData = async () => {
    try {
      // Buscar eletrônicas
      const { data: eletronicasData } = await supabase
        .from('eletronicas')
        .select('numero_serie_eletronica')
        .order('numero_serie_eletronica')
      
      // Buscar hidrofones
      const { data: hidrofonesData } = await supabase
        .from('hidrofones')
        .select('numero_serie_hidrofone')
        .order('numero_serie_hidrofone')
      
      // Buscar packs de baterias
      const { data: packsData } = await supabase
        .from('packs_baterias')
        .select('numero_serie_pack_baterias')
        .order('numero_serie_pack_baterias')
      
      // Buscar tubos
      const { data: tubosData } = await supabase
        .from('tubos')
        .select('numero_serie_tubo')
        .order('numero_serie_tubo')
      
      setEletronicas(eletronicasData || [])
      setHidrofones(hidrofonesData || [])
      setPacksBaterias(packsData || [])
      setTubos(tubosData || [])
    } catch (error) {
      console.error('Erro ao carregar dados para dropdowns:', error)
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
        .from('saass')
        .update({
          numero_serie_eletronica: formData.numero_serie_eletronica,
          numero_serie_hidrofone: formData.numero_serie_hidrofone,
          numero_serie_pack_baterias: formData.numero_serie_pack_baterias,
          numero_serie_tubo: formData.numero_serie_tubo,
          profundidade_metros: parseInt(formData.profundidade_metros),
          data_fabricacao: formData.data_fabricacao,
          data_atualizacao: new Date().toISOString()
        })
        .eq('numero_serie_saass', numero_serie_saass)
      
      if (error) throw error
      router.push('/saass')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este SAASS?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('saass')
        .delete()
        .eq('numero_serie_saass', numero_serie_saass)
      
      if (error) throw error
      router.push('/saass')
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
            href="/saass"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar SAASS</h1>
            <p className="text-gray-600">Edite os dados do SAASS {numero_serie_saass}</p>
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
              Número de Série do SAASS
            </label>
            <input
              type="text"
              name="numero_serie_saass"
              value={formData.numero_serie_saass}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profundidade (metros)
            </label>
            <input
              type="number"
              name="profundidade_metros"
              required
              min="1"
              value={formData.profundidade_metros}
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
              Eletrônica
            </label>
            <select
              name="numero_serie_eletronica"
              required
              value={formData.numero_serie_eletronica}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma eletrônica</option>
              {eletronicas.map((eletronica) => (
                <option key={eletronica.numero_serie_eletronica} value={eletronica.numero_serie_eletronica}>
                  {eletronica.numero_serie_eletronica}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hidrofone
            </label>
            <select
              name="numero_serie_hidrofone"
              required
              value={formData.numero_serie_hidrofone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um hidrofone</option>
              {hidrofones.map((hidrofone) => (
                <option key={hidrofone.numero_serie_hidrofone} value={hidrofone.numero_serie_hidrofone}>
                  {hidrofone.numero_serie_hidrofone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pack de Baterias
            </label>
            <select
              name="numero_serie_pack_baterias"
              required
              value={formData.numero_serie_pack_baterias}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um pack de baterias</option>
              {packsBaterias.map((pack) => (
                <option key={pack.numero_serie_pack_baterias} value={pack.numero_serie_pack_baterias}>
                  {pack.numero_serie_pack_baterias}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tubo
            </label>
            <select
              name="numero_serie_tubo"
              required
              value={formData.numero_serie_tubo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um tubo</option>
              {tubos.map((tubo) => (
                <option key={tubo.numero_serie_tubo} value={tubo.numero_serie_tubo}>
                  {tubo.numero_serie_tubo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Atualização
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString('pt-BR')}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Atualizada automaticamente</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/saass"
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
