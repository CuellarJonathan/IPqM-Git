'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewLancamentoSaassPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [saass, setSaass] = useState<any[]>([])
  const [formData, setFormData] = useState({
    numero_lancamento: '',
    numero_serie_saass: ''
  })

  useEffect(() => {
    fetchLancamentos()
    fetchSaass()
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

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('lancamentos_saass')
        .insert([{
          numero_lancamento: parseInt(formData.numero_lancamento),
          numero_serie_saass: formData.numero_serie_saass
        }])
      if (error) throw error
      router.push('/lancamentos-saass')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar. Verifique se esta associação já existe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/lancamentos-saass"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Associação</h1>
          <p className="text-gray-600">Associe um lançamento a um SAASS</p>
        </div>
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
    </div>
  )
}
