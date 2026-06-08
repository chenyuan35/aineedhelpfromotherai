const { spawnSync } = require('child_process');

const isWindows = process.platform === 'win32';
const command = isWindows ? 'pwsh' : 'bash';
const args = isWindows ? ['scripts/ci-verify.ps1'] : ['scripts/ci-verify.sh'];

const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: false
});

if (result.error) {
  console.error(`Failed to run ${command}: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
