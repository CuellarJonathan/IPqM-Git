const fs = require('fs');
const path = require('path');

// Lista de arquivos para analisar (todos os arquivos .tsx e .ts)
const sourceDirs = ['app', 'components'];
const filesToAnalyze = [];

// Coletar todos os arquivos .tsx e .ts
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
        filesToAnalyze.push(fullPath);
      }
    });
  }
  
  collectFiles(dir);
});

console.log(`🔍 Analisando ${filesToAnalyze.length} arquivos...\n`);

// Padrões que causam hydration errors
const hydrationPatterns = [
  // 1. Uso de Date.now(), Math.random(), etc.
  { 
    pattern: /Date\.now\(\)/g, 
    fix: '// Substituir por timestamp do servidor se necessário',
    description: 'Date.now() muda a cada chamada'
  },
  { 
    pattern: /Math\.random\(\)/g, 
    fix: '// Usar valor estático ou gerar no cliente apenas',
    description: 'Math.random() muda a cada chamada'
  },
  
  // 2. Formatação de datas com toLocaleString/toLocaleDateString sem Intl
  { 
    pattern: /\.toLocaleDateString\([^)]*\)/g, 
    fix: 'formatDateBR()',
    description: 'toLocaleDateString pode variar entre servidor/cliente'
  },
  { 
    pattern: /\.toLocaleString\([^)]*\)/g, 
    fix: 'formatDateTimeBR()',
    description: 'toLocaleString pode variar entre servidor/cliente'
  },
  { 
    pattern: /\.toLocaleTimeString\([^)]*\)/g, 
    fix: 'formatTime()',
    description: 'toLocaleTimeString pode variar entre servidor/cliente'
  },
  
  // 3. new Date() sem tratamento
  { 
    pattern: /new Date\(\)\./g, 
    fix: '// Evitar new Date() em renderização, usar useEffect',
    description: 'new Date() pode criar datas diferentes'
  },
  
  // 4. Verificação typeof window !== 'undefined' em renderização
  { 
    pattern: /if\s*\(\s*typeof\s*window\s*!==\s*['"]undefined['"]\s*\)/g, 
    fix: '// Mover para useEffect ou usar componente ClientOnly',
    description: 'Branch server/client em renderização'
  },
  { 
    pattern: /if\s*\(\s*typeof\s*window\s*===\s*['"]undefined['"]\s*\)/g, 
    fix: '// Mover para useEffect ou usar componente ClientOnly',
    description: 'Branch server/client em renderização'
  },
  
  // 5. Uso de window, document, localStorage em renderização
  { 
    pattern: /window\./g, 
    context: 'render',
    fix: '// Mover para useEffect ou useState com verificação',
    description: 'Acesso a window durante renderização'
  },
  { 
    pattern: /document\./g, 
    context: 'render',
    fix: '// Mover para useEffect ou useRef',
    description: 'Acesso a document durante renderização'
  },
  { 
    pattern: /localStorage\./g, 
    context: 'render',
    fix: '// Mover para useEffect',
    description: 'Acesso a localStorage durante renderização'
  }
];

// Funções seguras de dateUtils que devem ser importadas
const safeDateFunctions = [
  'formatDateBR',
  'formatDateTimeBR',
  'formatDateShort',
  'formatTime',
  'formatRelativeTime',
  'toDateTimeLocal',
  'fromDateTimeLocal',
  'daysBetween',
  'isValidDate',
  'getCurrentYear'
];

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let issues = [];
    let needsDateUtilsImport = false;
    
    // Verificar se já importa dateUtils
    const hasDateUtilsImport = content.includes("from '@/lib/dateUtils'") || 
                               content.includes("from '../lib/dateUtils'") ||
                               content.includes("from '../../lib/dateUtils'") ||
                               content.includes("from '../../../lib/dateUtils'");
    
    // Verificar cada padrão
    hydrationPatterns.forEach((patternObj, index) => {
      const matches = content.match(patternObj.pattern);
      if (matches) {
        matches.forEach(match => {
          // Encontrar a linha onde ocorre
          const lineIndex = lines.findIndex(line => line.includes(match));
          if (lineIndex !== -1) {
            issues.push({
              line: lineIndex + 1,
              pattern: patternObj.description,
              match: match,
              fix: patternObj.fix
            });
            
            // Se for padrão de formatação de data, marcar para importar dateUtils
            if (patternObj.fix.includes('formatDate') || patternObj.fix.includes('formatTime')) {
              needsDateUtilsImport = true;
            }
          }
        });
      }
    });
    
    // Verificar se usa funções de dateUtils sem importar
    safeDateFunctions.forEach(func => {
      if (content.includes(`${func}(`) && !hasDateUtilsImport) {
        needsDateUtilsImport = true;
        // Encontrar a linha
        const lineIndex = lines.findIndex(line => line.includes(`${func}(`));
        if (lineIndex !== -1) {
          issues.push({
            line: lineIndex + 1,
            pattern: `Uso de ${func} sem importação`,
            match: `${func}(`,
            fix: `Importar { ${func} } from '@/lib/dateUtils'`
          });
        }
      }
    });
    
    if (issues.length > 0 || needsDateUtilsImport) {
      console.log(`📄 ${filePath}`);
      
      if (issues.length > 0) {
        issues.forEach(issue => {
          console.log(`   ⚠️  Linha ${issue.line}: ${issue.pattern}`);
          console.log(`      Código: ${issue.match.substring(0, 50)}...`);
          console.log(`      Sugestão: ${issue.fix}`);
        });
      }
      
      if (needsDateUtilsImport && !hasDateUtilsImport) {
        console.log(`   📦 Precisa importar dateUtils`);
      }
      
      console.log('');
      return { filePath, issues, needsDateUtilsImport, hasDateUtilsImport };
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Erro ao analisar ${filePath}:`, error.message);
    return null;
  }
}

function fixFile(filePath, analysis) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Adicionar importação de dateUtils se necessário
    if (analysis.needsDateUtilsImport && !analysis.hasDateUtilsImport) {
      // Verificar quais funções são usadas
      const usedFunctions = safeDateFunctions.filter(func => content.includes(`${func}(`));
      
      if (usedFunctions.length > 0) {
        const importStatement = `import { ${usedFunctions.join(', ')} } from '@/lib/dateUtils';\n`;
        
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
        console.log(`   ✅ Adicionada importação: ${usedFunctions.join(', ')}`);
      }
    }
    
    // Substituir padrões problemáticos
    analysis.issues.forEach(issue => {
      if (issue.fix.startsWith('formatDate') || issue.fix.startsWith('formatTime')) {
        // Substituir toLocaleString por funções seguras
        const oldPatterns = [
          /\.toLocaleDateString\([^)]*\)/g,
          /\.toLocaleString\([^)]*\)/g,
          /\.toLocaleTimeString\([^)]*\)/g
        ];
        
        oldPatterns.forEach(pattern => {
          if (content.match(pattern)) {
            // Substituição simples - na prática precisaria de análise mais complexa
            // Para este script, apenas registramos o problema
            console.log(`   ⚠️  Precisa substituir manualmente: ${issue.match}`);
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Arquivo modificado: ${filePath}`);
    }
    
    return modified;
    
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔍 Buscando problemas de hidratação em toda a aplicação...\n');
  
  const filesWithIssues = [];
  
  // Analisar todos os arquivos
  filesToAnalyze.forEach(file => {
    const analysis = analyzeFile(file);
    if (analysis) {
      filesWithIssues.push(analysis);
    }
  });
  
  console.log(`\n📊 Resultado da análise:`);
  console.log(`   Total de arquivos analisados: ${filesToAnalyze.length}`);
  console.log(`   Arquivos com problemas: ${filesWithIssues.length}`);
  
  if (filesWithIssues.length > 0) {
    console.log('\n🛠️  Aplicando correções automáticas...\n');
    
    let fixedCount = 0;
    filesWithIssues.forEach(analysis => {
      if (fixFile(analysis.filePath, analysis)) {
        fixedCount++;
      }
    });
    
    console.log(`\n✅ ${fixedCount}/${filesWithIssues.length} arquivos corrigidos`);
    console.log('\n💡 Algumas correções podem precisar de ajustes manuais:');
    console.log('   - Substituições de toLocaleString por funções dateUtils');
    console.log('   - Movimento de lógica para useEffect quando necessário');
    console.log('   - Uso de componentes ClientOnly para conteúdo específico do cliente');
  } else {
    console.log('\n🎉 Nenhum problema de hidratação encontrado!');
  }
  
  console.log('\n📋 Recomendações para evitar hydration errors:');
  console.log('   1. Use as funções de lib/dateUtils para formatação de datas');
  console.log('   2. Evite new Date(), Date.now(), Math.random() em renderização');
  console.log('   3. Use useEffect para lógica que depende de window/document');
  console.log('   4. Considere usar componentes ClientOnly para conteúdo específico');
  console.log('   5. Teste sempre com npm run build para verificar erros SSR');
}

main();
