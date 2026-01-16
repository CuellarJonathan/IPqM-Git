const fs = require('fs');
const path = require('path');

// Função para processar todos os arquivos .tsx e .ts
function processAllFiles() {
  const sourceDirs = ['app', 'components'];
  const allFiles = [];
  
  sourceDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    function collectFiles(dirPath) {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          collectFiles(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          allFiles.push(fullPath);
        }
      });
    }
    
    collectFiles(dir);
  });
  
  console.log(`📁 Encontrados ${allFiles.length} arquivos para processar\n`);
  
  let totalFixed = 0;
  
  allFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Padrão 1: new Date().toLocaleDateString('pt-BR')
      const pattern1 = /new Date\(\)\.toLocaleDateString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern1)) {
        content = content.replace(pattern1, "formatDateBR(new Date().toISOString())");
        modified = true;
        console.log(`✅ ${filePath}: Substituído new Date().toLocaleDateString('pt-BR')`);
      }
      
      // Padrão 2: new Date(data).toLocaleDateString('pt-BR')
      const pattern2 = /new Date\(([^)]+)\)\.toLocaleDateString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern2)) {
        content = content.replace(pattern2, "formatDateBR($1)");
        modified = true;
        console.log(`✅ ${filePath}: Substituído new Date(...).toLocaleDateString('pt-BR')`);
      }
      
      // Padrão 3: variavel.toLocaleDateString('pt-BR')
      const pattern3 = /(\w+)\.toLocaleDateString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern3)) {
        content = content.replace(pattern3, "formatDateBR($1)");
        modified = true;
        console.log(`✅ ${filePath}: Substituído variavel.toLocaleDateString('pt-BR')`);
      }
      
      // Padrão 4: new Date().toLocaleString('pt-BR')
      const pattern4 = /new Date\(\)\.toLocaleString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern4)) {
        content = content.replace(pattern4, "formatDateTimeBR(new Date().toISOString())");
        modified = true;
        console.log(`✅ ${filePath}: Substituído new Date().toLocaleString('pt-BR')`);
      }
      
      // Padrão 5: new Date(data).toLocaleString('pt-BR')
      const pattern5 = /new Date\(([^)]+)\)\.toLocaleString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern5)) {
        content = content.replace(pattern5, "formatDateTimeBR($1)");
        modified = true;
        console.log(`✅ ${filePath}: Substituído new Date(...).toLocaleString('pt-BR')`);
      }
      
      // Padrão 6: variavel.toLocaleString('pt-BR')
      const pattern6 = /(\w+)\.toLocaleString\(['"]pt-BR['"]\)/g;
      if (content.match(pattern6)) {
        content = content.replace(pattern6, "formatDateTimeBR($1)");
        modified = true;
        console.log(`✅ ${filePath}: Substituído variavel.toLocaleString('pt-BR')`);
      }
      
      // Adicionar importação se necessário
      if (modified) {
        // Verificar quais funções são usadas
        const usesFormatDateBR = content.includes('formatDateBR(');
        const usesFormatDateTimeBR = content.includes('formatDateTimeBR(');
        const usesFormatTime = content.includes('formatTime(');
        
        const neededImports = [];
        if (usesFormatDateBR) neededImports.push('formatDateBR');
        if (usesFormatDateTimeBR) neededImports.push('formatDateTimeBR');
        if (usesFormatTime) neededImports.push('formatTime');
        
        // Verificar se já importa dateUtils
        const hasDateUtilsImport = content.includes("from '@/lib/dateUtils'") || 
                                   content.includes("from '../lib/dateUtils'") ||
                                   content.includes("from '../../lib/dateUtils'") ||
                                   content.includes("from '../../../lib/dateUtils'");
        
        if (neededImports.length > 0 && !hasDateUtilsImport) {
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
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        totalFixed++;
      }
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n📊 Resultado final: ${totalFixed} arquivos corrigidos`);
  console.log('\n🎉 Todas as substituições foram aplicadas!');
  console.log('\n💡 O servidor deve recarregar automaticamente.');
  console.log('   Verifique se os erros de hidratação foram resolvidos.');
}

// Executar
processAllFiles();
