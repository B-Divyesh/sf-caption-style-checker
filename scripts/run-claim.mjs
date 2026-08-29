import { accessSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const claim = process.argv[2];
if (!claim?.startsWith('@claim:')) {
  console.error('Usage: npm run test:claim -- @claim:<id>');
  process.exit(2);
}

let ready = false;
try {
  accessSync('node_modules/.bin/playwright');
  const installed = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
  ready = installed.version === '1.58.2';
} catch {
  ready = false;
}

if (!ready) {
  console.log('Claim test dependencies are missing; installing the locked dependency tree first.');
  const install = spawnSync('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  if (install.status !== 0) process.exit(install.status ?? 1);
}

const test = spawnSync('npm', ['run', 'test:browser', '--', '--grep', claim], { stdio: 'inherit' });
process.exit(test.status ?? 1);
