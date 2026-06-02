# 🏠 Local Dashboard

A clean, **local-first** personal start page: clock, weather, to-do list, quick
links, and a notes scratchpad — all driven by a single editable JSON config and
stored entirely in your browser. **No accounts, no backend, no tracking.**

<!-- TODO: add a demo GIF here, e.g. ![demo](docs/demo.gif) -->

## ✨ Features

- **Clock** — live time and date
- **Weather** — current conditions via [Open-Meteo](https://open-meteo.com) (no API key needed)
- **To-Do** — add / check off / delete tasks, saved locally
- **Links** — your bookmarks, defined in config
- **Notes** — autosaving scratchpad
- **Light / dark** theme toggle
- **One config to rule them all** — edit JSON in-app; import/export it as a file
- **Zero install** — just open `index.html`

## 🚀 Use it

**Live demo:** https://ccrumptonai.github.io/local-dashboard/

Or run locally:

```bash
git clone https://github.com/ccrumptonai/local-dashboard.git
cd local-dashboard
# open index.html in a browser — no server needed
```

## ⚙️ Configuration

Click **⚙ Config** and edit the JSON. Example:

```json
{
  "theme": "dark",
  "location": { "name": "London", "lat": 51.5072, "lon": -0.1276 },
  "units": "celsius",
  "widgets": ["clock", "weather", "todos", "links", "notes"],
  "links": [
    { "title": "GitHub", "url": "https://github.com" }
  ]
}
```

- `widgets` controls which cards appear **and their order**.
- `units` is `fahrenheit` or `celsius`.
- Use **Export** to back up your config, **Import** to restore it.

## 🛠️ Built with

Vanilla JS + CSS Grid. Weather from Open-Meteo. All state in `localStorage`.

## 📄 License

MIT
