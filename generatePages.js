const fs = require('fs');
const path = require('path');

const entities = [
  {
    name: 'hidrofones',
    singular: 'hidrofone',
    table: 'hidrofones',
    columns: [
      { name: 'numero_serie_hidrofone', label: 'Número de Série', type: 'text' },
      { name: 'versao_hidrofone', label: 'Versão', type: 'text' },
      { name: 'data_fabricacao', label: 'Data Fabricação', type: 'date' },
      { name: 'data_atualizacao', label: 'Última Atualização', type: 'timestamp' },
    ]
  },
  {
    name: 'packs-baterias',
    singular: 'pack_baterias',
    table: 'packs_baterias',
    columns: [
      { name: 'numero_serie_pack_baterias', label: 'Número de Série', type: 'text' },
      { name: 'versao_pack_baterias', label: 'Versão', type: 'text' },
      { name: 'data_fabricacao', label: 'Data Fabricação', type: 'date' },
      { name: 'data_atualizacao', label: 'Última Atualização', type: 'timestamp' },
    ]
  },
  {
    name: 'tubos',
    singular: 'tubo',
    table: 'tubos',
    columns: [
      { name: 'numero_serie_tubo', label: 'Número de Série', type: 'text' },
      { name: 'versao_tubo', label: 'Versão', type: 'text' },
      { name: 'profundidade_metros', label: 'Profundidade (m)', type: 'number' },
      { name: 'data_fabricacao', label: 'Data Fabricação', type: 'date' },
      { name: 'data_atualizacao', label: 'Última Atualização', type: 'timestamp' },
    ]
  },
  {
    name: 'saass',
    singular: 'saass',
    table: 'saass',
    columns: [
      { name: 'numero_serie_saass', label: 'Número de Série', type: 'text' },
      { name: 'numero_serie_eletronica', label: 'Eletrônica', type: 'text' },
      { name: 'numero_serie_hidrofone', label: 'Hidrofone', type: 'text' },
      { name: 'numero_serie_pack_baterias', label: 'Pack Baterias', type: 'text' },
      { name: 'numero_serie_tubo', label: 'Tubo', type: 'text' },
      { name: 'profundidade_metros', label: 'Profundidade (m)', type: 'number' },
      { name: 'data_fabricacao', label: 'Data Fabricação', type: 'date' },
      { name: 'data_atualizacao', label: 'Última Atualização', type: 'timestamp' },
    ]
  },
  {
    name: 'entregas',
    singular: 'entrega',
    table: 'entregas_lancamentos',
    columns: [
      { name: 'id_entrega_lancamento', label: 'ID', type: 'number' },
      { name: 'id_lancamento_saass', label: 'Lançamento SAASS', type: 'number' },
      { name: 'responsavel_entrega', label: 'Responsável', type: 'text' },
      { name: 'data_hora_entrega', label: 'Data/Hora Entrega', type: 'timestamp' },
    ]
  },
  {
    name: 'retornos',
    singular: 'retorno',
    table: 'retornos_lancamentos',
    columns: [
      { name: 'id_retorno_lancamento', label: 'ID', type: 'number' },
      { name: 'id_lancamento_saass', label: 'Lançamento SAASS', type: 'number' },
      { name: 'responsavel_retorno', label: 'Responsável', type: 'text' },
      { name: 'data_hora_retorno', label: 'Data/Hora Retorno', type: 'timestamp' },
    ]
  },
  {
    name: 'configuracoes',
    singular: 'configuracao',
    table: 'configuracoes',
    columns: [
      { name: 'chave', label: 'Chave', type: 'text' },
      { name: 'valor', label: 'Valor', type: 'text' },
      { name: 'descricao', label: 'Descrição', type: 'text' },
    ]
  }
];

const template = (entity) => `
import { supabase } from '@/lib/supabaseClient'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ${entity.singular.charAt(0).toUpperCase() + entity.singular.slice(1)}Page() {
  const { data: items, error } = await supabase
    .from('${entity.table}')
    .select('*')
    .order('${entity.columns[0].name}', { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}</h1>
          <p className="text-gray-600">Gerencie os ${entity.name} do sistema</p>
        </div>
        <Link
          href="/${entity.name}/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo ${entity.singular}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                ${entity.columns.map(col => `
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ${col.label}
                </th>
                `).join('')}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => (
                <tr key={item.${entity.columns[0].name}}>
                  ${entity.columns.map(col => `
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.${col.name}}
                  </td>
                  `).join('')}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href="/${entity.name}/${'${item.' + entity.columns[0].name + '}'}" className="text-blue-600 hover:text-blue-900 mr-4">
                      Editar
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!items || items.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            Nenhum ${entity.singular} cadastrado.
          </div>
        )}
      </div>
    </div>
  )
}
`;

entities.forEach(entity => {
  const dir = path.join(__dirname, 'app', entity.name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'page.tsx');
  fs.writeFileSync(filePath, template(entity));
  console.log(`Generated ${filePath}`);
});

console.log('All pages generated.');
