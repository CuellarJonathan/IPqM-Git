const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'eletronicas', singular: 'eletronica' },
  { name: 'hidrofones', singular: 'hidrofone' },
  { name: 'packs-baterias', singular: 'pack_baterias' },
  { name: 'tubos', singular: 'tubo' },
  { name: 'saass', singular: 'saass' },
  { name: 'lancamentos', singular: 'lancamento' },
  { name: 'entregas', singular: 'entrega' },
  { name: 'retornos', singular: 'retorno' },
];

const template = (entity) => `
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function New${entity.singular.charAt(0).toUpperCase() + entity.singular.slice(1)}Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('${entity.name}')
        .insert([formData])
      if (error) throw error
      router.push('/${entity.name}')
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
          href="/${entity.name}"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo ${entity.singular}</h1>
          <p className="text-gray-600">Preencha os dados para criar um novo ${entity.singular}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Série
            </label>
            <input
              type="text"
              name="numero_serie"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão
            </label>
            <input
              type="text"
              name="versao"
              required
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
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          ${entity.name === 'tubos' ? `
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profundidade (metros)
            </label>
            <input
              type="number"
              name="profundidade_metros"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          ` : ''}
          ${entity.name === 'saass' ? `
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eletrônica (Número de Série)
            </label>
            <input
              type="text"
              name="numero_serie_eletronica"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hidrofone (Número de Série)
            </label>
            <input
              type="text"
              name="numero_serie_hidrofone"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pack de Baterias (Número de Série)
            </label>
            <input
              type="text"
              name="numero_serie_pack_baterias"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tubo (Número de Série)
            </label>
            <input
              type="text"
              name="numero_serie_tubo"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          ` : ''}
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/${entity.name}"
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
`;

entities.forEach(entity => {
  const dir = path.join(__dirname, 'app', entity.name, 'novo');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'page.tsx');
  fs.writeFileSync(filePath, template(entity));
  console.log(`Generated ${filePath}`);
});

console.log('All create pages generated.');
