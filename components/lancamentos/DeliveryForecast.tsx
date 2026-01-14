import { Calendar, Info } from 'lucide-react'

// Função para gerar previsões (mockada)
function generateForecasts() {
  const lastDelivery = new Date('2026-01-12') // Última entrega conhecida
  const forecasts = []
  const daysBetween = 60 // Dias entre entregas
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  let currentDate = new Date(lastDelivery)
  let forecastNumber = 1

  while (currentDate < oneYearFromNow) {
    currentDate.setDate(currentDate.getDate() + daysBetween)
    if (currentDate > oneYearFromNow) break

    forecasts.push({
      id: forecastNumber,
      date: new Date(currentDate),
      status: forecastNumber === 1 ? 'próxima' : 'futura'
    })
    forecastNumber++
  }

  return forecasts
}

const forecasts = generateForecasts()

export default function DeliveryForecast() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Previsão de Entregas</h2>
          <p className="text-gray-600">Previsões baseadas em 60 dias entre entregas</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Info size={16} className="mr-2" />
          <span>Horizonte: 1 ano</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número da entrega prevista</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data prevista de entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias até a entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {forecasts.map((forecast) => {
              const today = new Date()
              const daysUntil = Math.ceil((forecast.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              
              return (
                <tr key={forecast.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="mr-3 text-gray-400" size={18} />
                      <span className="font-medium">Entrega #{forecast.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {forecast.date.toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      daysUntil <= 30 
                        ? 'bg-red-100 text-red-800' 
                        : daysUntil <= 60 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {daysUntil} dias
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      forecast.status === 'próxima' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {forecast.status === 'próxima' ? 'Próxima' : 'Futura'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-gray-500">
          <p><strong>Nota:</strong> Esta previsão é baseada na última entrega registrada (12/01/2026) e assume um intervalo fixo de 60 dias entre entregas. As datas são estimativas e podem ser ajustadas conforme a operação real.</p>
          <p className="mt-2">Última entrega considerada: 12/01/2026</p>
        </div>
      </div>
    </div>
  )
}
