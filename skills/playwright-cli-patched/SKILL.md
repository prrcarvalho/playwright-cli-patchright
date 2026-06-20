---
name: playwright-cli-patched
description: Automate browser interactions, test web pages, and work with Patchright-backed Playwright-compatible tests through a locally installed patched playwright-cli-patched. Use this skill whenever the user wants to automate a browser, run or generate Playwright-style tests, take DOM snapshots, attach to debug sessions, or run anything related to "playwright-cli-patched", "patched playwright", or "patchright" in the current workspace. The skill first checks whether the project-local patched CLI is installed under `./node_modules/.bin/playwright-cli-patched` and, if it is missing, installs it from the local `file:` fork before running any commands.
allowed-tools: Bash(./node_modules/.bin/playwright-cli-patched:*) Bash(playwright-cli-patched:*) Bash(npx:*) Bash(npm:*) Bash(test:*) Bash(grep:*)
---

# Browser Automation with playwright-cli-patched

## Quick start

```bash
# open new browser
playwright-cli-patched open
# navigate to a page
playwright-cli-patched goto https://playwright.dev
# interact with the page using refs from the snapshot
playwright-cli-patched click e15
playwright-cli-patched type "page.click"
playwright-cli-patched press Enter
# take a screenshot (rarely used, as snapshot is more common)
playwright-cli-patched screenshot
# close the browser
playwright-cli-patched close
```

## Commands

### Core

```bash
playwright-cli-patched open
# open and navigate right away
playwright-cli-patched open https://example.com/
playwright-cli-patched goto https://playwright.dev
playwright-cli-patched type "search query"
playwright-cli-patched click e3
playwright-cli-patched dblclick e7
# --submit presses Enter after filling the element
playwright-cli-patched fill e5 "user@example.com"  --submit
playwright-cli-patched drag e2 e8
playwright-cli-patched hover e4
playwright-cli-patched select e9 "option-value"
playwright-cli-patched upload ./document.pdf
playwright-cli-patched check e12
playwright-cli-patched uncheck e12
playwright-cli-patched snapshot
playwright-cli-patched eval "document.title"
playwright-cli-patched eval "el => el.textContent" e5
# get element id, class, or any attribute not visible in the snapshot
playwright-cli-patched eval "el => el.id" e5
playwright-cli-patched eval "el => el.getAttribute('data-testid')" e5
playwright-cli-patched dialog-accept
playwright-cli-patched dialog-accept "confirmation text"
playwright-cli-patched dialog-dismiss
playwright-cli-patched resize 1920 1080
playwright-cli-patched close
```

### Navigation

```bash
playwright-cli-patched go-back
playwright-cli-patched go-forward
playwright-cli-patched reload
```

### Keyboard

```bash
playwright-cli-patched press Enter
playwright-cli-patched press ArrowDown
playwright-cli-patched keydown Shift
playwright-cli-patched keyup Shift
```

### Mouse

```bash
playwright-cli-patched mousemove 150 300
playwright-cli-patched mousedown
playwright-cli-patched mousedown right
playwright-cli-patched mouseup
playwright-cli-patched mouseup right
playwright-cli-patched mousewheel 0 100
```

### Save as

```bash
playwright-cli-patched screenshot
playwright-cli-patched screenshot e5
playwright-cli-patched screenshot --filename=page.png
playwright-cli-patched pdf --filename=page.pdf
```

### Tabs

```bash
playwright-cli-patched tab-list
playwright-cli-patched tab-new
playwright-cli-patched tab-new https://example.com/page
playwright-cli-patched tab-close
playwright-cli-patched tab-close 2
playwright-cli-patched tab-select 0
```

### Storage

```bash
playwright-cli-patched state-save
playwright-cli-patched state-save auth.json
playwright-cli-patched state-load auth.json

# Cookies
playwright-cli-patched cookie-list
playwright-cli-patched cookie-list --domain=example.com
playwright-cli-patched cookie-get session_id
playwright-cli-patched cookie-set session_id abc123
playwright-cli-patched cookie-set session_id abc123 --domain=example.com --httpOnly --secure
playwright-cli-patched cookie-delete session_id
playwright-cli-patched cookie-clear

# LocalStorage
playwright-cli-patched localstorage-list
playwright-cli-patched localstorage-get theme
playwright-cli-patched localstorage-set theme dark
playwright-cli-patched localstorage-delete theme
playwright-cli-patched localstorage-clear

# SessionStorage
playwright-cli-patched sessionstorage-list
playwright-cli-patched sessionstorage-get step
playwright-cli-patched sessionstorage-set step 3
playwright-cli-patched sessionstorage-delete step
playwright-cli-patched sessionstorage-clear
```

