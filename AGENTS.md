# AGENTS

## Repo shape
- Static overlay app: `index.html` loads `style.css`, `app.js`, and CoffeeScript runtime `libs/coffee-script.js` with `libs/ir.coffee` (IRacing/Kapps bridge).

## Runtime assumptions
- `app.js` expects global `IRacing` from `libs/ir.coffee`; if it is missing, the overlay waits and retries.
- Flags rely on the external CDN in `index.html` (`flag-icons`), not local assets.

## Dev workflow
- No build system or package manager detected; edit files directly and open `index.html` to verify UI changes.

## Session Notes (May 15, 2026)

### Pit column format
- Pit column now shows: `L{lap} {time}` (e.g. `L21 1:03` for ≥60s, `L21 23.4` for <60s).
- Lap number comes from `CarIdxLap[i]` or `state.lapsCompleted + 1`.
- `formatPitTime()`: no suffix `< 60s`, `m:ss` format without decimals when ≥60s.

### IRSDK variable rules
- All variables in `irsdkVarsToLog` are dynamic; only `DriverInfo` is static.
- `CarIdxOnPitRoad` triggers `pitTimers` (start/stop) in the `onPitRoad` mapping branch.
- `CarIdxLap` used to capture the pit entry lap number.

### Key data flow
- `onUpdate(data)`: maps telemetry arrays → `telemetryData` Map keyed by `carIdx`. Then updates `lastLapHistory` from `CarIdxLastLapTime`. Calls `renderTable()` unconditionally (10 Hz).
- `renderTable()`: builds HTML from sorted drivers (by class, then position). Shows top 3 + window of 3 ahead/behind focus car.
- Focus car: `CamCarIdx` (camera) priority, fallback `playerCarIdx`.
- `selectVisibleDrivers()`: returns sorted visible indexes with separator flag when window starts > 3.

### Tire logic
- `-1` or `"-"` → `"-"`.
- `1` or string containing "wet"/"rain"/"w" → `"WET"`.
- Otherwise → `"DRY"`.

### Formatting
- iRating: `3k` / `3.2k` via `formatIRating()`.
- Pit time ≥ 60s: `m:ss` (no decimals).
- L GAP: 3 individual lap-gap values (green/red) separated by spaces, based on last 3 laps vs focus car per lap offset.
- Car brand: first word of `CarShortName`.
- Position: `ResultsPositions.ClassPosition` → `Position` → `-`.
