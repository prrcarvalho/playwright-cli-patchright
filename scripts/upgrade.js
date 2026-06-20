const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

function runUpgrade(argv = [], options = {}) {
  const rootDir = options.rootDir || path.resolve(__dirname, '..');
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const dryRun = argv.includes('--dry-run');
  const patchrightVersion = latestNpmVersion('patchright');
  const patchrightCoreVersion = latestNpmVersion('patchright-core');

  console.log(`Latest patchright: ${patchrightVersion}`);
  console.log(`Latest patchright-core: ${patchrightCoreVersion}`);

  if (dryRun) {
    console.log('Dry run only; package files were not changed.');
    return;
  }

  run('npm', ['install', '--save-exact', `patchright-core@${patchrightCoreVersion}`], rootDir);
  run('npm', ['install', '--save-dev', '--save-exact', `patchright@${patchrightVersion}`], rootDir);
  run(process.execPath, [path.join(rootDir, 'scripts', 'update.js')], rootDir);

  console.log('\nPatchright packages upgraded. Current command surface:');
  printCommandSurface(rootDir);
  console.log('\nReview README.md and skills/playwright-cli-patched if command names changed.');
}

function latestNpmVersion(packageName) {
  const output = execFileSync('npm', ['view', packageName, 'version', '--json'], { encoding: 'utf-8' }).trim();
  return JSON.parse(output);
}

function run(command, args, cwd) {
  console.log(`Running: ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error)
    throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
}

function printCommandSurface(rootDir) {
  const help = require(path.join(rootDir, 'node_modules', 'patchright-core', 'lib', 'tools', 'cli-client', 'help.json'));
  console.log(Object.keys(help.commands).sort().join('\n'));
}

function printHelp() {
  console.log(`playwright-cli-patched upgrade

Upgrade this fork's Patchright runtime packages to npm latest.

Usage:
  playwright-cli-patched upgrade [--dry-run]
  playwright-cli-patched --upgrade [--dry-run]

Options:
  --dry-run    Print latest versions without changing package files
  --help       Print this help
`);
}

module.exports = { runUpgrade };
