'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import LaunchTable from '@/components/lancamentos/LaunchTable'
import DeliveryForecast from '@/components/lancamentos/DeliveryForecast'
import { formatDateBR } from '@/lib/dateUtils';


export default function LancamentosPage() {
  const [summary, setSummary] = useState({
    totalLancamentos: 0,
    registroMaisAntigo: null as { numero_lancamento: number, data_entrega: string } | null,
    saassAtivosEmLancamento: 0,
    proximoLancamento: 0,
    loading: true
  })

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      // 1. Buscar total de lançamentos registrados
      const { count: lancamentosCount, error: lancamentosError } = await supabase
        .from('lancamentos')
        .select('*', { count: 'exact', head: true })
      
      if (lancamentosError) throw lancamentosError

      // 2. Buscar registro mais antigo (lançamento com entrega mais antiga)
      let registroMaisAntigo = null
      
      try {
        // Primeiro, buscar a entrega mais antiga
        const { data: entregaMaisAntigaData, error: entregaAntigaError } = await supabase
          .from('entregas_lancamentos')
          .select('data_hora_entrega, id_lancamento_saass')
          .order('data_hora_entrega', { ascending: true })
          .limit(1)
        
        if (entregaAntigaError) throw entregaAntigaError

        if (entregaMaisAntigaData && entregaMaisAntigaData.length > 0) {
          const entrega = entregaMaisAntigaData[0]
          
          // Buscar o lançamento associado através de lancamentos_saass
          const { data: lancamentoSaassData, error: lsError } = await supabase
            .from('lancamentos_saass')
            .select('numero_lancamento')
            .eq('id_lancamento_saass', entrega.id_lancamento_saass)
            .single()
          
          if (!lsError && lancamentoSaassData) {
            registroMaisAntigo = {
              numero_lancamento: lancamentoSaassData.numero_lancamento,
              data_entrega: entrega.data_hora_entrega
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar registro mais antigo:', error)
        // Continuar mesmo com erro, registroMaisAntigo permanecerá null
      }

      // 3. Buscar SAASS ativos em lançamento (SAASS com entrega mas sem retorno)
      const { data: saassAtivosData, error: saassAtivosError } = await supabase
        .from('lancamentos_saass')
        .select(`
          id_lancamento_saass,
          entregas_lancamentos!left(data_hora_entrega),
          retornos_lancamentos!left(data_hora_retorno)
        `)
      
      if (saassAtivosError) throw saassAtivosError

      // Contar SAASS que têm pelo menos uma entrega mas nenhum retorno
      const saassAtivosEmLancamento = saassAtivosData?.filter(item => {
        const temEntrega = item.entregas_lancamentos && 
                          item.entregas_lancamentos.length > 0 && 
                          item.entregas_lancamentos.some((e: any) => e.data_hora_entrega)
        const temRetorno = item.retornos_lancamentos && 
                          item.retornos_lancamentos.length > 0 && 
                          item.retornos_lancamentos.some((r: any) => r.data_hora_retorno)
        return temEntrega && !temRetorno
      }).length || 0

      // 4. Buscar maior número de lançamento para calcular o próximo
      const { data: lancamentosData, error: maxError } = await supabase
        .from('lancamentos')
        .select('numero_lancamento')
        .order('numero_lancamento', { ascending: false })
        .limit(1)
      
      if (maxError) throw maxError

      const maxLancamento = lancamentosData?.[0]?.numero_lancamento || 0
      const proximoLancamento = maxLancamento + 1

      setSummary({
        totalLancamentos: lancamentosCount || 0,
        registroMaisAntigo,
        saassAtivosEmLancamento,
        proximoLancamento,
        loading: false
      })
    } catch (error) {
      console.error('Erro ao buscar resumo:', error)
      setSummary(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lançamentos</h1>
        <p className="text-gray-600">Gestão de lançamentos, entregas e previsões</p>
      </div>

      {/* Primeira linha: Previsão de entregas + Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeliveryForecast />
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo</h2>
            {summary.loading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total de lançamentos registrados</p>
                  <p className="text-2xl font-bold">{summary.totalLancamentos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registro mais antigo</p>
                  {summary.registroMaisAntigo ? (
                    <div>
                      <p className="text-lg font-bold">L{summary.registroMaisAntigo.numero_lancamento}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateBR(summary.registroMaisAntigo.data_entrega)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-gray-400">Nenhum registro</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">SAASS ativos em lançamento</p>
                  <p className="text-2xl font-bold">{summary.saassAtivosEmLancamento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Próximo lançamento</p>
                  <p className="text-2xl font-bold">L{summary.proximoLancamento}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Segunda linha: Lista de lançamentos */}
      <div>
        <LaunchTable />
      </div>
    </div>
  )
}
