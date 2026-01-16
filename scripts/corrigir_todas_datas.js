const fs = require('fs');
const path = require('path');

// Lista de arquivos para corrigir (baseado na análise anterior)
const filesToFix = [
  'app/eletronicas/[numero_serie_eletronica]/page.tsx',
  'app/hidrofones/[numero_serie_hidrofone]/page.tsx',
  'app/lancamentos/[numero_lancamento]/page.tsx',
  'app/packs-baterias/[numero_serie_pack_baterias]/page.tsx',
  'app/saass/[numero_serie_saass]/page.tsx',
  'app/tubos/[numero_serie_tubo]/page.tsx',
  'app/layout.tsx'
];

// Padrões para substituição
const patterns = [
  {
    search: /\.toLocaleDateString\(['"]pt-BR['"]\)/g,
    replace: 'formatDateBR($1)',
    needsImport: 'formatDateBR'
  },
  {
    search: /\.toLocaleString\(['"]pt-BR['"]\)/g,
    replace: 'formatDateTimeBR($1)',
    needsImport: 'formatDateTimeBR'
  },
  {
    search: /\.toLocaleTimeString\(['"]pt-BR['"]\)/g,
    replace: 'formatTime($1)',
    needsImport: 'formatTime'
  },
  {
    search: /\.toLocaleDateString\(['"]pt-BR['"],\s*\{[^}]*\}\)/g,
    replace: 'formatDateBR($1)',
    needsImport: 'formatDateBR'
  },
  {
    search: /\.toLocaleString\(['"]pt-BR['"],\s*\{[^}]*\}\)/g,
    replace: 'formatDateTimeBR($1)',
    needsImport: 'formatDateTimeBR'
  }
];

function fixFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    const neededImports = new Set();
    
    // Aplicar substituições
    patterns.forEach(pattern => {
      const matches = content.match(pattern.search);
      if (matches) {
        // Substituição simples para os casos mais comuns
        if (pattern.search.toString().includes("'pt-BR'")) {
          // Encontrar a variável/data antes do .toLocale...
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('.toLocale')) {
              // Substituir na linha
              let newLine = lines[i];
              
              // Caso 1: .toLocaleDateString('pt-BR')
              newLine = newLine.replace(/\.toLocaleDateString\(['"]pt-BR['"]\)/g, (match) => {
                // Encontrar o que vem antes do ponto
                const beforeDot = newLine.substring(0, newLine.indexOf('.toLocaleDateString'));
                const lastParen = beforeDot.lastIndexOf('(');
                const lastSpace = beforeDot.lastIndexOf(' ');
                const start = Math.max(lastParen + 1, lastSpace + 1);
                const variable = beforeDot.substring(start).trim();
                
                neededImports.add('formatDateBR');
                return `formatDateBR(${variable})`;
              });
              
              // Caso 2: .toLocaleString('pt-BR')
              newLine = newLine.replace(/\.toLocaleString\(['"]pt-BR['"]\)/g, (match) => {
                const beforeDot = newLine.substring(0, newLine.indexOf('.toLocaleString'));
                const lastParen = beforeDot.lastIndexOf('(');
                const lastSpace = beforeDot.lastIndexOf(' ');
                const start = Math.max(lastParen + 1, lastSpace + 1);
                const variable = beforeDot.substring(start).trim();
                
                neededImports.add('formatDateTimeBR');
                return `formatDateTimeBR(${variable})`;
              });
              
              if (newLine !== lines[i]) {
                lines[i] = newLine;
                modified = true;
              }
            }
          }
          content = lines.join('\n');
        }
      }
    });
    
    // Adicionar importação se necessário
    if (neededImports.size > 0) {
      const importStatement = `import { ${Array.from(neededImports).join(', ')} } from '@/lib/dateUtils';\n`;
      
      // Verificar se já importa dateUtils
      const hasDateUtilsImport = content.includes("from '@/lib/dateUtils'");
      
      if (!hasDateUtilsImport) {
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
        modified = true;
      }
    }
    
    // Remover funções locais de formatação se existirem
    const localFunctionPatterns = [
      /const formatDate = \(dateString: string\) => \{[\s\S]*?toLocaleDateString\(['"]pt-BR['"]\)[\s\S]*?\}/g,
      /const formatDateTime = \(dateString: string\) => \{[\s\S]*?toLocaleString\(['"]pt-BR['"]\)[\s\S]*?\}/g,
      /function formatDate\(dateString: string\) \{[\s\S]*?toLocaleDateString\(['"]pt-BR['"]\)[\s\S]*?\}/g,
      /function formatDateTime\(dateString: string\) \{[\s\S]*?toLocaleString\(['"]pt-BR['"]\)[\s\S]*?\}/g
    ];
    
    localFunctionPatterns.forEach(pattern => {
      if (content.match(pattern)) {
        content = content.replace(pattern, '');
        modified = true;
        console.log(`   ✅ Removida função local de formatação`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath}: Corrigido (importações: ${Array.from(neededImports).join(', ')})`);
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
  console.log('🔄 Corrigindo formatação de datas em todos os arquivos...\n');
  
  let fixed = 0;
  let total = filesToFix.length;
  
  filesToFix.forEach(file => {
    if (fixFile(file)) {
      fixed++;
    }
  });
  
  console.log(`\n📊 Resultado: ${fixed}/${total} arquivos corrigidos`);
  
  if (fixed > 0) {
    console.log('\n💡 O servidor deve recarregar automaticamente.');
    console.log('   Verifique se os erros de hidratação foram resolvidos.');
  }
}

main();
