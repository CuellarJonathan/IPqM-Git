const fs = require('fs');
const path = require('path');

// Lista de arquivos que foram alterados pelo script anterior
const filesToFix = [
  'app/eletronicas/page.tsx',
  'app/entregas/page.tsx',
  'app/hidrofones/page.tsx',
  'app/lancamentos/page.tsx',
  'app/lancamentos/[numero_lancamento]/page.tsx',
  'app/lancamentos-saass/[id_lancamento_saass]/page.tsx',
  'app/packs-baterias/page.tsx',
  'app/retornos/page.tsx',
  'app/saass/page.tsx',
  'app/tubos/page.tsx'
];

// Funções que podem ser usadas em cada arquivo
const dateFunctions = {
  'formatDateBR': 'formatDateBR',
  'formatDateTimeBR': 'formatDateTimeBR', 
  'formatTime': 'formatTime',
  'formatDateShort': 'formatDateShort',
  'formatRelativeTime': 'formatRelativeTime'
};

function getNeededImports(content) {
  const needed = [];
  
  Object.keys(dateFunctions).forEach(func => {
    if (content.includes(func + '(')) {
      needed.push(dateFunctions[func]);
    }
  });
  
  return needed;
}

function fixFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Verificar quais funções são usadas
    const neededImports = getNeededImports(content);
    
    if (neededImports.length === 0) {
      console.log(`➖ ${filePath}: Nenhuma função de data encontrada`);
      return false;
    }
    
    // Verificar se já importa dateUtils
    const hasDateUtilsImport = content.includes("from '@/lib/dateUtils'") || 
                               content.includes("from '../lib/dateUtils'") ||
                               content.includes("from '../../lib/dateUtils'") ||
                               content.includes("from '../../../lib/dateUtils'");
    
    // Remover importações antigas se existirem
    if (hasDateUtilsImport) {
      // Encontrar e remover a linha de importação antiga
      const importRegex = /import\s+{[^}]*}\s+from\s+['"]@\/lib\/dateUtils['"];?\n?/g;
      content = content.replace(importRegex, '');
    }
    
    // Adicionar nova importação
    const importStatement = `import { ${neededImports.join(', ')} } from '@/lib/dateUtils';\n`;
    
    // Encontrar a última importação
    const importLines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      // Inserir após a última importação
      importLines.splice(lastImportIndex + 1, 0, importStatement);
      content = importLines.join('\n');
    } else {
      // Se não encontrar importações, adicionar no início (após 'use client' se existir)
      if (content.startsWith("'use client'")) {
        const lines = content.split('\n');
        lines.splice(1, 0, importStatement);
        content = lines.join('\n');
      } else {
        content = importStatement + content;
      }
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}: Importação adicionada (${neededImports.join(', ')})`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Corrigindo importações de datas nos componentes...\n');
  
  let fixed = 0;
  let total = filesToFix.length;
  
  filesToFix.forEach(file => {
    if (fixFile(file)) {
      fixed++;
    }
  });
  
  console.log(`\n📊 Resultado: ${fixed}/${total} arquivos corrigidos`);
  
  if (fixed > 0) {
    console.log('\n💡 O servidor deve recarregar automaticamente com Fast Refresh.');
    console.log('   Verifique se os erros foram resolvidos.');
  }
}

main();
