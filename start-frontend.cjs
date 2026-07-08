#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const { resolve } = require('path');

const frontendDir = resolve(__dirname, 'frontend');

const child = spawn('npx', ['next', 'dev', '--port', '3000'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.error('Frontend error:', err);
  process.exit(1);
});
