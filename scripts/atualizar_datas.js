const fs = require('fs');
const path = require('path');

// Padrões para buscar e substituir
const patterns = [
  {
    search: /new Date\(([^)]+)\)\.toLocaleDateString\(['"]pt-BR['"]\)/g,
    replace: 'formatDateBR($1)'
  },
  {
    search: /new Date\(([^)]+)\)\.toLocaleString\(['"]pt-BR['"]\)/g,
    replace: 'formatDateTimeBR($1)'
  },
  {
    search: /new Date\(([^)]+)\)\.toLocaleTimeString\(['"]pt-BR['"]\)/g,
    replace: 'formatTime($1)'
  },
  {
    search: /new Date\(([^)]+)\)\.toLocaleDateString\(['"]pt-BR['"]\s*,\s*\{[^}]*\}\)/g,
    replace: 'formatDateShort($1)'
  },
  {
    search: /const\s+formatDate\s*=\s*\([^)]*\)\s*=>\s*{[^}]*}/g,
    replace: ''
  },
  {
    search: /const\s+formatDateTime\s*=\s*\([^)]*\)\s*=>\s*{[^}]*}/g,
    replace: ''
  }
];

// Arquivos para processar (lista dos mais críticos)
const criticalFiles = [
  'app/eletronicas/page.tsx',
  'app/eletronicas/novo/page.tsx',
  'app/eletronicas/[numero_serie_eletronica]/page.tsx',
  'app/entregas/page.tsx',
  'app/entregas/novo/page.tsx',
  'app/entregas/[id_entrega_lancamento]/page.tsx',
  'app/hidrofones/page.tsx',
  'app/hidrofones/novo/page.tsx',
  'app/hidrofones/[numero_serie_hidrofone]/page.tsx',
  'app/lancamentos/page.tsx',
  'app/lancamentos/[numero_lancamento]/page.tsx',
  'app/lancamentos-saass/[id_lancamento_saass]/page.tsx',
  'app/packs-baterias/page.tsx',
  'app/packs-baterias/novo/page.tsx',
  'app/packs-baterias/[numero_serie_pack_baterias]/page.tsx',
  'app/retornos/page.tsx',
  'app/retornos/novo/page.tsx',
  'app/retornos/[id_retorno_lancamento]/page.tsx',
  'app/saass/page.tsx',
  'app/saass/novo/page.tsx',
  'app/saass/[numero_serie_saass]/page.tsx',
  'app/tubos/page.tsx',
  'app/tubos/novo/page.tsx',
  'app/tubos/[numero_serie_tubo]/page.tsx'
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Verificar se já importa dateUtils
    const hasDateUtilsImport = content.includes("from '@/lib/dateUtils'") || 
                               content.includes("from '../lib/dateUtils'") ||
                               content.includes("from '../../lib/dateUtils'");
    
    // Adicionar import se necessário
    if (!hasDateUtilsImport && content.includes('formatDateBR') || 
        content.includes('formatDateTimeBR') || 
        content.includes('formatTime') ||
        content.includes('formatDateShort')) {
      
      // Encontrar a última importação
      const importRegex = /import\s+.*\s+from\s+['"][^'"]+['"]/g;
      const imports = content.match(importRegex) || [];
      
      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const importIndex = content.lastIndexOf(lastImport) + lastImport.length;
        
        // Adicionar import após a última importação
        content = content.slice(0, importIndex) + 
                 "\nimport { formatDateBR, formatDateTimeBR, formatTime, formatDateShort } from '@/lib/dateUtils';" +
                 content.slice(importIndex);
      }
    }
    
    // Aplicar substituições
    let changes = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern.search);
      if (matches) {
        changes += matches.length;
        content = content.replace(pattern.search, pattern.replace);
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath}: ${changes} substituições`);
      return true;
    } else {
      console.log(`➖ ${filePath}: Nenhuma alteração necessária`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Atualizando formatação de datas nos componentes...\n');
  
  let updated = 0;
  let total = criticalFiles.length;
  
  criticalFiles.forEach(file => {
    if (updateFile(file)) {
      updated++;
    }
  });
  
  console.log(`\n📊 Resultado: ${updated}/${total} arquivos atualizados`);
  
  if (updated > 0) {
    console.log('\n💡 Recomendações:');
    console.log('1. Execute o servidor de desenvolvimento: npm run dev');
    console.log('2. Verifique se não há erros no console');
    console.log('3. Teste as páginas atualizadas');
    console.log('4. Para outros arquivos, execute este script novamente com a lista completa');
  }
}

main();
