#!/usr/bin/env node
const { getDefaultMode, isDeactivationCommand } = require('./noclank-config');
const { clearMode, setMode, writeHookOutput } = require('./noclank-runtime');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = (data.prompt || '').trim().toLowerCase();

    if (/^[/@$]noclank/.test(prompt)) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0].replace(/^[@$]/, '/');
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/noclank-audit' || cmd === '/noclank:noclank-audit') {
        mode = 'audit';
      } else if (cmd === '/noclank' || cmd === '/noclank:noclank') {
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'full') mode = 'full';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'off') mode = 'off';
        else mode = getDefaultMode();
      }

      if (mode && mode !== 'off') {
        setMode(mode);
        writeHookOutput(
          'UserPromptSubmit',
          mode,
          'NO-CLANK MODE CHANGED — level: ' + mode,
        );
      } else if (mode === 'off') {
        clearMode();
        writeHookOutput('UserPromptSubmit', 'off', 'NO-CLANK MODE OFF');
      }
    }

    if (isDeactivationCommand(prompt)) {
      clearMode();
      writeHookOutput('UserPromptSubmit', 'off', 'NO-CLANK MODE OFF');
    }
  } catch (e) {}
});
