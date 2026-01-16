/**
 * Utilitários para formatação de datas compatíveis com SSR/CSR
 * Evita erros de hidratação garantindo formatação consistente entre servidor e cliente
 */

// Formatar data no formato brasileiro (DD/MM/YYYY)
export function formatDateBR(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário do Brasil (UTC-3)
  // Adicionar 3 horas para compensar a diferença UTC
  const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
  
  // Usar Intl.DateTimeFormat que funciona em SSR e CSR
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(adjustedDate)
}

// Formatar data e hora no formato brasileiro (DD/MM/YYYY HH:MM)
export function formatDateTimeBR(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário do Brasil (UTC-3)
  // Adicionar 3 horas para compensar a diferença UTC
  const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
  
  // Usar Intl.DateTimeFormat que funciona em SSR e CSR
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(adjustedDate)
}

// Formatar data curta (DD/MM)
export function formatDateShort(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário do Brasil (UTC-3)
  // Adicionar 3 horas para compensar a diferença UTC
  const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
  
  // Usar Intl.DateTimeFormat que funciona em SSR e CSR
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit'
  }).format(adjustedDate)
}

// Formatar hora (HH:MM)
export function formatTime(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário do Brasil (UTC-3)
  // Adicionar 3 horas para compensar a diferença UTC
  const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
  
  // Usar Intl.DateTimeFormat que funciona em SSR e CSR
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(adjustedDate)
}

// Converter para input datetime-local (YYYY-MM-DDTHH:MM)
export function toDateTimeLocal(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário local
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

// Converter de input datetime-local para ISO string
export function fromDateTimeLocal(dateTimeLocal: string): string {
  if (!dateTimeLocal) return ''
  
  // Adicionar segundos e milissegundos para criar data completa
  const date = new Date(dateTimeLocal + ':00.000Z')
  return date.toISOString()
}

// Calcular diferença em dias entre duas datas
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Verificar se é uma data válida
export function isValidDate(dateString: string | Date): boolean {
  if (!dateString) return false
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date instanceof Date && !isNaN(date.getTime())
}

// Obter ano atual (para footer, etc.)
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

// Formatar data relativa (ex: "2 horas atrás", "1 dia atrás")
export function formatRelativeTime(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Ajustar para fuso horário do Brasil (UTC-3)
  // Adicionar 3 horas para compensar a diferença UTC
  const adjustedDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
  const now = new Date()
  
  const diffMs = now.getTime() - adjustedDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins} minuto${diffMins !== 1 ? 's' : ''} atrás`
  } else if (diffHours < 24) {
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`
  } else if (diffDays < 30) {
    return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`
  } else {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(adjustedDate)
  }
}

// Formatar número no formato brasileiro (1.234,56)
export function formatNumberBR(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num)
}
