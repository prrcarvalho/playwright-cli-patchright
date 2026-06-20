const { execFileSync, spawnSync } = require('child_process');
const path = require('path');
const { runSyncUpstream, DEFAULT_UPSTREAM_URL } = require('./sync-upstream');

const DEFAULT_UPSTREAM_OPTIONS = {
  remoteUrl: DEFAULT_UPSTREAM_URL,
};

function runUpgrade(argv = [], options = {}) {
  const rootDir = options.rootDir || path.resolve(__dirname, '..');
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }

  const dryRun = argv.includes('--dry-run');
  const skipUpstream = argv.includes('--skip-upstream');

  if (!skipUpstream)
    runSyncUpstream(upstreamArgv(argv), { ...DEFAULT_UPSTREAM_OPTIONS, rootDir });

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

Run a full upgrade for the fork in one command.

By default this command:
  1) syncs upstream Microsoft Playwright CLI
  2) updates 'patchright' and 'patchright-core' to npm latest

Usage:
  playwright-cli-patched upgrade [options]
  playwright-cli-patched --upgrade [options]

Options:
  --dry-run         Print latest versions and upstream merge plan without changing package files
  --skip-upstream   Skip upstream sync and only upgrade Patchright packages
  --remote=<name>   Upstream remote name for upstream sync (default: upstream)
  --branch=<name>   Upstream branch to merge (default: main)
  --remote-url=<url>  Upstream remote URL if not already configured
  --allow-dirty     Allow upstream merge while working tree has local changes
  --help            Print this help
`);
}

function upstreamArgv(argv) {
  const result = [];
  for (const arg of argv) {
    if (arg === '--dry-run' || arg === '--allow-dirty' || arg.startsWith('--remote=') || arg.startsWith('--branch=') || arg.startsWith('--remote-url='))
      result.push(arg);
  }
  return result;
}

module.exports = { runUpgrade };
