'use client'

import { useState } from 'react'
import { Download, Database, FileSpreadsheet, FileText } from 'lucide-react'

export default function ExportarPage() {
  const [format, setFormat] = useState('csv')
  const [tabelas, setTabelas] = useState(['eletronicas', 'saass', 'lancamentos'])

  const toggleTabela = (tabela: string) => {
    setTabelas(prev =>
      prev.includes(tabela)
        ? prev.filter(t => t !== tabela)
        : [...prev, tabela]
    )
  }

  const handleExport = () => {
    alert(`Exportando tabelas ${tabelas.join(', ')} no formato ${format.toUpperCase()}.`)
  }

  const allTables = [
    { id: 'eletronicas', label: 'Eletrônicas' },
    { id: 'hidrofones', label: 'Hidrofones' },
    { id: 'packs-baterias', label: 'Packs de Baterias' },
    { id: 'tubos', label: 'Tubos' },
    { id: 'saass', label: 'SAASS' },
    { id: 'lancamentos', label: 'Lançamentos' },
    { id: 'entregas', label: 'Entregas' },
    { id: 'retornos', label: 'Retornos' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exportar Dados</h1>
        <p className="text-gray-600">Exporte dados do sistema para uso externo</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configurar Exportação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Saída
            </label>
            <div className="flex gap-4">
              {[
                { id: 'csv', label: 'CSV', icon: FileSpreadsheet },
                { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
                { id: 'json', label: 'JSON', icon: FileText },
              ].map((fmt) => {
                const Icon = fmt.icon
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id)}
                    className={`flex-1 flex flex-col items-center p-4 border rounded-lg ${format === fmt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <span className="font-medium">{fmt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tabelas para Exportar
            </label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {allTables.map((table) => (
                  <div key={table.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={table.id}
                      checked={tabelas.includes(table.id)}
                      onChange={() => toggleTabela(table.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={table.id} className="ml-2 text-sm">
                      {table.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setTabelas(allTables.map(t => t.id))}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Selecionar Todas
              </button>
              <button
                onClick={() => setTabelas([])}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Limpar Seleção
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Exportar Agora</h3>
              <p className="text-gray-600">
                {tabelas.length} tabela(s) selecionada(s) • Formato: {format.toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Iniciar Exportação
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Exportações Recentes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">export_2026_01_14.csv</h4>
                  <p className="text-sm text-gray-500">14/01/2026 10:30 • 3 tabelas</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Baixar
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">backup_saass.json</h4>
                  <p className="text-sm text-gray-500">13/01/2026 15:45 • 1 tabela</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Baixar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
