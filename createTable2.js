const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://uhhphrrfxulrbqbbzdik.supabase.co'
const supabaseServiceKey = 'sb_secret_sRHRAZ_BAHSstimw7aqKkg_1QJhl_a6'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTable() {
  console.log('Tentando criar tabela test_table...')
  
  // Tentar executar SQL via RPC (se a função existir)
  // Supabase não fornece RPC para DDL por padrão, então usaremos a API REST
  // Vou usar fetch diretamente com a chave de serviço
  const sql = `
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 1' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 2' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
    INSERT INTO test_table (name) 
    SELECT 'Exemplo 3' WHERE NOT EXISTS (SELECT 1 FROM test_table LIMIT 1);
  `
  
  try {
    // A API REST do Supabase para execução SQL está em /rest/v1/ com método POST
    // Mas precisa de cabeçalhos especiais
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
    
    if (response.ok) {
      console.log('Tabela criada com sucesso!')
    } else {
      const errorText = await response.text()
      console.error('Erro ao criar tabela:', response.status, errorText)
    }
  } catch (err) {
    console.error('Erro de conexão:', err.message)
  }
}

// Verificar se fetch está disponível (Node.js 18+ tem fetch nativo)
if (typeof fetch === 'undefined') {
  console.log('Fetch não disponível, importando node-fetch...')
  const fetch = require('node-fetch')
  global.fetch = fetch
}

createTable()