### Network

```bash
playwright-cli-patched route "**/*.jpg" --status=404
playwright-cli-patched route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli-patched route-list
playwright-cli-patched unroute "**/*.jpg"
playwright-cli-patched unroute
```

### DevTools

```bash
# Note: `console` / `console warning` are typically empty under Patchright
# because the Console CDP domain is disabled for stealth. Use the page-side
# JS logger pattern in references/debugging-patchright.md instead.
playwright-cli-patched console
playwright-cli-patched console warning
playwright-cli-patched requests
playwright-cli-patched request 5
playwright-cli-patched run-code "async page => await page.context().grantPermissions(['geolocation'])"
playwright-cli-patched run-code --filename=script.js
playwright-cli-patched tracing-start
playwright-cli-patched tracing-stop
playwright-cli-patched video-start video.webm
playwright-cli-patched video-chapter "Chapter Title" --description="Details" --duration=2000
playwright-cli-patched video-stop
playwright-cli-patched video-show-actions --duration=600 --position=top-right
playwright-cli-patched video-hide-actions
playwright-cli-patched show
playwright-cli-patched show --annotate
playwright-cli-patched generate-locator e5 --raw
playwright-cli-patched highlight e5
playwright-cli-patched highlight e5 --style="outline: 3px dashed red"
playwright-cli-patched highlight e5 --hide
playwright-cli-patched highlight --hide
```

## Open parameters
```bash
# Use a Chromium-based browser when creating session
playwright-cli-patched open --browser=chrome
playwright-cli-patched open --browser=chromium
playwright-cli-patched open --browser=msedge

# Use persistent profile (by default profile is in-memory)
playwright-cli-patched open --persistent
# Use persistent profile with custom directory
playwright-cli-patched open --profile=/path/to/profile

# Connect to a running browser endpoint
playwright-cli-patched attach ws://127.0.0.1:9222/devtools/browser/<id>

# Start with config file
playwright-cli-patched open --config=my-config.json

# Close the browser
playwright-cli-patched close
# Delete user data for the default session
playwright-cli-patched delete-data
```

## Snapshots

After each command, playwright-cli-patched provides a snapshot of the current browser state.

```bash
> playwright-cli-patched goto https://example.com
### Page
- Page URL: https://example.com/
- Page Title: Example Domain
### Snapshot
[Snapshot](.playwright-cli/page-2026-02-14T19-22-42-679Z.yml)
```

You can also take a snapshot on demand using `playwright-cli-patched snapshot` command. All the options below can be combined as needed.

```bash
# default - save to a file with timestamp-based name
playwright-cli-patched snapshot

# save to file, use when snapshot is a part of the workflow result
playwright-cli-patched snapshot --filename=after-click.yaml

# snapshot an element instead of the whole page
playwright-cli-patched snapshot "#main"

# limit snapshot depth for efficiency, take a partial snapshot afterwards
playwright-cli-patched snapshot --depth=4
playwright-cli-patched snapshot e34

```

## Targeting elements

By default, use refs from the snapshot to interact with page elements.

```bash
# get snapshot with refs
playwright-cli-patched snapshot

# interact using a ref
playwright-cli-patched click e15
```

You can also use css selectors or Playwright locators.

```bash
# css selector
playwright-cli-patched click "#main > button.submit"

# role locator
playwright-cli-patched click "getByRole('button', { name: 'Submit' })"

# test id
playwright-cli-patched click "getByTestId('submit-button')"
```

## Browser Sessions

```bash
# create new browser session named "mysession" with persistent profile
playwright-cli-patched -s=mysession open example.com --persistent
# same with manually specified profile directory (use when requested explicitly)
playwright-cli-patched -s=mysession open example.com --profile=/path/to/profile
playwright-cli-patched -s=mysession click e6
playwright-cli-patched -s=mysession close  # stop a named browser
playwright-cli-patched -s=mysession delete-data  # delete user data for persistent session

playwright-cli-patched list
# Close all browsers
playwright-cli-patched close-all
# Forcefully kill all browser processes
playwright-cli-patched kill-all
```

