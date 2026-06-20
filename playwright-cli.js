#!/usr/bin/env node
/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const { program } = require('patchright-core/lib/tools/cli-client/program');
const { runUpgrade } = require('./scripts/upgrade');
const packageJson = require('./package.json');

async function main() {
  const argv = process.argv.slice(2);
  if (isUpgradeCommand(argv)) {
    runUpgrade(argv.filter(arg => arg !== 'upgrade' && arg !== '--upgrade'));
    return;
  }
  await program({ embedderVersion: packageJson.version });
  installBundledSkillsIfRequested(argv);
}

function installBundledSkillsIfRequested(argv) {
  if (!isInstallCommand(argv))
    return;
  const skillsTarget = skillsOptionValue(argv);
  if (!skillsTarget)
    return;

  const target = skillsTarget === 'agents' ? 'agents' : 'claude';
  const source = path.join(__dirname, 'skills', 'playwright-cli-patched');
  if (!fs.existsSync(source))
    return;
  const destination = path.join(process.cwd(), `.${target}`, 'skills', 'playwright-cli-patched');
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`Patchright CLI skills installed to \`${path.relative(process.cwd(), destination)}\`.`);
}

function isInstallCommand(argv) {
  return argv.find(arg => !arg.startsWith('-')) === 'install';
}

function isUpgradeCommand(argv) {
  const command = argv.find(arg => !arg.startsWith('-'));
  return command === 'upgrade' || (!command && argv.includes('--upgrade'));
}

function skillsOptionValue(argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--skills')
      return 'claude';
    if (arg.startsWith('--skills='))
      return arg.slice('--skills='.length) || 'claude';
  }
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exit(1);
});
