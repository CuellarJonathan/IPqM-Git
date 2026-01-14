'use client'

import { useState } from 'react'
import { FileText, Download, Calendar } from 'lucide-react'

export default function RelatoriosPage() {
  const [tipo, setTipo] = useState('mensal')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const handleGerar = () => {
    alert(`Relatório ${tipo} gerado para o período ${dataInicio} a ${dataFim}.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios personalizados do sistema</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configurar Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
              <option value="customizado">Customizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGerar}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <FileText className="w-5 h-5 mr-2" />
              Gerar Relatório
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Relatórios Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold">Lançamentos por Mês</h4>
              </div>
              <p className="text-sm text-gray-600">Resumo de lançamentos realizados por mês.</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Baixar PDF
              </button>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-green-600" />
                <h4 className="font-bold">Inventário de Componentes</h4>
              </div>
              <p className="text-sm text-gray-600">Lista completa de eletrônicas, hidrofones, etc.</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Baixar CSV
              </button>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <Download className="w-6 h-6 text-purple-600" />
                <h4 className="font-bold">Status de SAASS</h4>
              </div>
              <p className="text-sm text-gray-600">Relatório de SAASS ativos, em missão, etc.</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Baixar Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
