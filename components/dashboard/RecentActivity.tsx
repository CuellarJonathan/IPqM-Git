import { CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react'

const activities = [
  { 
    id: 1, 
    type: 'delivery', 
    title: 'Entrega de SAASS-001 registrada', 
    description: 'SAASS entregue para lançamento L134', 
    time: '2 horas atrás',
    icon: CheckCircle,
    color: 'text-green-500 bg-green-100'
  },
  { 
    id: 2, 
    type: 'warning', 
    title: 'SAASS próximo da data de revisão', 
    description: 'SAASS-002 precisa de revisão em 15 dias', 
    time: '1 dia atrás',
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-100'
  },
  { 
    id: 3, 
    type: 'info', 
    title: 'Novo tubo registrado', 
    description: 'Tubo TUBE-003 adicionado ao sistema', 
    time: '2 dias atrás',
    icon: Info,
    color: 'text-blue-500 bg-blue-100'
  },
  { 
    id: 4, 
    type: 'pending', 
    title: 'Retorno de SAASS pendente', 
    description: 'SAASS-001 aguardando retorno do lançamento', 
    time: '3 dias atrás',
    icon: Clock,
    color: 'text-gray-500 bg-gray-100'
  },
  { 
    id: 5, 
    type: 'delivery', 
    title: 'Entrega de SAASS-002 concluída', 
    description: 'Entregue para lançamento L135', 
    time: '4 dias atrás',
    icon: CheckCircle,
    color: 'text-green-500 bg-green-100'
  },
]

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Atividade Recente</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Ver todas
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Info size={16} className="mr-2" />
          <p>Atualizações automáticas a cada 5 minutos</p>
        </div>
      </div>
    </div>
  )
}
