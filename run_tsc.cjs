const { execSync } = require('child_process');
const fs = require('fs');

try {
  const tsc = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
  fs.writeFileSync('tsc_out2.txt', "SUCCESS\n" + tsc);
} catch (e) {
  fs.writeFileSync('tsc_out2.txt', "FAIL\n" + e.stdout + '\n' + e.stderr);
}
