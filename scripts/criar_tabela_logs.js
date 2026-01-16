const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente não encontradas')
  console.log('Certifique-se de que o arquivo .env.local existe com:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=...')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verificarOuCriarTabela() {
  console.log('Verificando se a tabela sistema_logs existe...')
  
  try {
    // Tentar buscar da tabela para ver se existe
    const { data, error } = await supabase
      .from('sistema_logs')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('❌ Tabela sistema_logs não existe.')
        console.log('\n📋 Para criar a tabela, siga estes passos:')
        console.log('1. Acesse https://supabase.com/dashboard/project/[seu-projeto]')
        console.log('2. Vá para "SQL Editor" no menu lateral')
        console.log('3. Cole o conteúdo do arquivo create_logs_table.sql')
        console.log('4. Execute o SQL')
        console.log('\n📄 O arquivo SQL está em: create_logs_table.sql')
        console.log('\n💡 Após criar a tabela, execute novamente:')
        console.log('   node scripts/gerar_logs_retroativos.js')
        return false
      } else {
        console.error('Erro ao verificar tabela:', error.message)
        return false
      }
    } else {
      console.log('✅ Tabela sistema_logs já existe!')
      console.log(`📊 Total de registros: ${data?.length || 0}`)
      return true
    }
  } catch (err) {
    console.error('Erro geral:', err.message)
    return false
  }
}

async function verificarViewDashboard() {
  console.log('\nVerificando view vw_logs_dashboard...')
  
  try {
    const { data, error } = await supabase
      .from('vw_logs_dashboard')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('❌ View vw_logs_dashboard não existe.')
        console.log('A view será criada quando você executar o SQL completo.')
        return false
      } else {
        console.error('Erro ao verificar view:', error.message)
        return false
      }
    } else {
      console.log('✅ View vw_logs_dashboard já existe!')
      return true
    }
  } catch (err) {
    console.error('Erro geral:', err.message)
    return false
  }
}

async function main() {
  console.log('🔍 Verificação do sistema de logs\n')
  
  const tabelaExiste = await verificarOuCriarTabela()
  const viewExiste = await verificarViewDashboard()
  
  console.log('\n' + '='.repeat(50))
  
  if (tabelaExiste && viewExiste) {
    console.log('✅ Sistema de logs está pronto!')
    console.log('📊 O dashboard mostrará atividades em tempo real.')
  } else {
    console.log('⚠️  Ação necessária:')
    console.log('   Execute o SQL em create_logs_table.sql no Supabase SQL Editor')
    console.log('\n📋 Resumo do que será criado:')
    console.log('   - Tabela sistema_logs para armazenar logs')
    console.log('   - Índices para performance')
    console.log('   - Função registrar_log() para facilitar inserção')
    console.log('   - View vw_logs_dashboard para o dashboard')
  }
  
  console.log('\n💡 Dica: Após criar a tabela, execute:')
  console.log('   node scripts/gerar_logs_retroativos.js')
}

main()