## Patchright operating notes

The CLI is a drop-in Playwright replacement, but Patchright disables or rewires several Chrome DevTools Protocol (CDP) domains to stay undetected. That changes a few things in practice. Full debugging recipes live in [references/debugging-patchright.md](references/debugging-patchright.md); the highlights you should remember even without opening that file:

- **Chromium-only.** Patchright only patches Chromium-based browsers. Use `--browser=chrome` (preferred, headed, persistent) or `--browser=chromium` / `--browser=msedge`. Firefox and WebKit are not Patchright-backed even though the CLI lists them as options.
- **Best-practice profile for stealth-sensitive sessions:**
  ```bash
  playwright-cli-patched open --browser=chrome --persistent
  ```
  Do not inject a custom `userAgent`, custom browser headers, or extra stealth scripts unless explicitly required — each addition is another fingerprint you have to defend.
- **`console` and `console warning` are typically empty.** Patchright disables the CDP Console domain (`Console.enable`) because subscribing to it is a known stealth leak. `pageerror` / `Runtime.exceptionThrown` events should be treated as unreliable for the same reason. Use the page-side JS logger pattern in [references/debugging-patchright.md](references/debugging-patchright.md) when you need console-like visibility.
- **`eval` / `run-code` run in an isolated execution context by default.** This is how Patchright avoids `Runtime.enable`. Vanilla `document.title`, DOM reads, `page.evaluate(...)` etc. all work; if a script that worked under upstream Playwright behaves unexpectedly under Patchright, isolated-vs-main context is the first thing to check.
- **Init scripts ride on top of Playwright routes.** Patchright injects `addInitScript`-style behaviour by intercepting HTML responses through `page.route`. If your custom `route` / `unroute` mocks behave oddly, suspect interaction with Patchright's init-script routing first. See [references/request-mocking.md](references/request-mocking.md).
- **Tracing and video still work**, minus the console column. DOM snapshots, screenshots, action log, and network log are all intact.

## Installation

This skill uses a **locally patched fork of Microsoft's `@playwright/cli`, renamed to `playwright-cli-patched` and rewired to use Patchright instead of upstream `playwright-core`**. The fork lives at:

```text
/Users/pedrocarvalho/projects/browser-automation/playwright-cli-patchright
```

It is installed **per project** as a local dev dependency. There is no global install. The binary name `playwright-cli-patched` is unique to this fork; upstream Microsoft ships only `playwright-cli`, so a name collision is structurally impossible.

### 1. Detect whether `playwright-cli-patched` is installed in the current project

Always check first. Do not run `npm install` unless the project-local patched CLI is missing or fails the patched-marker check.

Run from the project root:

```bash
test -x ./node_modules/.bin/playwright-cli-patched \
  && grep -q '"description": "Patchright-backed Playwright CLI"' ./node_modules/playwright-cli-patched/package.json \
  && echo "playwright-cli-patched is installed locally" \
  || echo "playwright-cli-patched is NOT installed locally"
```

Two distinct outcomes:

- `playwright-cli-patched is installed locally` -> stop setup. Use `./node_modules/.bin/playwright-cli-patched ...` for every command in this skill.
- `playwright-cli-patched is NOT installed locally` -> continue to step 2. This is the only condition that justifies an install.

The marker grep on the bundled `package.json` description is what makes this check reliable: it confirms both that the binary exists at the project-local path **and** that the installed package is the Patchright-backed fork, not some other package that happens to share a name.

### 2. Install the patched fork into the current project (only if step 1 said NOT installed)

If the project has no `package.json` yet:

```bash
npm init -y
```

Then install the local fork as a dev dependency:

```bash
npm install -D "file:/Users/pedrocarvalho/projects/browser-automation/playwright-cli-patchright"
```

This wires the current project to the local Patchright-backed fork. With npm `file:` dependencies, this is a symlink, not a copied package.

Re-run the detection from step 1 to confirm:

```bash
test -x ./node_modules/.bin/playwright-cli-patched \
  && grep -q '"description": "Patchright-backed Playwright CLI"' ./node_modules/playwright-cli-patched/package.json \
  && ./node_modules/.bin/playwright-cli-patched --version
```

Expected output: `0.1.10` (or whatever version the fork currently pins).

### 3. (Optional) Drop the skill files into the project

Useful when you want Claude Code / OpenCode to see a project-local copy of this skill. Do this only when project-local skill files are missing or need refresh:

