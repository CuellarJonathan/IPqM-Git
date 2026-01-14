const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://uhhphrrfxulrbqbbzdik.supabase.co'
const supabaseServiceKey = 'sb_secret_sRHRAZ_BAHSstimw7aqKkg_1QJhl_a6'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTable() {
  console.log('Tentando criar tabela test_table via RPC...')
  
  // Tentar chamar uma função RPC que executa SQL
  // Supabase não fornece uma função padrão, mas podemos tentar criar uma
  // Vou tentar usar a função RPC 'exec_sql' se existir
  const sql = `
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: sql })
    
    if (error) {
      console.error('Erro ao executar RPC exec_sql:', error.message)
      console.log('A função exec_sql não existe. Tentando abordagem alternativa...')
      await alternativeApproach()
    } else {
      console.log('Tabela criada via RPC:', data)
      await insertData()
    }
  } catch (err) {
    console.error('Exceção:', err.message)
    await alternativeApproach()
  }
}

async function alternativeApproach() {
  console.log('Usando API de execução SQL via fetch...')
  
  // A API de execução SQL do Supabase está em /rest/v1/ com método POST? Não.
  // Vou tentar a API de gerenciamento: https://api.supabase.com/v1/projects/{ref}/sql
  // Precisamos do project ref (identificador do projeto)
  // O project ref pode ser extraído da URL: uhhphrrfxulrbqbbzdik.supabase.co -> ref é "uhhphrrfxulrbqbbzdik"?
  const projectRef = 'uhhphrrfxulrbqbbzdik'
  const sql = `
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    INSERT INTO test_table (name) VALUES 
      ('Exemplo 1'),
      ('Exemplo 2'),
      ('Exemplo 3')
    ON CONFLICT DO NOTHING;
  `
  
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (response.ok) {
      console.log('Tabela criada via API de gerenciamento!')
    } else {
      const errorText = await response.text()
      console.error('Erro API de gerenciamento:', response.status, errorText)
    }
  } catch (err) {
    console.error('Erro de conexão na API de gerenciamento:', err.message)
  }
}

async function insertData() {
  console.log('Inserindo dados de exemplo...')
  const sql = `
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 1' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 2' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 3' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
  `
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: sql })
    if (error) {
      console.error('Erro ao inserir dados:', error.message)
    } else {
      console.log('Dados inseridos.')
    }
  } catch (err) {
    console.error('Exceção ao inserir:', err.message)
  }
}

// Verificar se fetch está disponível
if (typeof fetch === 'undefined') {
  const fetch = require('node-fetch')
  global.fetch = fetch
}

createTable()
