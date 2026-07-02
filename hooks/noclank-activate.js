#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getDefaultMode, getClaudeDir, isShellSafe } = require('./noclank-config');
const { getNoclankInstructions } = require('./noclank-instructions');
const {
  clearMode,
  isCodex,
  isCopilot,
  setMode,
  writeHookOutput,
} = require('./noclank-runtime');

const claudeDir = getClaudeDir();
const mode = getDefaultMode();

if (mode === 'off') {
  clearMode();
  const hookOutput = (isCodex || isCopilot) ? '' : 'OK';
  writeHookOutput('SessionStart', 'off', hookOutput);
  process.exit(0);
}

try {
  setMode(mode);
} catch (e) {}

let output = getNoclankInstructions(mode);

try {
  writeHookOutput('SessionStart', mode, output);
} catch (e) {}
