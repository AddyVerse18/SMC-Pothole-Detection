const { execSync } = require('child_process');
const fs = require('fs');

console.log("Running eslint...");
try {
  const lint = execSync('npx eslint src/ --ext .ts,.tsx', { encoding: 'utf-8' });
  fs.writeFileSync('lint_out.txt', lint);
} catch (e) {
  fs.writeFileSync('lint_out.txt', e.stdout + '\n\n' + e.stderr);
}

console.log("Running tsc...");
try {
  const tsc = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
  fs.writeFileSync('tsc_out.txt', tsc);
} catch (e) {
  fs.writeFileSync('tsc_out.txt', e.stdout + '\n\n' + e.stderr);
}
console.log("Done");
