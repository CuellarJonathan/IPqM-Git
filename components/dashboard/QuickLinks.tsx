import Link from 'next/link'
import { PlusCircle, FileText, Download, BarChart3 } from 'lucide-react'

const quickLinks = [
  { href: '/eletronicas/novo', label: 'Nova Eletrônica', icon: PlusCircle, color: 'bg-blue-100 text-blue-600' },
  { href: '/saass/novo', label: 'Novo SAASS', icon: PlusCircle, color: 'bg-green-100 text-green-600' },
  { href: '/lancamentos/novo', label: 'Novo Lançamento', icon: PlusCircle, color: 'bg-purple-100 text-purple-600' },
  { href: '/relatorios', label: 'Gerar Relatório', icon: FileText, color: 'bg-amber-100 text-amber-600' },
  { href: '/exportar', label: 'Exportar Dados', icon: Download, color: 'bg-red-100 text-red-600' },
  { href: '/analytics', label: 'Análises', icon: BarChart3, color: 'bg-indigo-100 text-indigo-600' },
]

export default function QuickLinks() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-3 rounded-full ${link.color} mb-3`}>
                <Icon size={24} />
              </div>
              <span className="font-medium text-center">{link.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-500">
          <strong>Dica:</strong> Use o menu lateral para acessar todas as funcionalidades do sistema.
        </p>
      </div>
    </div>
  )
}
