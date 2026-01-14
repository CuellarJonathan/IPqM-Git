const fetch = require('node-fetch')

const supabaseUrl = 'https://uhhphrrfxulrbqbbzdik.supabase.co'
const supabaseServiceKey = 'sb_secret_sRHRAZ_BAHSstimw7aqKkg_1QJhl_a6'

async function runSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }
  
  return response
}

async function createTable() {
  console.log('Criando tabela test_table...')
  
  const sql = `
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  
  const insertSql = `
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 1' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 2' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 3' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
  `
  
  try {
    await runSql(sql)
    console.log('Tabela criada (ou já existia).')
    
    await runSql(insertSql)
    console.log('Dados de exemplo inseridos.')
    
    console.log('Tabela test_table pronta!')
  } catch (err) {
    console.error('Erro:', err.message)
  }
}

createTable()
