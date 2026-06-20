# Inspecting Element Attributes

When the snapshot doesn't show an element's `id`, `class`, `data-*` attributes, or other DOM properties, use `eval` to inspect them.

## Examples

```bash
playwright-cli-patched snapshot
# snapshot shows a button as e7 but doesn't reveal its id or data attributes

# get the element's id
playwright-cli-patched eval "el => el.id" e7

# get all CSS classes
playwright-cli-patched eval "el => el.className" e7

# get a specific attribute
playwright-cli-patched eval "el => el.getAttribute('data-testid')" e7
playwright-cli-patched eval "el => el.getAttribute('aria-label')" e7

# get a computed style property
playwright-cli-patched eval "el => getComputedStyle(el).display" e7
```
