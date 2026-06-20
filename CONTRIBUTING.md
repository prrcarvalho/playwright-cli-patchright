# Contributing

This fork wraps Patchright's `patchright-core` CLI-client runtime and exposes it as `playwright-cli-patched`.

### Clone

```bash
git clone https://github.com/prrcarvalho/playwright-cli-patchright
cd playwright-cli-patchright
npm install
```

### Verify

```bash
node playwright-cli.js --help
npm ls patchright patchright-core --depth=0
```

### Run

```bash
node playwright-cli.js open example.com --headed
```

### Test

```bash
npm test
```

### Rolling Patchright

Use `.claude/skills/dev/roll.md` to roll `patchright` and `patchright-core`. Keep `playwright-cli.js` requiring `patchright-core/lib/tools/cli-client/program`.

## Contributor License Agreement

This fork retains upstream licensing notices. Contributions should preserve the Apache-2.0 license and existing attribution.

### Code of Conduct

Be respectful and keep changes focused on the Patchright-backed CLI wrapper.
