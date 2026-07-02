// no-clank — Pi agent harness extension
// Injects the anti-clankerspeech ruleset as a persistent skill.

const path = require('path');
const { getNoclankInstructions } = require('../hooks/noclank-instructions');
const { getDefaultMode } = require('../hooks/noclank-config');

const mode = process.env.NOCLANK_DEFAULT_MODE || getDefaultMode();

const extension = {
  name: 'noclank',
  description: 'Kills AI-generated clankerspeech slop. No em dashes, no "delve", no contrastive parallelism.',
  version: require('../package.json').version,

  hooks: {
    'session:before': async ({ session }) => {
      if (mode !== 'off') {
        const instructions = getNoclankInstructions(mode);
        if (session && session.system) {
          session.system.push(instructions);
        }
      }
    },
  },

  skills: [
    path.join(__dirname, '..', 'skills', 'noclank', 'SKILL.md'),
  ],
};

module.exports = extension;
