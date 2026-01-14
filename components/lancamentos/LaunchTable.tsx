import { Eye, Edit, Trash2 } from 'lucide-react'

// Dados mockados (serão substituídos por consultas ao Supabase)
const launches = [
  { 
    numero_lancamento: 134, 
    descricao: 'Lançamento de teste no Atlântico Sul',
    quantidade_saass: 3,
    ultima_entrega: '2026-01-10',
    ultimo_retorno: '2026-01-20',
  },
  { 
    numero_lancamento: 135, 
    descricao: 'Lançamento operacional no Pacífico',
    quantidade_saass: 2,
    ultima_entrega: '2026-01-12',
    ultimo_retorno: '2026-01-22',
  },
  { 
    numero_lancamento: 136, 
    descricao: 'Treinamento de equipe',
    quantidade_saass: 1,
    ultima_entrega: null,
    ultimo_retorno: null,
  },
  { 
    numero_lancamento: 137, 
    descricao: 'Missão científica',
    quantidade_saass: 4,
    ultima_entrega: '2025-12-15',
    ultimo_retorno: '2025-12-30',
  },
]

export default function LaunchTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Lista de Lançamentos</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Novo Lançamento
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lançamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade de SAASS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último retorno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {launches.map((launch) => (
              <tr key={launch.numero_lancamento} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-lg">L{launch.numero_lancamento}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">{launch.descricao}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {launch.quantidade_saass} SAASS
                  </span>
                </td>
                <td className="px-6 py-4">
                  {launch.ultima_entrega ? (
                    <span className="text-gray-900">{launch.ultima_entrega}</span>
                  ) : (
                    <span className="text-gray-400">Nenhuma</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {launch.ultimo_retorno ? (
                    <span className="text-gray-900">{launch.ultimo_retorno}</span>
                  ) : (
                    <span className="text-gray-400">Nenhum</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {launches.length} lançamentos</div>
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-700">Anterior</button>
          <span className="font-medium">Página 1 de 1</span>
          <button className="hover:text-gray-700">Próxima</button>
        </div>
      </div>
    </div>
  )
}
