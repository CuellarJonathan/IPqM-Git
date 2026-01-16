import { supabase } from './supabaseClient'

export interface LogEntry {
  modulo: string
  acao: string
  entidade: string
  id_entidade?: number
  descricao?: string
  detalhes?: any
  usuario?: string
  ip_address?: string
  user_agent?: string
}

export async function registrarLog(logEntry: LogEntry): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sistema_logs')
      .insert([{
        modulo: logEntry.modulo,
        acao: logEntry.acao,
        entidade: logEntry.entidade,
        id_entidade: logEntry.id_entidade,
        descricao: logEntry.descricao,
        detalhes: logEntry.detalhes,
        usuario: logEntry.usuario,
        ip_address: logEntry.ip_address,
        user_agent: logEntry.user_agent
      }])

    if (error) {
      console.error('Erro ao registrar log:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Erro ao registrar log:', error)
    return false
  }
}

// Funções auxiliares para tipos comuns de logs
export async function logCriacao(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'criar',
    entidade,
    id_entidade,
    descricao: descricao || `${entidade} criado(a)`,
    detalhes
  })
}

export async function logEdicao(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'editar',
    entidade,
    id_entidade,
    descricao: descricao || `${entidade} editado(a)`,
    detalhes
  })
}

export async function logExclusao(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'excluir',
    entidade,
    id_entidade,
    descricao: descricao || `${entidade} excluído(a)`,
    detalhes
  })
}

export async function logAssociacao(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'associar',
    entidade,
    id_entidade,
    descricao: descricao || `Associação realizada`,
    detalhes
  })
}

export async function logEntrega(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'entrega',
    entidade,
    id_entidade,
    descricao: descricao || `Entrega registrada`,
    detalhes
  })
}

export async function logRetorno(
  modulo: string,
  entidade: string,
  id_entidade?: number,
  descricao?: string,
  detalhes?: any
): Promise<boolean> {
  return registrarLog({
    modulo,
    acao: 'retorno',
    entidade,
    id_entidade,
    descricao: descricao || `Retorno registrado`,
    detalhes
  })
}

// Função para buscar logs recentes para o dashboard com paginação
export async function buscarLogsRecentes(pagina: number = 1, porPagina: number = 10) {
  try {
    const inicio = (pagina - 1) * porPagina
    const fim = inicio + porPagina - 1
    
    const { data, error, count } = await supabase
      .from('vw_logs_dashboard')
      .select('*', { count: 'exact' })
      .order('data_hora', { ascending: false })
      .range(inicio, fim)

    if (error) throw error
    
    const totalPaginas = count ? Math.ceil(count / porPagina) : 0
    
    return {
      logs: data || [],
      paginaAtual: pagina,
      porPagina,
      totalRegistros: count || 0,
      totalPaginas
    }
  } catch (error) {
    console.error('Erro ao buscar logs recentes:', error)
    return {
      logs: [],
      paginaAtual: pagina,
      porPagina,
      totalRegistros: 0,
      totalPaginas: 0
    }
  }
}

// Função para buscar estatísticas do dashboard
export async function buscarEstatisticasDashboard() {
  try {
    // Buscar lançamento mais recente
    const { data: lancamentoRecente, error: errorLancamento } = await supabase
      .from('lancamentos')
      .select('numero_lancamento, descricao')
      .order('numero_lancamento', { ascending: false })
      .limit(1)
      .single()

    // Normalizar dados do lançamento
    const lancamentoNormalizado = lancamentoRecente ? {
      numero_lancamento: lancamentoRecente.numero_lancamento,
      descricao: lancamentoRecente.descricao || 'Sem descrição'
    } : { numero_lancamento: 0, descricao: 'Nenhum lançamento' }

    // Buscar última entrega
    const { data: ultimaEntrega, error: errorEntrega } = await supabase
      .from('entregas_lancamentos')
      .select('data_hora_entrega')
      .order('data_hora_entrega', { ascending: false })
      .limit(1)
      .single()

    // Buscar último SAASS registrado
    const { data: ultimoSaass, error: errorSaass } = await supabase
      .from('saass')
      .select('data_fabricacao')
      .order('data_fabricacao', { ascending: false })
      .limit(1)
      .single()

    // Contar total de SAASS
    const { count: totalSaass, error: errorTotalSaass } = await supabase
      .from('saass')
      .select('*', { count: 'exact', head: true })

    // Calcular dias desde última entrega
    let diasDesdeUltimaEntrega = 0
    if (ultimaEntrega?.data_hora_entrega) {
      const ultimaEntregaDate = new Date(ultimaEntrega.data_hora_entrega)
      const hoje = new Date()
      const diffTime = Math.abs(hoje.getTime() - ultimaEntregaDate.getTime())
      diasDesdeUltimaEntrega = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Calcular dias desde último SAASS
    let diasDesdeUltimoSaass = 0
    if (ultimoSaass?.data_fabricacao) {
      const ultimoSaassDate = new Date(ultimoSaass.data_fabricacao)
      const hoje = new Date()
      const diffTime = Math.abs(hoje.getTime() - ultimoSaassDate.getTime())
      diasDesdeUltimoSaass = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return {
      currentLaunch: lancamentoNormalizado,
      daysSinceLastDelivery: diasDesdeUltimaEntrega,
      daysSinceLastSAASS: diasDesdeUltimoSaass,
      totalSAASS: totalSaass || 0,
      errors: {
        lancamento: errorLancamento,
        entrega: errorEntrega,
        saass: errorSaass,
        totalSaass: errorTotalSaass
      }
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return {
      currentLaunch: { numero_lancamento: 0, descricao: 'Erro ao carregar' },
      daysSinceLastDelivery: 0,
      daysSinceLastSAASS: 0,
      totalSAASS: 0,
      errors: { geral: error }
    }
  }
}
