# How to sync Microsoft playwright-cli

This repository keeps Patchright runtime wiring but can still pull upstream CLI updates.

Most full maintenance now happens through `node playwright-cli.js upgrade`, which syncs upstream
first and then updates Patchright runtime packages in one pass.

## Steps

1. If you only want upstream merge (without Patchright runtime bump), use:

   ```bash
   node playwright-cli.js sync-upstream
   ```

   This command supports:
   - `--dry-run` show target + current state without merging.
   - `--remote=<name>` use a different remote name (default `upstream`).
   - `--branch=<name>` use a different branch (default `main`).
   - `--allow-dirty` merge even when the working tree is not clean.

2. If you prefer the one-shot maintenance workflow, run:

   ```bash
   node playwright-cli.js upgrade
   ```

   and add `--skip-upstream` if you only want Patchright package updates.

3. Ensure upstream remote exists (when running dedicated sync):

   ```bash
   git remote add upstream https://github.com/microsoft/playwright-cli.git
   ```

   If the remote already exists, verify with:

   ```bash
   git remote -v
   ```

4. After merge conflicts:

   If there are conflicts, resolve them, then run:

   ```bash
   node scripts/update.js
   npm test
   ```

## Why this matters

You get Microsoft `playwright-cli` changes (new commands, docs, and fixes) while retaining `playwright-cli-patched` behavior and Patchright-backed runtime.

## Guardrails

- The sync step validates critical fork wiring after merge:
  - `playwright-cli.js` still requires `patchright-core/lib/tools/cli-client/program`.
  - `package.json` keeps `playwright-cli-patched` metadata and `patchright-core` dependency.

## Rollback

If a merge needs to be undone:

   ```bash
   git merge --abort
   ```

   or:

   ```bash
   git revert <merge-commit>
   ```
