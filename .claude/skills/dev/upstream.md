# How to sync Microsoft playwright-cli

This repository keeps Patchright runtime wiring but can still pull upstream CLI updates.

## Steps

1. Ensure upstream remote exists:

    git remote add upstream https://github.com/microsoft/playwright-cli.git

2. If the remote already exists, verify:

    git remote -v

3. Merge upstream `main` into your fork branch:

    node playwright-cli.js sync-upstream

Useful options:

- `--dry-run` show target + current state without merging.
- `--remote=<name>` use a different remote name (default `upstream`).
- `--branch=<name>` use a different branch (default `main`).
- `--allow-dirty` merge even when the working tree is not clean.

If there are conflicts, resolve them, then run:

    node scripts/update.js
    npm test

## Why this matters

You get Microsoft `playwright-cli` changes (new commands, docs, and fixes) while retaining `playwright-cli-patched` behavior and Patchright-backed runtime.

## Guardrails

- The sync step validates critical fork wiring after merge:
  - `playwright-cli.js` still requires `patchright-core/lib/tools/cli-client/program`.
  - `package.json` keeps `playwright-cli-patched` metadata and `patchright-core` dependency.

## Rollback

If a merge needs to be undone:

    git merge --abort

or:

    git revert <merge-commit>
