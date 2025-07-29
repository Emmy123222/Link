#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns that commonly cause hydration issues
const problematicPatterns = [
  {
    pattern: /Math\.random\(\)/g,
    issue: 'Math.random() generates different values on server and client'
  },
  {
    pattern: /Date\.now\(\)/g,
    issue: 'Date.now() generates different values on server and client'
  },
  {
    pattern: /new Date\(\)/g,
    issue: 'new Date() without parameters generates different values on server and client'
  },
  {
    pattern: /localStorage\./g,
    issue: 'localStorage access without typeof window check'
  },
  {
    pattern: /sessionStorage\./g,
    issue: 'sessionStorage access without typeof window check'
  },
  {
    pattern: /window\./g,
    issue: 'window access without typeof window check'
  },
  {
    pattern: /document\./g,
    issue: 'document access without typeof window check'
  },
];

// Safe patterns that are properly guarded
const safePatterns = [
  /typeof window !== ['"]undefined['"] && localStorage\./g,
  /typeof window !== ['"]undefined['"] && sessionStorage\./g,
  /typeof window !== ['"]undefined['"] && window\./g,
  /typeof window !== ['"]undefined['"] && document\./g,
  /if \(typeof window !== ['"]undefined['"]\)/g,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  problematicPatterns.forEach(({ pattern, issue }) => {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      // Check if this usage is safely guarded
      const lines = content.split('\n');
      matches.forEach(match => {
        const lineIndex = content.substring(0, match.index).split('\n').length - 1;
        const line = lines[lineIndex];
        const contextLines = lines.slice(Math.max(0, lineIndex - 2), lineIndex + 3);
        const context = contextLines.join('\n');
        
        // Check if the usage is safely guarded
        const isSafe = safePatterns.some(safePattern => 
          context.match(safePattern) || line.includes('useEffect') || line.includes('typeof window')
        );

        if (!isSafe) {
          issues.push({
            line: lineIndex + 1,
            content: line.trim(),
            issue,
            context: contextLines
          });
        }
      });
    }
  });

  return issues;
}

function scanDirectory(dir) {
  const results = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results.push(...scanDirectory(fullPath));
    } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
      const issues = scanFile(fullPath);
      if (issues.length > 0) {
        results.push({
          file: fullPath,
          issues
        });
      }
    }
  });

  return results;
}

console.log('🔍 Scanning for potential hydration issues...\n');

const srcDir = path.join(process.cwd(), 'src');
const results = scanDirectory(srcDir);

if (results.length === 0) {
  console.log('✅ No potential hydration issues found!');
} else {
  console.log(`⚠️  Found ${results.length} files with potential issues:\n`);
  
  results.forEach(({ file, issues }) => {
    console.log(`📄 ${file}`);
    issues.forEach(({ line, content, issue }) => {
      console.log(`   Line ${line}: ${issue}`);
      console.log(`   Code: ${content}`);
    });
    console.log('');
  });

  console.log('💡 Tips to fix hydration issues:');
  console.log('   • Wrap client-side code in useEffect hooks');
  console.log('   • Use typeof window !== "undefined" checks');
  console.log('   • Use useIsClient() hook for conditional rendering');
  console.log('   • Replace Math.random() with deterministic ID generation');
  console.log('   • Use server/client consistent date formatting');
} 