```bash
# .claude/skills/playwright-cli-patched  (Claude Code default)
./node_modules/.bin/playwright-cli-patched install --skills

# .agents/skills/playwright-cli-patched   (generic agents layout)
./node_modules/.bin/playwright-cli-patched install --skills=agents
```

### 4. Invocation convention used in the rest of this skill

All examples below show the bare command `playwright-cli-patched ...`. **Treat that as a placeholder.** Inside a project, always invoke as the explicit project-local path:

```bash
./node_modules/.bin/playwright-cli-patched <args>
```

Example translation:

```bash
# As written in this skill
playwright-cli-patched open https://example.com

# What you actually run
./node_modules/.bin/playwright-cli-patched open https://example.com
```

Using the explicit `./node_modules/.bin/...` path keeps the call unambiguous and independent of `PATH`. If you want a shorter handle for a single shell session, define a function:

```bash
pw() { ./node_modules/.bin/playwright-cli-patched "$@"; }
pw open https://example.com
```

### Notes

- `npm install -D "file:<path>"` creates a **symlink** at `node_modules/playwright-cli-patched` -> the fork directory. It does not copy. Edits made in the fork are picked up immediately by every project that points at it; no re-install needed.
- The fork itself must have its own `node_modules/` populated (it does today), because Node resolves `patchright-core` from inside the fork's nested `node_modules`. If you ever wipe the fork's `node_modules`, run `npm install` inside the fork to restore it before using the CLI in consumer projects.
- The package name in `node_modules` is `playwright-cli-patched`, distinct from upstream Microsoft's `@playwright/cli`. The two cannot collide.
- Patchright only patches Chromium-based browsers. Use `--browser=chromium`, `--browser=chrome`, or `--browser=msedge`. Firefox and WebKit are not Patchright-backed even though the CLI lists them as options.
- If the fork is moved or renamed, every consumer project's `package.json` `file:` path must be updated and `npm install` re-run.

## Example: Form submission

```bash
playwright-cli-patched open https://example.com/form
playwright-cli-patched snapshot

playwright-cli-patched fill e1 "user@example.com"
playwright-cli-patched fill e2 "password123"
playwright-cli-patched click e3
playwright-cli-patched snapshot
playwright-cli-patched close
```

## Example: Multi-tab workflow

```bash
playwright-cli-patched open https://example.com
playwright-cli-patched tab-new https://example.com/other
playwright-cli-patched tab-list
playwright-cli-patched tab-select 0
playwright-cli-patched snapshot
playwright-cli-patched close
```

## Example: Debugging with DevTools

```bash
playwright-cli-patched open https://example.com
playwright-cli-patched click e4
playwright-cli-patched fill e7 "test"
# `console` is typically empty under Patchright (Console CDP domain disabled).
# For real console-like visibility, use the page-side JS logger pattern in
# references/debugging-patchright.md. `requests` and `snapshot` work as normal.
playwright-cli-patched console
playwright-cli-patched requests
playwright-cli-patched close
```

```bash
playwright-cli-patched open https://example.com
playwright-cli-patched tracing-start
playwright-cli-patched click e4
playwright-cli-patched fill e7 "test"
playwright-cli-patched tracing-stop
playwright-cli-patched close
```

## Example: Visual dashboard

```bash
playwright-cli-patched open https://example.com
playwright-cli-patched show
```

## Specific tasks

* **Debugging under Patchright (console workarounds, eval contexts, fallback strategies)** [references/debugging-patchright.md](references/debugging-patchright.md)
* **Running and Debugging Patchright-backed tests** [references/playwright-tests.md](references/playwright-tests.md)
* **Request mocking** [references/request-mocking.md](references/request-mocking.md)
* **Running Playwright-compatible code** [references/running-code.md](references/running-code.md)
* **Browser session management** [references/session-management.md](references/session-management.md)
* **Spec-driven testing (plan / generate / heal)** [references/spec-driven-testing.md](references/spec-driven-testing.md)
* **Storage state (cookies, localStorage)** [references/storage-state.md](references/storage-state.md)
* **Test generation** [references/test-generation.md](references/test-generation.md)
* **Tracing** [references/tracing.md](references/tracing.md)
* **Video recording** [references/video-recording.md](references/video-recording.md)
* **Inspecting element attributes** [references/element-attributes.md](references/element-attributes.md)
