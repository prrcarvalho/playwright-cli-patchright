# Debugging under Patchright

The patched CLI is a drop-in replacement for Playwright, but Patchright deliberately disables or rewires several CDP domains to stay undetected. That changes what debugging primitives actually work. This page is the canonical reference for "the page is misbehaving, what do I use?" when the upstream Playwright answer ("just look at the console") no longer applies.

## What Patchright changes that matters for debugging

These are the patches that affect day-to-day debugging. Full list in the upstream Patchright README (Kaliiiiiiiiii-Vinyzu/patchright and patchright-nodejs).

- **`Console.enable` is disabled.** Patchright never enables the CDP Console domain, because doing so is a known stealth leak. Practical consequence: the `playwright-cli-patched console` and `playwright-cli-patched console warning` commands typically return nothing useful. Any documentation that promises console capture (tracing, video, spec-driven debug recipes) is degraded under Patchright.
- **`Runtime.enable` is avoided.** Patchright runs your JavaScript in isolated execution contexts instead of subscribing to `Runtime.enable`. `pageerror` / `Runtime.exceptionThrown` events should be treated as unreliable for the same reason. Your `eval` / `run-code` still works — it just executes in an isolated world by default.
- **Init scripts are injected via Playwright routes.** Patchright wraps `addInitScript`-style behaviour by intercepting HTML responses with `page.route`. If your own `route`/`unroute` mocks behave oddly, suspect Patchright's init-script routing first.
- **Chromium-only.** Firefox and WebKit are not patched. Use `--browser=chrome` (preferred, headed, persistent) or `--browser=chromium` / `--browser=msedge`.
- **Stealth-first defaults.** Do not add custom `userAgent`, custom browser headers, or extra stealth scripts unless explicitly required. Each addition is another fingerprint you have to defend.

## What still works reliably

These primitives do not depend on the Console or Runtime CDP domains, so they behave like upstream Playwright:

- `playwright-cli-patched snapshot` — DOM state, role tree, refs.
- `playwright-cli-patched screenshot` / `screenshot e<ref>` / `--filename=...` — pixel state.
- `playwright-cli-patched eval` / `run-code` — JavaScript executed in isolated context. Read DOM, JS globals, computed styles, anything observable from inside the page.
- `playwright-cli-patched requests` — request/response capture comes from the Network domain, not Console/Runtime. Safe.
- `playwright-cli-patched route` / `unroute` / `route-list` — request mocking. Safe, with the init-script caveat above.
- `playwright-cli-patched tracing-start` / `tracing-stop` — DOM snapshots, screenshots, network, action timing. Console column will be empty; everything else is intact.
- `playwright-cli-patched video-start` / `video-stop` — pixel-level recording. Independent of CDP debugging domains.
- `playwright-cli-patched pdf` — same.
- `playwright-cli-patched show` — visual Playwright dashboard. Useful for "watch what the script is doing".

The pattern: anything that reads the DOM, reads the network, or takes pixels is fine. Anything that subscribes to Chrome's debugger event stream for script-level messages is degraded.

## Patchright-recommended workaround: page-side JS logger

This is the workaround the upstream Patchright README points at: "If you really need the console, you might be better off using JavaScript loggers". The CLI version of that recipe:

### 1. Inject the logger before navigation

Patch `console.log/warn/error` from inside the page to write into a global ring buffer. Use `run-code` so the script runs in the page's isolated context and the override persists across the page's own scripts.

```bash
playwright-cli-patched run-code "async page => {
  await page.addInitScript(() => {
    const buf = (window.__pwLogs ||= []);
    const wrap = (level) => {
      const orig = console[level].bind(console);
      console[level] = (...args) => {
        try {
          buf.push({ t: Date.now(), level, args: args.map(String) });
          if (buf.length > 1000) buf.shift();
        } catch {}
        orig(...args);
      };
    };
    ['log', 'info', 'warn', 'error', 'debug'].forEach(wrap);
    window.addEventListener('error', (e) => buf.push({ t: Date.now(), level: 'error', args: [String(e.error || e.message)] }));
    window.addEventListener('unhandledrejection', (e) => buf.push({ t: Date.now(), level: 'error', args: ['unhandledrejection', String(e.reason)] }));
  });
}"
```

`addInitScript` re-runs on every navigation, including iframes, so the logger survives `goto` calls.

### 2. Drive the page normally

```bash
playwright-cli-patched goto https://app.example.com
playwright-cli-patched click e15
playwright-cli-patched fill e7 "test"
```

### 3. Read the buffer when you want to see what happened

```bash
playwright-cli-patched eval "JSON.stringify(window.__pwLogs || [], null, 2)"
```

Or filter to only errors:

```bash
playwright-cli-patched eval "JSON.stringify((window.__pwLogs || []).filter(e => e.level === 'error'), null, 2)"
```

Or clear it between scenarios:

```bash
playwright-cli-patched eval "window.__pwLogs = []"
```

