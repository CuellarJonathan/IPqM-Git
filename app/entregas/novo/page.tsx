'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewEntregaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lancamentosSaass, setLancamentosSaass] = useState<any[]>([])
  const [formData, setFormData] = useState({
    id_lancamento_saass: '',
    responsavel_entrega: '',
    data_hora_entrega: ''
  })

  useEffect(() => {
    fetchLancamentosSaass()
  }, [])

  const fetchLancamentosSaass = async () => {
    try {
      // Buscar todos os lançamentos SAASS
      const { data: allLancamentosSaass, error: error1 } = await supabase
        .from('lancamentos_saass')
        .select(`
          *,
          lancamentos(numero_lancamento),
          saass(numero_serie_saass)
        `)
        .order('id_lancamento_saass', { ascending: false })
      
      if (error1) throw error1
      
      // Buscar lançamentos SAASS que já têm entregas registradas
      const { data: entregasRegistradas, error: error2 } = await supabase
        .from('entregas_lancamentos')
        .select('id_lancamento_saass')
      
      if (error2) throw error2
      
      // Criar conjunto de IDs que já têm entrega
      const idsComEntrega = new Set(entregasRegistradas?.map(e => e.id_lancamento_saass) || [])
      
      // Filtrar apenas lançamentos SAASS que ainda não têm entrega
      const lancamentosSemEntrega = allLancamentosSaass?.filter(
        ls => !idsComEntrega.has(ls.id_lancamento_saass)
      ) || []
      
      setLancamentosSaass(lancamentosSemEntrega)
    } catch (error) {
      console.error('Erro ao buscar lançamentos SAASS:', error)
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
        .from('entregas_lancamentos')
        .insert([{
          id_lancamento_saass: parseInt(formData.id_lancamento_saass),
          responsavel_entrega: formData.responsavel_entrega,
          data_hora_entrega: new Date(formData.data_hora_entrega).toISOString()
        }])
      if (error) throw error
      router.push('/entregas')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/entregas"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Entrega</h1>
          <p className="text-gray-600">Preencha os dados para criar uma nova entrega</p>
        </div>
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
              Responsável pela Entrega
            </label>
            <input
              type="text"
              name="responsavel_entrega"
              required
              value={formData.responsavel_entrega}
              onChange={handleChange}
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
              value={formData.data_hora_entrega}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/entregas"
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
