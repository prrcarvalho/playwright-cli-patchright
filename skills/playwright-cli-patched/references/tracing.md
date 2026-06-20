# Tracing

Capture detailed execution traces for debugging and analysis. Traces include DOM snapshots, screenshots, network activity, and (on upstream Playwright) console logs.

> **Patchright caveat:** the patched CLI disables the CDP Console domain for stealth, so the trace's console column will be empty or near-empty. Everything else (DOM, screenshots, network, action log, timing) is fully populated. If you need console-like visibility inside a trace, combine tracing with the page-side JS logger pattern in [debugging-patchright.md](debugging-patchright.md).

## Basic Usage

```bash
# Start trace recording
playwright-cli-patched tracing-start

# Perform actions
playwright-cli-patched open https://example.com
playwright-cli-patched click e1
playwright-cli-patched fill e2 "test"

# Stop trace recording
playwright-cli-patched tracing-stop
```

## Trace Output Files

When you start tracing, Playwright creates a `traces/` directory with several files:

### `trace-{timestamp}.trace`

**Action log** - The main trace file containing:
- Every action performed (clicks, fills, navigations)
- DOM snapshots before and after each action
- Screenshots at each step
- Timing information
- Console messages (empty under Patchright — see caveat above)
- Source locations

### `trace-{timestamp}.network`

**Network log** - Complete network activity:
- All HTTP requests and responses
- Request headers and bodies
- Response headers and bodies
- Timing (DNS, connect, TLS, TTFB, download)
- Resource sizes
- Failed requests and errors

### `resources/`

**Resources directory** - Cached resources:
- Images, fonts, stylesheets, scripts
- Response bodies for replay
- Assets needed to reconstruct page state

## What Traces Capture

| Category | Details |
|----------|---------|
| **Actions** | Clicks, fills, hovers, keyboard input, navigations |
| **DOM** | Full DOM snapshot before/after each action |
| **Screenshots** | Visual state at each step |
| **Network** | All requests, responses, headers, bodies, timing |
| **Console** | All console.log, warn, error messages (empty under Patchright — Console CDP domain disabled) |
| **Timing** | Precise timing for each operation |

## Use Cases

### Debugging Failed Actions

```bash
playwright-cli-patched tracing-start
playwright-cli-patched open https://app.example.com

# This click fails - why?
playwright-cli-patched click e5

playwright-cli-patched tracing-stop
# Open trace to see DOM state when click was attempted
```

### Analyzing Performance

```bash
playwright-cli-patched tracing-start
playwright-cli-patched open https://slow-site.com
playwright-cli-patched tracing-stop

# View network waterfall to identify slow resources
```

### Capturing Evidence

```bash
# Record a complete user flow for documentation
playwright-cli-patched tracing-start

playwright-cli-patched open https://app.example.com/checkout
playwright-cli-patched fill e1 "4111111111111111"
playwright-cli-patched fill e2 "12/25"
playwright-cli-patched fill e3 "123"
playwright-cli-patched click e4

playwright-cli-patched tracing-stop
# Trace shows exact sequence of events
```

## Trace vs Video vs Screenshot

| Feature | Trace | Video | Screenshot |
|---------|-------|-------|------------|
| **Format** | .trace file | .webm video | .png/.jpeg image |
| **DOM inspection** | Yes | No | No |
| **Network details** | Yes | No | No |
| **Step-by-step replay** | Yes | Continuous | Single frame |
| **File size** | Medium | Large | Small |
| **Best for** | Debugging | Demos | Quick capture |

## Best Practices

### 1. Start Tracing Before the Problem

```bash
# Trace the entire flow, not just the failing step
playwright-cli-patched tracing-start
playwright-cli-patched open https://example.com
# ... all steps leading to the issue ...
playwright-cli-patched tracing-stop
```

### 2. Clean Up Old Traces

Traces can consume significant disk space:

```bash
# Remove traces older than 7 days
find .playwright-cli/traces -mtime +7 -delete
```

## Limitations

- Traces add overhead to automation
- Large traces can consume significant disk space
- Some dynamic content may not replay perfectly