This sidesteps `Console.enable` entirely. The page just sees a slightly-modified `console` object — which is indistinguishable from the many production sites that already wrap console for telemetry.

## Variant: stream logs to the host via exposeBinding

If you want each log line on stdout (not just on demand), bridge the page to the host with `page.exposeBinding`:

```bash
playwright-cli-patched run-code "async page => {
  await page.exposeBinding('__pwLog', (_src, entry) => {
    process.stdout.write('[page] ' + JSON.stringify(entry) + '\n');
  });
  await page.addInitScript(() => {
    const send = (level, args) => {
      try { window.__pwLog({ t: Date.now(), level, args: args.map(String) }); } catch {}
    };
    ['log', 'info', 'warn', 'error', 'debug'].forEach((level) => {
      const orig = console[level].bind(console);
      console[level] = (...args) => { send(level, args); orig(...args); };
    });
    window.addEventListener('error', (e) => send('error', [String(e.error || e.message)]));
    window.addEventListener('unhandledrejection', (e) => send('error', ['unhandledrejection', String(e.reason)]));
  });
}"
```

`exposeBinding` is itself implemented in a way that does not require `Console.enable`. Logs land in the CLI's stdout in real time, while the page only sees a normal-looking `console` object.

## DOM-state debugging without console

Most "what is the page actually doing right now" questions can be answered with a snapshot plus a targeted `eval`:

```bash
# Page structure and refs
playwright-cli-patched snapshot

# Cheap targeted reads
playwright-cli-patched eval "document.title"
playwright-cli-patched eval "location.href"
playwright-cli-patched eval "document.querySelectorAll('[data-testid]').length"

# Read state on a specific element
playwright-cli-patched eval "el => ({
  id: el.id,
  classes: [...el.classList],
  disabled: el.disabled,
  rect: el.getBoundingClientRect().toJSON(),
  text: el.textContent.trim().slice(0, 200),
})" e15

# Read framework state if exposed on window
playwright-cli-patched eval "JSON.stringify(window.__APP_STATE__ ?? null)"
```

Snapshots already include role tree and refs; eval fills in the attributes the snapshot can't show. See `element-attributes.md` for the full recipe.

## Network debugging

The Network CDP domain is not touched by Patchright, so this works unchanged:

```bash
playwright-cli-patched requests             # recent requests / responses
playwright-cli-patched route-list           # which mocks are currently active
```

If you want a permanent record, use tracing. The network log inside the trace is fully populated.

## Tracing under Patchright

`tracing-start` / `tracing-stop` still produce the trace file. The DOM snapshots, screenshots, action log, and network log are intact. The console column will be empty or near-empty. Combine tracing with the page-side JS logger above and you have parity with upstream Playwright debugging.

## When you really need a real DevTools console

There are exactly two situations where the workarounds above are not enough:

1. You need to inspect *third-party* page scripts' console output, where you cannot modify the page's `console` before they load.
2. You need a live debugger on a paused frame.

Options, ranked by how much they hurt stealth:

- **Manual headed Chrome DevTools.** Open the page in `--browser=chrome` headed, focus the tab, open DevTools manually. This re-enables `Console.enable` and `Runtime.enable` in that tab and undoes Patchright's main patches. Use it only when stealth is not currently being tested.
- **Temporary fallback to vanilla Playwright.** Reproduce the bug under upstream `@playwright/cli` or `playwright test` (not the patched CLI), capture full console / pageerror data, then re-run under `playwright-cli-patched` to verify the fix. This keeps Patchright's stealth surface clean — only the diagnosis step is unpatched.
- **CDP-Patches.** Linked from the Patchright README; targets input/CDP detection bypass rather than debugging visibility. Mention only if a downstream task specifically requires it.

Document which fallback was used in the test/PR so reviewers know the stealth surface was temporarily relaxed.

## Quick decision tree

- *"Element won't click."* — `snapshot`, then `eval` for its attributes. Check it isn't covered, off-screen, disabled, in a closed shadow root (Patchright handles those, but the locator still has to resolve).
- *"Form submit does nothing."* — `requests` to see if a request fired; if not, page-side JS logger to see if the handler threw; if yes, trace + network for the failing response.
- *"App crashes silently."* — page-side JS logger with the `unhandledrejection` + `error` listeners shown above.
- *"Need to see what a third-party script logs."* — manual DevTools or vanilla Playwright fallback, then revert.
- *"Selector worked yesterday, fails today."* — `snapshot`, diff against the older snapshot if you have one; `eval "el => el.outerHTML"` for the suspected ref.

## Cross-references

- `running-code.md` — how `run-code` and `eval` execute (isolated context by default).
- `request-mocking.md` — how Patchright's init scripts share routing plumbing with your own mocks.
- `tracing.md` — what tracing captures and what is missing under Patchright.
- `element-attributes.md` — reading attributes the snapshot can't show.
