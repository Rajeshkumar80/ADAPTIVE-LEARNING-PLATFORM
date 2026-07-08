const { execSync } = require('child_process');
process.chdir(__dirname);
execSync('npx next dev --port 3000', { stdio: 'inherit', shell: true });
