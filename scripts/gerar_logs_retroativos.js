const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente não encontradas')
  console.log('Certifique-se de que o arquivo .env.local existe com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function gerarLogsRetroativos() {
  console.log('Iniciando geração de logs retroativos...')
  
  try {
    // 1. Logs para Eletrônicas
    console.log('Processando eletrônicas...')
    const { data: eletronicas, error: errorEletronicas } = await supabase
      .from('eletronicas')
      .select('*')
    
    if (!errorEletronicas && eletronicas) {
      for (const eletronica of eletronicas) {
        await registrarLogRetroativo({
          modulo: 'eletronicas',
          acao: 'criar',
          entidade: 'Eletronica',
          id_entidade: null, // IDs são strings, não inteiros
          descricao: `Eletrônica ${eletronica.numero_serie_eletronica} criada retroativamente`,
          detalhes: { 
            numero_serie: eletronica.numero_serie_eletronica,
            tipo: eletronica.tipo, 
            data_criacao: new Date().toISOString() 
          }
        })
      }
      console.log(`  ${eletronicas.length} eletrônicas processadas`)
    }

    // 2. Logs para Hidrofones
    console.log('Processando hidrofones...')
    const { data: hidrofones, error: errorHidrofones } = await supabase
      .from('hidrofones')
      .select('*')
    
    if (!errorHidrofones && hidrofones) {
      for (const hidrofone of hidrofones) {
        await registrarLogRetroativo({
          modulo: 'hidrofones',
          acao: 'criar',
          entidade: 'Hidrofone',
          id_entidade: null, // IDs são strings
          descricao: `Hidrofone ${hidrofone.numero_serie_hidrofone} criado retroativamente`,
          detalhes: { 
            numero_serie: hidrofone.numero_serie_hidrofone,
            tipo: hidrofone.tipo, 
            data_criacao: new Date().toISOString() 
          }
        })
      }
      console.log(`  ${hidrofones.length} hidrofones processados`)
    }

    // 3. Logs para Packs de Baterias
    console.log('Processando packs de baterias...')
    const { data: packsBaterias, error: errorPacks } = await supabase
      .from('packs_baterias')
      .select('*')
    
    if (!errorPacks && packsBaterias) {
      for (const pack of packsBaterias) {
        await registrarLogRetroativo({
          modulo: 'packs_baterias',
          acao: 'criar',
          entidade: 'PackBateria',
          id_entidade: null, // IDs são strings
          descricao: `Pack de baterias ${pack.numero_serie_pack_baterias} criado retroativamente`,
          detalhes: { 
            numero_serie: pack.numero_serie_pack_baterias,
            capacidade: pack.capacidade, 
            data_criacao: new Date().toISOString() 
          }
        })
      }
      console.log(`  ${packsBaterias.length} packs de baterias processados`)
    }

    // 4. Logs para Tubos
    console.log('Processando tubos...')
    const { data: tubos, error: errorTubos } = await supabase
      .from('tubos')
      .select('*')
    
    if (!errorTubos && tubos) {
      for (const tubo of tubos) {
        await registrarLogRetroativo({
          modulo: 'tubos',
          acao: 'criar',
          entidade: 'Tubo',
          id_entidade: null, // IDs são strings
          descricao: `Tubo ${tubo.numero_serie_tubo} criado retroativamente`,
          detalhes: { 
            numero_serie: tubo.numero_serie_tubo,
            material: tubo.material, 
            data_criacao: new Date().toISOString() 
          }
        })
      }
      console.log(`  ${tubos.length} tubos processados`)
    }

    // 5. Logs para SAASS
    console.log('Processando SAASS...')
    const { data: saass, error: errorSaass } = await supabase
      .from('saass')
      .select('*')
    
    if (!errorSaass && saass) {
      for (const saas of saass) {
        await registrarLogRetroativo({
          modulo: 'saass',
          acao: 'criar',
          entidade: 'SAASS',
          id_entidade: null, // IDs são strings
          descricao: `SAASS ${saas.numero_serie_saass} criado retroativamente`,
          detalhes: { 
            numero_serie: saas.numero_serie_saass,
            profundidade: saas.profundidade_metros,
            data_fabricacao: saas.data_fabricacao,
            data_criacao: new Date().toISOString()
          }
        })
      }
      console.log(`  ${saass.length} SAASS processados`)
    }

    // 6. Logs para Lançamentos
    console.log('Processando lançamentos...')
    const { data: lancamentos, error: errorLancamentos } = await supabase
      .from('lancamentos')
      .select('*')
    
    if (!errorLancamentos && lancamentos) {
      for (const lancamento of lancamentos) {
        await registrarLogRetroativo({
          modulo: 'lancamentos',
          acao: 'criar',
          entidade: 'Lancamento',
          id_entidade: lancamento.numero_lancamento, // Este é numérico
          descricao: `Lançamento L${lancamento.numero_lancamento} criado retroativamente`,
          detalhes: { 
            numero_lancamento: lancamento.numero_lancamento,
            descricao: lancamento.descricao,
            data_criacao: new Date().toISOString()
          }
        })
      }
      console.log(`  ${lancamentos.length} lançamentos processados`)
    }

    // 7. Logs para Associações SAASS-Lançamento
    console.log('Processando associações SAASS-Lançamento...')
    const { data: lancamentosSaass, error: errorLancamentosSaass } = await supabase
      .from('lancamentos_saass')
      .select('*')
    
    if (!errorLancamentosSaass && lancamentosSaass) {
      for (const associacao of lancamentosSaass) {
        // Buscar informações do SAASS para melhor descrição
        const { data: saassData } = await supabase
          .from('saass')
          .select('numero_serie_saass')
          .eq('numero_serie_saass', associacao.numero_serie_saass)
          .single()
        
        const saassNumero = saassData?.numero_serie_saass || associacao.numero_serie_saass
        
        await registrarLogRetroativo({
          modulo: 'lancamentos',
          acao: 'associar',
          entidade: 'LancamentoSAASS',
          id_entidade: associacao.id_lancamento_saass, // Este é numérico
          descricao: `SAASS ${saassNumero} associado ao lançamento L${associacao.numero_lancamento} retroativamente`,
          detalhes: { 
            id_lancamento_saass: associacao.id_lancamento_saass,
            numero_lancamento: associacao.numero_lancamento,
            numero_serie_saass: associacao.numero_serie_saass,
            data_criacao: new Date().toISOString()
          }
        })
      }
      console.log(`  ${lancamentosSaass.length} associações processadas`)
    }

    // 8. Logs para Entregas
    console.log('Processando entregas...')
    const { data: entregas, error: errorEntregas } = await supabase
      .from('entregas_lancamentos')
      .select('*')
    
    if (!errorEntregas && entregas) {
      for (const entrega of entregas) {
        // Buscar informações da associação para melhor descrição
        const { data: lancamentoSaassData } = await supabase
          .from('lancamentos_saass')
          .select('numero_lancamento, numero_serie_saass')
          .eq('id_lancamento_saass', entrega.id_lancamento_saass)
          .single()
        
        const lancamentoNum = lancamentoSaassData?.numero_lancamento || 'N/A'
        const saassNum = lancamentoSaassData?.numero_serie_saass || 'N/A'
        
        await registrarLogRetroativo({
          modulo: 'entregas',
          acao: 'entrega',
          entidade: 'Entrega',
          id_entidade: entrega.id_entrega_lancamento, // Este é numérico
          descricao: `Entrega de SAASS ${saassNum} para lançamento L${lancamentoNum} registrada retroativamente`,
          detalhes: { 
            id_entrega_lancamento: entrega.id_entrega_lancamento,
            id_lancamento_saass: entrega.id_lancamento_saass,
            data_hora_entrega: entrega.data_hora_entrega,
            responsavel: entrega.responsavel,
            numero_lancamento: lancamentoNum,
            numero_serie_saass: saassNum,
            data_criacao: new Date().toISOString()
          }
        })
      }
      console.log(`  ${entregas.length} entregas processadas`)
    }

    // 9. Logs para Retornos
    console.log('Processando retornos...')
    const { data: retornos, error: errorRetornos } = await supabase
      .from('retornos_lancamentos')
      .select('*')
    
    if (!errorRetornos && retornos) {
      for (const retorno of retornos) {
        // Buscar informações da associação para melhor descrição
        const { data: lancamentoSaassData } = await supabase
          .from('lancamentos_saass')
          .select('numero_lancamento, numero_serie_saass')
          .eq('id_lancamento_saass', retorno.id_lancamento_saass)
          .single()
        
        const lancamentoNum = lancamentoSaassData?.numero_lancamento || 'N/A'
        const saassNum = lancamentoSaassData?.numero_serie_saass || 'N/A'
        
        await registrarLogRetroativo({
          modulo: 'retornos',
          acao: 'retorno',
          entidade: 'Retorno',
          id_entidade: retorno.id_retorno_lancamento, // Este é numérico
          descricao: `Retorno de SAASS ${saassNum} do lançamento L${lancamentoNum} registrado retroativamente`,
          detalhes: { 
            id_retorno_lancamento: retorno.id_retorno_lancamento,
            id_lancamento_saass: retorno.id_lancamento_saass,
            data_hora_retorno: retorno.data_hora_retorno,
            responsavel: retorno.responsavel,
            numero_lancamento: lancamentoNum,
            numero_serie_saass: saassNum,
            data_criacao: new Date().toISOString()
          }
        })
      }
      console.log(`  ${retornos.length} retornos processados`)
    }

    console.log('\n✅ Geração de logs retroativos concluída com sucesso!')
    console.log('Os logs agora aparecerão no dashboard de atividades recentes.')

  } catch (error) {
    console.error('Erro durante a geração de logs retroativos:', error)
    process.exit(1)
  }
}

async function registrarLogRetroativo(logEntry) {
  try {
    // Usar data de criação do registro original se disponível, senão usar data atual
    const dataHora = logEntry.detalhes?.data_criacao || new Date().toISOString()
    
    const { error } = await supabase
      .from('sistema_logs')
      .insert([{
        modulo: logEntry.modulo,
        acao: logEntry.acao,
        entidade: logEntry.entidade,
        id_entidade: logEntry.id_entidade,
        descricao: logEntry.descricao,
        detalhes: logEntry.detalhes,
        data_hora: dataHora,
        usuario: 'sistema',
        ip_address: '127.0.0.1',
        user_agent: 'script-retroativo'
      }])

    if (error) {
      console.error(`  Erro ao registrar log para ${logEntry.entidade} ${logEntry.id_entidade}:`, error.message)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`  Erro ao registrar log para ${logEntry.entidade} ${logEntry.id_entidade}:`, error.message)
    return false
  }
}

// Executar o script
gerarLogsRetroativos()
