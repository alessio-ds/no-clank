#!/usr/bin/env node
// uninstall.js — clean up no-clank state files
//
// Run BEFORE removing the plugin via your agent's plugin manager.
// Removes: the .noclank-active flag, ~/.config/noclank/config.json,
// and any statusline entry in ~/.claude/settings.json that points at
// no-clank's own script.

const fs = require('fs');
const path = require('path');
const os = require('os');

function getStatePaths() {
  const paths = [];

  const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  paths.push(path.join(claudeDir, '.noclank-active'));

  if (process.env.XDG_CONFIG_HOME) {
    paths.push(path.join(process.env.XDG_CONFIG_HOME, 'noclank', 'config.json'));
  } else if (process.platform === 'win32') {
    paths.push(path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'noclank', 'config.json'
    ));
  }
  paths.push(path.join(os.homedir(), '.config', 'noclank', 'config.json'));

  if (process.env.PLUGIN_DATA) {
    paths.push(path.join(process.env.PLUGIN_DATA, '.noclank-active'));
  }
  if (process.env.COPILOT_PLUGIN_DATA) {
    paths.push(path.join(process.env.COPILOT_PLUGIN_DATA, '.noclank-active'));
  }

  return paths;
}

const statePaths = getStatePaths();
let removed = 0;

for (const p of statePaths) {
  if (p && fs.existsSync(p)) {
    try {
      fs.unlinkSync(p);
      console.log(`Removed: ${p}`);
      removed++;
    } catch (e) {
      console.error(`Failed to remove ${p}: ${e.message}`);
    }
  }
}

if (removed === 0) {
  console.log('No state files found. Nothing to clean up.');
} else {
  console.log(`\nCleaned up ${removed} state file(s).`);
  console.log('You can now safely remove the plugin via your agent\'s plugin manager.');
}
