const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://uhhphrrfxulrbqbbzdik.supabase.co'
const supabaseAnonKey = 'sb_publishable_qXR2_k6KGSq7TQivTdbU7Q_BGiSdFRs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testQuery() {
  console.log('Testando consulta à tabela test_table...')
  
  const { data, error } = await supabase
    .from('test_table')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('Erro na consulta:', error)
  } else {
    console.log('Dados retornados:', data)
    console.log('Número de registros:', data.length)
  }
}

testQuery()
