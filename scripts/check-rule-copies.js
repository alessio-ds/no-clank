#!/usr/bin/env node
// check-rule-copies.js — verify all agent rule files are in sync with SKILL.md
//
// Exits non-zero if any derived file drifts too far from the source.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills', 'noclank', 'SKILL.md');
const DERIVED = [
  'AGENTS.md',
  '.github/copilot-instructions.md',
  '.clinerules/noclank.md',
  '.cursor/rules/noclank.mdc',
  '.windsurf/rules/noclank.md',
  '.kiro/steering/noclank.md',
  '.openclaw/skills/noclank/SKILL.md',
];

const skill = fs.readFileSync(SKILL_PATH, 'utf8');

let errors = 0;
for (const rel of DERIVED) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${rel}`);
    errors++;
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  if (content.length < 100) {
    console.error(`TOO SHORT: ${rel} (${content.length} chars)`);
    errors++;
  }
}

if (errors) {
  console.error(`\n${errors} file(s) have issues.`);
  process.exit(1);
} else {
  console.log('All rule copies OK.');
}
