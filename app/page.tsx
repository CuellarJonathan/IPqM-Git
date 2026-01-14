'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('test_table') // Substitua pelo nome da sua tabela
          .select('*')
          .limit(5)

        if (error) {
          console.error('Erro ao buscar dados:', error)
          setError(error.message)
        } else {
          setData(data || [])
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        setError('Erro inesperado ao conectar com o Supabase')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            IPqM Git - Integração com Supabase
          </h1>
          <p className="text-gray-600 mt-2">
            Esta aplicação demonstra a conexão com o Supabase usando Next.js, TypeScript e TailwindCSS.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Status da Conexão
          </h2>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
            <span className="text-gray-700">
              Conectado ao Supabase: <strong>{process.env.NEXT_PUBLIC_SUPABASE_URL}</strong>
            </span>
          </div>
          <p className="mt-4 text-gray-600">
            A chave da API está configurada no ambiente. O cliente Supabase está pronto para uso.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Dados da Tabela de Exemplo
          </h2>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-medium text-red-800">Erro na consulta</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <p className="text-red-600 text-sm mt-2">
                Provavelmente a tabela "test_table" não existe. Crie uma tabela no Supabase ou altere o código para usar uma tabela existente.
              </p>
            </div>
          )}
          {loading ? (
            <div className="text-gray-500">Carregando dados...</div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value: any, colIdx) => (
                        <td
                          key={colIdx}
                          className="px-4 py-3 text-sm text-gray-800"
                        >
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500">
              Nenhum dado encontrado. Certifique-se de que a tabela "test_table" existe no seu projeto Supabase.
            </div>
          )}
          <div className="mt-6 text-sm text-gray-500">
            <p>
              <strong>Nota:</strong> Esta página busca dados de uma tabela chamada "test_table". 
              Você pode criar essa tabela no Supabase ou alterar o código para usar uma tabela existente.
            </p>
            <p className="mt-2">
              Para criar uma tabela de exemplo, acesse o dashboard do Supabase, vá para o editor SQL e execute:
            </p>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
{`CREATE TABLE test_table (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO test_table (name) VALUES ('Exemplo 1'), ('Exemplo 2'), ('Exemplo 3');`}
            </pre>
          </div>
        </div>

        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>
            Projeto configurado com Next.js, TypeScript, TailwindCSS e Supabase.
          </p>
          <p className="mt-1">
            URL do Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </footer>
      </div>
    </div>
  )
}
