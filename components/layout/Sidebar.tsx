import Link from 'next/link'
import { 
  Home, 
  Package, 
  Battery, 
  Radio, 
  Cylinder, 
  Satellite, 
  Rocket, 
  Truck, 
  RotateCcw,
  Settings
} from 'lucide-react'

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/eletronicas', label: 'Eletrônicas', icon: Radio },
  { href: '/hidrofones', label: 'Hidrofones', icon: Satellite },
  { href: '/packs-baterias', label: 'Packs de Baterias', icon: Battery },
  { href: '/tubos', label: 'Tubos', icon: Cylinder },
  { href: '/saass', label: 'SAASS', icon: Package },
  { href: '/lancamentos', label: 'Lançamentos', icon: Rocket },
  { href: '/entregas', label: 'Entregas', icon: Truck },
  { href: '/retornos', label: 'Retornos', icon: RotateCcw },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">IPqM SAASS</h1>
        <p className="text-gray-400 text-sm">Gestão de Componentes e Lançamentos</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <p>Banco de dados: Supabase</p>
          <p>Timezone: UTC</p>
        </div>
      </div>
    </aside>
  )
}
