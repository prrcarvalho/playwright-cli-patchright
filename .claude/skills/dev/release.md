# How to prepare a fork release

Use this for releases of `playwright-cli-patched`, not Microsoft's upstream `@playwright/cli`.

## Steps

1. **Start from a clean sync branch.** Pull the fork's `main`, then create a release branch.
   ```bash
   git fetch origin
   git checkout main
   git pull --ff-only origin main
   git checkout -b mark-v<version>
   ```

2. **Roll Patchright first.** Follow [roll.md](roll.md) so `patchright` and `patchright-core` are pinned to the intended version and bundled skills/docs match the command surface.

3. **Bump this wrapper version** in `package.json`, then run `npm install` to sync `package-lock.json`.

4. **Verify the runtime wiring.**
   ```bash
   node playwright-cli.js --version
   node -e "console.log(require.resolve('patchright-core/lib/tools/cli-client/program'))"
   npm ls patchright patchright-core --depth=0
   ```

5. **Test the CLI.**
   ```bash
   npm run test
   ```

6. **Write release notes** in `RELEASE_NOTES_v<version>.md`.
   Include:
   - wrapper version
   - `patchright` / `patchright-core` version
   - user-visible CLI command changes
   - Patchright-specific caveats, especially Chromium-only behavior and console limitations

7. **Commit and open a PR against the fork.**
   ```bash
   git add package.json package-lock.json README.md skills scripts .claude/skills/dev
   git commit -m "chore: mark v<version>"
   gh pr create --repo prrcarvalho/playwright-cli-patchright \
     --base main \
     --title "chore: mark v<version>" \
     --body "$(cat RELEASE_NOTES_v<version>.md)"
   ```

## Pitfalls

- Do not publish or document `@playwright/cli` from this fork; this package is `playwright-cli-patched`.
- Do not replace `patchright-core` with `playwright-core`; the CLI entrypoint must stay Patchright-backed.
- Do not assume all upstream Playwright CLI commands exist under the pinned Patchright version. Verify against `patchright-core/lib/tools/cli-client/help.json`.
- Do not claim full console capture. Patchright disables the Console CDP domain for stealth.
