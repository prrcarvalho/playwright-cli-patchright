# How to roll Patchright

## Steps

1. **Run the combined upgrade command** (upstream + Patchright packages):
   ```bash
   node playwright-cli.js upgrade
   ```

   This command does both:
   - merges upstream `microsoft/playwright-cli` by default (or pass `--skip-upstream`)
   - updates `patchright` and `patchright-core` to npm latest

   If you only need runtime maintenance, run:
   ```bash
   node playwright-cli.js upgrade --skip-upstream
   ```

2. **If you need a manual roll instead, check latest Patchright version**:
   ```bash
   npm info patchright version
   ```

3. **Update Patchright packages** in `package.json`:
   - Update `patchright-core` (dependency) and `patchright` (devDependency) to the target version.
   - Run `npm install` to update `package-lock.json`.

4. **Run the update script** to sync the bundled patched skill into the generated skills location:
   ```bash
   node scripts/update.js
   ```
   This script:
   - Runs `node playwright-cli.js install --skills`.
   - Copies the generated skill from `.claude/skills/playwright-cli-patched/` into `skills/playwright-cli-patched/`.
   - Cleans up the generated `.claude/skills/playwright-cli-patched/` directory.

5. **Check the command surface** against the pinned Patchright runtime:
   ```bash
   node -e "const h=require('./node_modules/patchright-core/lib/tools/cli-client/help.json'); console.log(Object.keys(h.commands).sort().join('\n'))"
   ```

6. **Update README.md and skills** with relevant command changes. Compare the command list with `skills/playwright-cli-patched/SKILL.md` and `README.md`, then update sections that are out of date (commands, flags, default behaviours, examples, Patchright caveats).

7. **Verify** the CLI works:
   ```bash
   node playwright-cli.js --help
   ```

8. **Test** the CLI:
   ```bash
   npm run test
   ```

9. **Create a branch and commit**:
   - Branch name: `roll_<version>` (e.g. `roll_214`)
   - Commit message: `chore: roll Patchright to <version>`
   - do not add Co-Authored-By

## Key files

| File | Role |
|---|---|
| `package.json` | Patchright version pins (`patchright-core`, `patchright`) |
| `playwright-cli.js` | CLI entry point — requires Patchright's program module |
| `scripts/update.js` | Automation script for syncing the bundled patched skill after version bump |
| `skills/playwright-cli-patched/SKILL.md` | Skill definition installed from Patchright-backed CLI (source of truth for commands) |
| `README.md` | User-facing docs — must reflect current skill commands and behavior |
