const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('npx eslint src/ --ext .ts,.tsx --format json', { encoding: 'utf-8' });
  fs.writeFileSync('lint.json', out);
} catch (e) {
  // eslint exits with 1 if there are errors
  fs.writeFileSync('lint.json', e.stdout);
}
