const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const DEFAULT_UPSTREAM_REMOTE = 'upstream';
const DEFAULT_UPSTREAM_URL = 'https://github.com/microsoft/playwright-cli.git';
const DEFAULT_UPSTREAM_BRANCH = 'main';

function runSyncUpstream(argv = [], options = {}) {
  const rootDir = options.rootDir || path.resolve(__dirname, '..');
  if (hasArg(argv, '-h') || hasArg(argv, '--help')) {
    printHelp();
    return;
  }

  const remote = getArgValue(argv, '--remote=', DEFAULT_UPSTREAM_REMOTE);
  const branch = getArgValue(argv, '--branch=', DEFAULT_UPSTREAM_BRANCH);
  const remoteUrl = getArgValue(argv, '--remote-url=', options.remoteUrl);
  const dryRun = argv.includes('--dry-run');
  const allowDirty = argv.includes('--allow-dirty');

  ensureWorkingTreeClean(rootDir, allowDirty);
  ensureUpstreamRemote(rootDir, remote, remoteUrl);

  const remoteRef = `${remote}/${branch}`;
  runGit(rootDir, 'fetch', [remote]);
  ensureRefExists(rootDir, remoteRef);

  const currentBranch = getCurrentBranch(rootDir);
  const remoteHead = runGitCapture(rootDir, 'rev-parse', [remoteRef]);
  const currentHead = runGitCapture(rootDir, 'rev-parse', ['HEAD']);

  console.log(`Upstream target: ${remoteRef}@${remoteHead}`);
  console.log(`Current branch: ${currentBranch}`);

  if (dryRun) {
    console.log(`Dry run only; no merge was performed.`);
    console.log(`If executed, HEAD (${currentHead}) would be merged into ${currentBranch}.`);
    return;
  }

  if (currentBranch === '(detached)')
    throw new Error('Cannot sync upstream while on a detached HEAD. Check out a branch first.');

  if (currentHead === remoteHead) {
    console.log('Already synced with upstream. No merge needed.');
    return;
  }

  runGit(rootDir, 'merge', ['--no-edit', remoteRef]);

  const newHead = runGitCapture(rootDir, 'rev-parse', ['HEAD']);
  console.log(`Merged upstream ${remoteRef} -> ${newHead}`);

  validateForkWiring(rootDir);
  printPostMergeSteps();
}

function validateForkWiring(rootDir) {
  const cliPath = path.join(rootDir, 'playwright-cli.js');
  const cliSource = fs.readFileSync(cliPath, 'utf-8');
  const packagePath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

  const violations = [];
  if (!cliSource.includes('patchright-core/lib/tools/cli-client/program'))
    violations.push('playwright-cli.js must require `patchright-core/lib/tools/cli-client/program`');
  if (packageJson.name !== 'playwright-cli-patched')
    violations.push('package.json name must remain `playwright-cli-patched`');
  if (!packageJson.bin || packageJson.bin['playwright-cli-patched'] !== 'playwright-cli.js')
    violations.push('package.json must define `playwright-cli-patched` bin');
  const hasPatchrightCore =
    (packageJson.dependencies && packageJson.dependencies['patchright-core']) ||
    (packageJson.devDependencies && packageJson.devDependencies['patchright-core']);
  if (!hasPatchrightCore)
    violations.push('package.json must keep `patchright-core` dependency');

  if (violations.length) {
    throw new Error(`Post-merge validation failed for Patchright fork integrity:\n${violations.map(v => `- ${v}`).join('\n')}`);
  }
}

function ensureWorkingTreeClean(rootDir, allowDirty) {
  const status = runGitCapture(rootDir, 'status', ['--porcelain']);
  if (status && !allowDirty)
    throw new Error('Working tree has uncommitted changes. Commit, stash, or pass --allow-dirty before syncing upstream.');
}

function ensureUpstreamRemote(rootDir, remote, remoteUrl) {
  try {
    const existingUrl = runGitCapture(rootDir, 'remote', ['get-url', remote]);
    if (!existingUrl) {
      throw new Error(`Remote ${remote} exists but has no URL`);
    }
    return;
  } catch (error) {
    if (!remoteUrl)
      throw new Error(`Remote '${remote}' not found and --remote-url was not provided.\nAdd it with:\n  git remote add ${remote} ${DEFAULT_UPSTREAM_URL}\nThen re-run this command.`);

    runGit(rootDir, 'remote', ['add', remote, remoteUrl]);
    console.log(`Added remote '${remote}' -> ${remoteUrl}`);
    return;
  }
}

function ensureRefExists(rootDir, remoteRef) {
  const status = spawnSync('git', ['show-ref', '--verify', `refs/remotes/${remoteRef}`], { cwd: rootDir });
  if (status.error)
    throw status.error;
  if (status.status !== 0)
    throw new Error(`Could not find remote ref '${remoteRef}'. Did you fetch it?`);
}

function getCurrentBranch(rootDir) {
  return runGitCapture(rootDir, 'branch', ['--show-current']) || '(detached)';
}

function hasArg(argv, flag) {
  return argv.includes(flag);
}

function getArgValue(argv, prefix, defaultValue) {
  const match = argv.find(arg => arg.startsWith(prefix));
  if (!match)
    return defaultValue;
  return match.slice(prefix.length) || defaultValue;
}

function runGit(rootDir, command, args) {
  console.log(`Running: git ${command} ${args.join(' ')}`);
  const result = spawnSync('git', [command, ...args], { cwd: rootDir, stdio: 'inherit' });
  if (result.error)
    throw result.error;
  if (result.status !== 0)
    throw new Error(`git ${command} ${args.join(' ')} failed with exit code ${result.status}`);
}

function runGitCapture(rootDir, command, args) {
  return execFileSync('git', [command, ...args], { cwd: rootDir, encoding: 'utf-8' }).trim();
}

function printPostMergeSteps() {
  console.log('\nUpstream merge complete. Recommended follow-up:');
  console.log('  1) node scripts/update.js      # refresh bundled Patchright skill files');
  console.log('  2) npm test                    # run integration suite');
  console.log('  3) Review README and SKILL docs for command drift or changed text');
}

function printHelp() {
  console.log(`playwright-cli-patched sync-upstream

Merge changes from Microsoft playwright-cli upstream into this fork.

Usage:
  playwright-cli-patched sync-upstream [options]
  playwright-cli-patched --sync-upstream [options]

Options:
  --remote=<name>     Git remote name for upstream (default: upstream)
  --branch=<name>     Remote branch to merge (default: main)
  --remote-url=<url>  Add remote if missing, using this URL
  --dry-run           Show merge target and current state without merging
  --allow-dirty       Merge even if there are local uncommitted changes
  --help              Print this help

Examples:
  playwright-cli-patched sync-upstream
  playwright-cli-patched sync-upstream --remote=upstream --branch=main
  playwright-cli-patched sync-upstream --remote-url=${DEFAULT_UPSTREAM_URL}
  playwright-cli-patched sync-upstream --dry-run`);
}

module.exports = { runSyncUpstream, validateForkWiring };
