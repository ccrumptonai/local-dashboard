# Personal Dashboard (Local-First) — Implementation Plan

## Goal
A single static page showing weather, clock, todos, RSS/links, and quick notes,
all configured from one editable config (YAML-like JSON). Local-first: state in
localStorage, no accounts, no backend. Deployable on GitHub Pages.

## Success Criteria
- [ ] Widget grid driven by a single config object the user can edit in-app
- [ ] Weather widget (Open-Meteo — free, no API key)
- [ ] Clock/date widget
- [ ] Todo widget with localStorage persistence
- [ ] Bookmarks/links widget
- [ ] Notes/scratchpad widget (localStorage)
- [ ] Light/dark theme toggle
- [ ] Config import/export (download/upload JSON)
- [ ] Works by opening index.html directly — zero install

## Stack
- Vanilla JS + HTML + CSS (no framework)
- [Open-Meteo](https://open-meteo.com/) — free weather, no key required
- CSS Grid for layout; localStorage for all persistence
- Optional: a tiny YAML parser via CDN if YAML config is wanted over JSON

## Architecture
```
index.html        # grid container + config drawer
css/app.css       # grid, cards, theme variables
js/config.js      # default config, load/save, import/export
js/widgets/*.js   # one module per widget (weather, clock, todos, links, notes)
js/app.js         # render widgets from config into the grid
```

## Build Sequence
1. Grid layout + card component + theme variables
2. Config model: default config, persist to localStorage, import/export JSON
3. Clock widget (no network — easiest first)
4. Weather widget (geolocation or configured lat/lon → Open-Meteo)
5. Todo widget (add/complete/delete, persisted)
6. Links + Notes widgets
7. Config drawer (edit config live, re-render)
8. README + demo GIF + GitHub Pages deploy

## Out of Scope (v1)
- System stats (CPU/RAM) — needs native/Electron, not browser-doable
- Google Calendar (OAuth complexity) — link-out only in v1
- Drag-to-rearrange widgets (nice v2)
