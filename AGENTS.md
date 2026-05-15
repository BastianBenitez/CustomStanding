# AGENTS

## Repo shape
- Static overlay app: `index.html` loads `style.css`, `app.js`, and CoffeeScript runtime `libs/coffee-script.js` with `libs/ir.coffee` (IRacing/Kapps bridge).

## Runtime assumptions
- `app.js` expects global `IRacing` from `libs/ir.coffee`; if it is missing, the overlay waits and retries.
- Flags rely on the external CDN in `index.html` (`flag-icons`), not local assets.

## Dev workflow
- No build system or package manager detected; edit files directly and open `index.html` to verify UI changes.
