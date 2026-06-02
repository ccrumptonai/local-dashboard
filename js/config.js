/* config.js — the single source of truth for dashboard layout/content.
   Stored in localStorage; importable/exportable as JSON. */
(() => {
  "use strict";

  const KEY = "dashboard:config";

  const DEFAULT_CONFIG = {
    theme: "dark",
    location: { name: "New York", lat: 40.7128, lon: -74.006 },
    units: "fahrenheit", // or "celsius"
    // Which widgets to show, in order.
    widgets: ["clock", "weather", "todos", "links", "notes"],
    links: [
      { title: "GitHub", url: "https://github.com" },
      { title: "Hacker News", url: "https://news.ycombinator.com" },
      { title: "MDN", url: "https://developer.mozilla.org" },
      { title: "Open-Meteo", url: "https://open-meteo.com" },
    ],
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT_CONFIG);
      // Merge over defaults so missing keys are filled in.
      return { ...structuredClone(DEFAULT_CONFIG), ...JSON.parse(raw) };
    } catch (_) {
      return structuredClone(DEFAULT_CONFIG);
    }
  }

  function save(cfg) {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  }

  function reset() {
    localStorage.removeItem(KEY);
    return structuredClone(DEFAULT_CONFIG);
  }

  window.DashConfig = { DEFAULT_CONFIG, load, save, reset, KEY };
})();
