#!/usr/bin/env node
const { getNoclankInstructions } = require('./noclank-instructions');
const { readMode, writeHookOutput } = require('./noclank-runtime');

const mode = readMode();

if (!mode || mode === 'off') {
  process.exit(0);
}

try {
  writeHookOutput('SubagentStart', mode, getNoclankInstructions(mode));
} catch (e) {}
