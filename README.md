# playwright-cli-patched

Patchright-backed Playwright CLI with SKILLS.

### Playwright CLI vs Playwright MCP

This package provides CLI interface into Patchright's Playwright-compatible browser engine. If you are using **coding agents**, that is the best fit.

- **CLI**: Modern **coding agents** increasingly favor CLI–based workflows exposed as SKILLs over MCP because CLI invocations are more token-efficient: they avoid loading large tool schemas and verbose accessibility trees into the model context, allowing agents to act through concise, purpose-built commands. This makes CLI + SKILLs better suited for high-throughput coding agents that must balance browser automation with large codebases, tests, and reasoning within limited context windows.

- **MCP**: MCP remains relevant for specialized agentic loops that benefit from persistent state, rich introspection, and iterative reasoning over page structure, such as exploratory automation, self-healing tests, or long-running autonomous workflows where maintaining continuous browser context outweighs token cost concerns. Learn more about [Playwright MCP](https://github.com/microsoft/playwright-mcp).

### Key Features

- **Token-efficient**. Does not force page data into LLM.

### Requirements
- Node.js 18 or newer
- Claude Code, GitHub Copilot, or any other coding agent.

Patchright only patches Chromium-based browsers. Prefer `chromium`, `chrome`, or `msedge`; Firefox and WebKit are not Patchright-backed.

## Getting Started

## Installation

```bash
npm install --save-dev file:/path/to/playwright-cli-patchright
npx --no-install playwright-cli-patched --help
```

### Full upgrade

From this fork checkout, run a full fork upgrade (upstream + Patchright runtime):

```bash
node playwright-cli.js upgrade
```

`upgrade` now merges Microsoft `playwright-cli` first (if possible), then updates `patchright` and
`patchright-core` to npm latest.

Use `node playwright-cli.js upgrade --dry-run` to print the upstream merge plan and package versions
without changing package files.

If you only want to upgrade Patchright packages without syncing upstream, run:

```bash
node playwright-cli.js upgrade --skip-upstream
```

### Syncing Microsoft upstream

Keep this fork close to `microsoft/playwright-cli` while retaining Patchright runtime wiring:

```bash
# Set upstream once (if not already configured)
git remote add upstream https://github.com/microsoft/playwright-cli.git

# Pull and merge the latest upstream `main`
node playwright-cli.js sync-upstream

# Check first without changing your tree
node playwright-cli.js sync-upstream --dry-run
```

If your branch has local changes, use `--allow-dirty` or commit/stash first. After a successful merge, run `node scripts/update.js` and `npm test` to refresh skills and verify the CLI still works.

### Installing skills

Claude Code, GitHub Copilot and others will use the locally installed skills.

```bash
npx --no-install playwright-cli-patched install --skills
```

### Skills-less operation

Point your agent at the CLI and let it cook. It'll read the skill off `playwright-cli-patched --help` on its own:

```
Test the "add todo" flow on https://demo.playwright.dev/todomvc using playwright-cli-patched.
Check playwright-cli-patched --help for available commands.
```

## Demo

```
> Use playwright skills to test https://demo.playwright.dev/todomvc/.
  Take screenshots for all successful and failing scenarios.
```

Your agent will be running commands, but it does not mean you can't play with it manually:

```
npx --no-install playwright-cli-patched open https://demo.playwright.dev/todomvc/ --headed
npx --no-install playwright-cli-patched type "Buy groceries"
npx --no-install playwright-cli-patched press Enter
npx --no-install playwright-cli-patched type "Water flowers"
npx --no-install playwright-cli-patched press Enter
npx --no-install playwright-cli-patched check e21
npx --no-install playwright-cli-patched check e35
npx --no-install playwright-cli-patched screenshot
```

## Headed operation

playwright-cli-patched is headless by default. If you'd like to see the browser, pass `--headed` to `open`:

```bash
npx --no-install playwright-cli-patched open https://playwright.dev --headed
```

## Sessions

playwright-cli-patched keeps the browser profile in memory by default. Your cookies and storage state
are preserved between CLI calls within the session, but lost when the browser closes. Use
`--persistent` to save the profile to disk for persistence across browser restarts.

You can use different instances of the browser for different projects with sessions. Pass `-s=` to
the invocation to talk to a specific browser.

```bash
npx --no-install playwright-cli-patched open https://playwright.dev
npx --no-install playwright-cli-patched -s=example open https://example.com --persistent
npx --no-install playwright-cli-patched list
```

You can run your coding agent with the `PLAYWRIGHT_CLI_SESSION` environment variable:

```bash
PLAYWRIGHT_CLI_SESSION=todo-app claude .
```

Or instruct it to prepend `-s=` to the calls.

Manage your sessions as follows:

```bash
npx --no-install playwright-cli-patched list                     # list all sessions
npx --no-install playwright-cli-patched close-all                # close all browsers
npx --no-install playwright-cli-patched kill-all                 # forcefully kill all browser processes
```

## Monitoring

Use `playwright-cli-patched show` to open a visual dashboard that lets you see and control all running
browser sessions. This is useful when your coding agents are running browser automation in the
background and you want to observe their progress or step in to help.

```bash
npx --no-install playwright-cli-patched show
```

<img width="1107" height="729" alt="Image" src="https://github.com/user-attachments/assets/99df739d-106a-4520-b004-bb315db41da7" />

The dashboard opens a window with two views:

- **Session grid** — shows all active sessions grouped by workspace, each with a live screencast
  preview, session name, current URL, and page title. Click any session to zoom in.
- **Session detail** — shows a live view of the selected session with a tab bar, navigation
  controls (back, forward, reload, address bar), and full remote control. Click into the viewport
  to take over mouse and keyboard input; press Escape to release.

From the grid you can also close running sessions or delete data for inactive ones.

## Commands

### Core

```bash
playwright-cli-patched open [url]               # open browser, optionally navigate to url
playwright-cli-patched goto <url>               # navigate to a url
playwright-cli-patched close                    # close the page
playwright-cli-patched type <text>              # type text into editable element
playwright-cli-patched click <ref> [button]     # perform click on a web page
playwright-cli-patched dblclick <ref> [button]  # perform double click on a web page
playwright-cli-patched fill <ref> <text>        # fill text into editable element
playwright-cli-patched fill <ref> <text> --submit # fill and press Enter
playwright-cli-patched drag <startRef> <endRef> # perform drag and drop between two elements
playwright-cli-patched hover <ref>              # hover over element on page
playwright-cli-patched select <ref> <val>       # select an option in a dropdown
playwright-cli-patched upload <file>            # upload one or multiple files
playwright-cli-patched check <ref>              # check a checkbox or radio button
playwright-cli-patched uncheck <ref>            # uncheck a checkbox or radio button
playwright-cli-patched snapshot                 # capture page snapshot to obtain element ref
playwright-cli-patched snapshot --filename=f    # save snapshot to specific file
playwright-cli-patched snapshot <ref>           # snapshot a specific element
playwright-cli-patched snapshot --depth=N       # limit snapshot depth for efficiency
playwright-cli-patched eval <func> [ref]        # evaluate javascript expression on page or element
playwright-cli-patched dialog-accept [prompt]   # accept a dialog
playwright-cli-patched dialog-dismiss           # dismiss a dialog
playwright-cli-patched resize <w> <h>           # resize the browser window
```

### Navigation

```bash
playwright-cli-patched go-back                  # go back to the previous page
playwright-cli-patched go-forward               # go forward to the next page
playwright-cli-patched reload                   # reload the current page
```

### Keyboard

```bash
playwright-cli-patched press <key>              # press a key on the keyboard, `a`, `arrowleft`
playwright-cli-patched keydown <key>            # press a key down on the keyboard
playwright-cli-patched keyup <key>              # press a key up on the keyboard
```

### Mouse

```bash
playwright-cli-patched mousemove <x> <y>        # move mouse to a given position
playwright-cli-patched mousedown [button]       # press mouse down
playwright-cli-patched mouseup [button]         # press mouse up
playwright-cli-patched mousewheel <dx> <dy>     # scroll mouse wheel
```

### Save as

```bash
playwright-cli-patched screenshot [ref]         # screenshot of the current page or element
playwright-cli-patched screenshot --filename=f  # save screenshot with specific filename
playwright-cli-patched pdf                      # save page as pdf
playwright-cli-patched pdf --filename=page.pdf  # save pdf with specific filename
```

### Tabs

```bash
playwright-cli-patched tab-list                 # list all tabs
playwright-cli-patched tab-new [url]            # create a new tab
playwright-cli-patched tab-close [index]        # close a browser tab
playwright-cli-patched tab-select <index>       # select a browser tab
```

### Storage

```bash
playwright-cli-patched state-save [filename]    # save storage state
playwright-cli-patched state-load <filename>    # load storage state

# Cookies
playwright-cli-patched cookie-list [--domain]   # list cookies
playwright-cli-patched cookie-get <name>        # get a cookie
playwright-cli-patched cookie-set <name> <val>  # set a cookie
playwright-cli-patched cookie-delete <name>     # delete a cookie
playwright-cli-patched cookie-clear             # clear all cookies

# LocalStorage
playwright-cli-patched localstorage-list        # list localStorage entries
playwright-cli-patched localstorage-get <key>   # get localStorage value
playwright-cli-patched localstorage-set <k> <v> # set localStorage value
playwright-cli-patched localstorage-delete <k>  # delete localStorage entry
playwright-cli-patched localstorage-clear       # clear all localStorage

# SessionStorage
playwright-cli-patched sessionstorage-list      # list sessionStorage entries
playwright-cli-patched sessionstorage-get <k>   # get sessionStorage value
playwright-cli-patched sessionstorage-set <k> <v> # set sessionStorage value
playwright-cli-patched sessionstorage-delete <k>  # delete sessionStorage entry
playwright-cli-patched sessionstorage-clear     # clear all sessionStorage
```

### Network

```bash
playwright-cli-patched route <pattern> [opts]   # mock network requests
playwright-cli-patched route-list               # list active routes
playwright-cli-patched unroute [pattern]        # remove route(s)
```

### DevTools

```bash
playwright-cli-patched console [min-level]      # list console messages; typically empty under Patchright
playwright-cli-patched requests                 # list all network requests since loading the page
playwright-cli-patched request <index>          # inspect one request from the list
playwright-cli-patched run-code <code>          # run playwright code snippet
playwright-cli-patched run-code --filename=f    # run playwright code from a file
playwright-cli-patched tracing-start            # start trace recording
playwright-cli-patched tracing-stop             # stop trace recording
playwright-cli-patched video-start [filename]   # start video recording
playwright-cli-patched video-chapter <title>    # add a chapter marker to the video
playwright-cli-patched video-stop               # stop video recording
playwright-cli-patched video-show-actions       # annotate subsequent actions in the video
playwright-cli-patched video-hide-actions       # stop action annotations
playwright-cli-patched show                     # open the visual dashboard
playwright-cli-patched show --annotate          # open dashboard for UI review / design feedback
playwright-cli-patched generate-locator <ref>   # generate a Playwright locator
playwright-cli-patched highlight <ref>          # show a persistent highlight overlay
playwright-cli-patched highlight --hide         # hide all page highlights
```

### Open parameters

```bash
playwright-cli-patched open --browser=chrome    # use Chrome
playwright-cli-patched open --browser=chromium  # use Chromium
playwright-cli-patched open --browser=msedge    # use Microsoft Edge
playwright-cli-patched attach <endpoint>        # attach to a running browser endpoint
playwright-cli-patched open --persistent        # use persistent profile
playwright-cli-patched open --profile=<path>    # use custom profile directory
playwright-cli-patched open --config=file.json  # use config file
playwright-cli-patched close                    # close the browser
playwright-cli-patched delete-data              # delete user data for default session
```

### Snapshots

After each command, playwright-cli-patched provides a snapshot of the current browser state.

```bash
> playwright-cli-patched goto https://example.com
### Page
- Page URL: https://example.com/
- Page Title: Example Domain
### Snapshot
[Snapshot](.playwright-cli-patched/page-2026-02-14T19-22-42-679Z.yml)
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

### Targeting elements

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

### Sessions

```bash
playwright-cli-patched -s=name <cmd>            # run command in named session
playwright-cli-patched -s=name close            # stop a named browser
playwright-cli-patched -s=name delete-data      # delete user data for named browser
playwright-cli-patched list                     # list all sessions
playwright-cli-patched close-all                # close all browsers
playwright-cli-patched kill-all                 # forcefully kill all browser processes
```

### Local installation

Install the patched CLI from a local checkout, then run it with `npx --no-install playwright-cli-patched`:

```bash
npm install --save-dev file:/path/to/playwright-cli-patchright
npx --no-install playwright-cli-patched --version
```

When local version is available, use `npx --no-install playwright-cli-patched` in all commands.

## Configuration file

The Patchright-backed CLI can be configured using a JSON configuration file. You can specify the configuration file using the `--config` command line option:

```bash
playwright-cli-patched --config path/to/config.json open example.com
```

playwright-cli-patched will load config from `.playwright/cli.config.json` by default so that you did not need to specify it every time.

<details>
<summary>Configuration file schema</summary>

```typescript
{
  /**
   * The browser to use.
   */
  browser?: {
    /**
     * The type of browser to use.
     */
    browserName?: 'chromium';

    /**
     * Keep the browser profile in memory, do not save it to disk.
     */
    isolated?: boolean;

    /**
     * Path to a user data directory for browser profile persistence.
     * Temporary directory is created by default.
     */
    userDataDir?: string;

    /**
     * Launch options passed to
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context
     *
     * This is useful for settings options like `channel`, `headless`, `executablePath`, etc.
     */
    launchOptions?: playwright.LaunchOptions;

    /**
     * Context options for the browser context.
     *
     * This is useful for settings options like `viewport`.
     */
    contextOptions?: playwright.BrowserContextOptions;

    /**
     * Chrome DevTools Protocol endpoint to connect to an existing browser instance in case of Chromium family browsers.
     */
    cdpEndpoint?: string;

    /**
     * CDP headers to send with the connect request.
     */
    cdpHeaders?: Record<string, string>;

    /**
     * Timeout in milliseconds for connecting to CDP endpoint. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
     */
    cdpTimeout?: number;

    /**
     * Remote endpoint to connect to an existing Playwright server.
     */
    remoteEndpoint?: string;

    /**
     * Paths to TypeScript files to add as initialization scripts for Playwright page.
     */
    initPage?: string[];

    /**
     * Paths to JavaScript files to add as initialization scripts.
     * The scripts will be evaluated in every page before any of the page's scripts.
     */
    initScript?: string[];
  },

  /**
   * If specified, saves the Playwright video of the session into the output directory.
   */
  saveVideo?: {
    width: number;
    height: number;
  };

  /**
   * The directory to save output files.
   */
  outputDir?: string;

  /**
   * Whether to save snapshots, console messages, network logs and other session logs to a file or to the standard output. Defaults to "stdout".
   */
  outputMode?: 'file' | 'stdout';

  console?: {
    /**
     * The level of console messages to return. Each level includes the messages of more severe levels. Defaults to "info".
     */
    level?: 'error' | 'warning' | 'info' | 'debug';
  },

  network?: {
    /**
     * List of origins to allow the browser to request. Default is to allow all. Origins matching both `allowedOrigins` and `blockedOrigins` will be blocked.
     */
    allowedOrigins?: string[];

    /**
     * List of origins to block the browser to request. Origins matching both `allowedOrigins` and `blockedOrigins` will be blocked.
     */
    blockedOrigins?: string[];
  };

  /**
   * Specify the attribute to use for test ids, defaults to "data-testid".
   */
  testIdAttribute?: string;

  timeouts?: {
    /*
     * Configures default action timeout: https://playwright.dev/docs/api/class-page#page-set-default-timeout. Defaults to 5000ms.
     */
    action?: number;

    /*
     * Configures default navigation timeout: https://playwright.dev/docs/api/class-page#page-set-default-navigation-timeout. Defaults to 60000ms.
     */
    navigation?: number;
  };

  /**
   * Whether to allow file uploads from anywhere on the file system.
   * By default (false), file uploads are restricted to paths within the MCP roots only.
   */
  allowUnrestrictedFileAccess?: boolean;

  /**
   * Specify the language to use for code generation.
   */
  codegen?: 'typescript' | 'none';
}
```

</details>

<details>
<summary>Configuration via env</summary>

| Environment |
|-------------|
| `PLAYWRIGHT_MCP_ALLOWED_HOSTS` comma-separated list of hosts this server is allowed to serve from. Defaults to the host the server is bound to. Pass '*' to disable the host check. |
| `PLAYWRIGHT_MCP_ALLOWED_ORIGINS` semicolon-separated list of TRUSTED origins to allow the browser to request. Default is to allow all. Important: *does not* serve as a security boundary and *does not* affect redirects. |
| `PLAYWRIGHT_MCP_ALLOW_UNRESTRICTED_FILE_ACCESS` allow access to files outside of the workspace roots. Also allows unrestricted access to file:// URLs. By default access to file system is restricted to workspace root directories (or cwd if no roots are configured) only, and navigation to file:// URLs is blocked. |
| `PLAYWRIGHT_MCP_BLOCKED_ORIGINS` semicolon-separated list of origins to block the browser from requesting. Blocklist is evaluated before allowlist. If used without the allowlist, requests not matching the blocklist are still allowed. Important: *does not* serve as a security boundary and *does not* affect redirects. |
| `PLAYWRIGHT_MCP_BLOCK_SERVICE_WORKERS` block service workers |
| `PLAYWRIGHT_MCP_BROWSER` browser or chrome channel to use, possible values: chromium, chrome, msedge. |
| `PLAYWRIGHT_MCP_CAPS` comma-separated list of additional capabilities to enable, possible values: vision, pdf. |
| `PLAYWRIGHT_MCP_CDP_ENDPOINT` CDP endpoint to connect to. |
| `PLAYWRIGHT_MCP_CDP_HEADERS` CDP headers to send with the connect request, multiple can be specified. |
| `PLAYWRIGHT_MCP_CDP_TIMEOUT` timeout for the CDP connection. |
| `PLAYWRIGHT_MCP_CONFIG` path to the configuration file. |
| `PLAYWRIGHT_MCP_CONSOLE_LEVEL` level of console messages to return: "error", "warning", "info", "debug". Each level includes the messages of more severe levels. |
| `PLAYWRIGHT_MCP_DEVICE` device to emulate, for example: "iPhone 15" |
| `PLAYWRIGHT_MCP_EXECUTABLE_PATH` path to the browser executable. |
| `PLAYWRIGHT_MCP_EXTENSION` Connect to a running browser instance (Edge/Chrome only). Requires the "Playwright MCP Bridge" browser extension to be installed. |
| `PLAYWRIGHT_MCP_GRANT_PERMISSIONS` List of permissions to grant to the browser context, for example "geolocation", "clipboard-read", "clipboard-write". |
| `PLAYWRIGHT_MCP_HEADLESS` whether to run browser in headless mode, headless by default. |
| `PLAYWRIGHT_MCP_IGNORE_HTTPS_ERRORS` ignore https errors |
| `PLAYWRIGHT_MCP_INIT_PAGE` path to TypeScript file to evaluate on Playwright page object |
| `PLAYWRIGHT_MCP_INIT_SCRIPT` path to JavaScript file to add as an initialization script. The script will be evaluated in every page before any of the page's scripts. Can be specified multiple times. |
| `PLAYWRIGHT_MCP_ISOLATED` keep the browser profile in memory, do not save it to disk. |
| `PLAYWRIGHT_MCP_SANDBOX` whether to enable the browser sandbox. |
| `PLAYWRIGHT_MCP_OUTPUT_DIR` path to the directory for output files. |
| `PLAYWRIGHT_MCP_PROXY_BYPASS` comma-separated domains to bypass proxy, for example ".com,chromium.org,.domain.com" |
| `PLAYWRIGHT_MCP_PROXY_SERVER` specify proxy server, for example "http://myproxy:3128" or "socks5://myproxy:8080" |
| `PLAYWRIGHT_MCP_SAVE_TRACE` Whether to save the Playwright Trace of the session into the output directory. |
| `PLAYWRIGHT_MCP_SAVE_VIDEO` Whether to save the video of the session into the output directory. For example "--save-video=800x600" |
| `PLAYWRIGHT_MCP_SECRETS_FILE` path to a file containing secrets in the dotenv format |
| `PLAYWRIGHT_MCP_STORAGE_STATE` path to the storage state file for isolated sessions. |
| `PLAYWRIGHT_MCP_TEST_ID_ATTRIBUTE` specify the attribute to use for test ids, defaults to "data-testid" |
| `PLAYWRIGHT_MCP_TIMEOUT_ACTION` specify action timeout in milliseconds, defaults to 5000ms |
| `PLAYWRIGHT_MCP_TIMEOUT_NAVIGATION` specify navigation timeout in milliseconds, defaults to 60000ms |
| `PLAYWRIGHT_MCP_USER_AGENT` specify user agent string |
| `PLAYWRIGHT_MCP_USER_DATA_DIR` path to the user data directory. If not specified, a temporary directory will be created. |
| `PLAYWRIGHT_MCP_VIEWPORT_SIZE` specify browser viewport size in pixels, for example "1280x720" |
</details>

## Specific tasks

The installed skill includes detailed reference guides for common tasks:

* **Running and Debugging Patchright tests** — run, debug and manage Patchright test suites
* **Request mocking** — intercept and mock network requests
* **Running Patchright-compatible code** — execute arbitrary Patchright-compatible Playwright scripts
* **Browser session management** — manage multiple browser sessions
* **Spec-driven testing (plan / generate / heal)** — drive tests from a written spec
* **Storage state (cookies, localStorage)** — persist and restore browser state
* **Test generation** — generate Patchright tests from interactions
* **Tracing** — record and inspect execution traces
* **Video recording** — capture browser session videos
* **Inspecting element attributes** — get element id, class, or any attribute not visible in the snapshot
