/* widgets.js — one factory per widget. Each returns a .card element.
   (Single file rather than js/widgets/*.js to avoid script-tag sprawl;
   each widget is still an isolated factory in the registry below.) */
(() => {
  "use strict";

  function card(title) {
    const el = document.createElement("section");
    el.className = "card";
    const h = document.createElement("h3");
    h.textContent = title;
    el.appendChild(h);
    return el;
  }

  // ---- Clock --------------------------------------------------------------
  function clock() {
    const el = card("Clock");
    const time = document.createElement("div");
    time.className = "clock-time";
    const date = document.createElement("div");
    date.className = "clock-date";
    el.append(time, date);

    function tick() {
      const now = new Date();
      time.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      date.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    }
    tick();
    const id = setInterval(tick, 1000 * 15);
    el.addEventListener("dashboard:teardown", () => clearInterval(id));
    return el;
  }

  // ---- Weather (Open-Meteo, no API key) ----------------------------------
  const WEATHER_CODES = {
    0: ["☀️", "Clear sky"], 1: ["🌤️", "Mainly clear"], 2: ["⛅", "Partly cloudy"],
    3: ["☁️", "Overcast"], 45: ["🌫️", "Fog"], 48: ["🌫️", "Rime fog"],
    51: ["🌦️", "Light drizzle"], 53: ["🌦️", "Drizzle"], 55: ["🌧️", "Dense drizzle"],
    61: ["🌧️", "Light rain"], 63: ["🌧️", "Rain"], 65: ["🌧️", "Heavy rain"],
    71: ["🌨️", "Light snow"], 73: ["🌨️", "Snow"], 75: ["❄️", "Heavy snow"],
    80: ["🌦️", "Rain showers"], 81: ["🌧️", "Rain showers"], 82: ["⛈️", "Violent showers"],
    95: ["⛈️", "Thunderstorm"], 96: ["⛈️", "Thunderstorm + hail"], 99: ["⛈️", "Severe thunderstorm"],
  };

  function weather(cfg) {
    const el = card(`Weather · ${cfg.location.name}`);
    const body = document.createElement("div");
    body.innerHTML = `<div class="muted">Loading…</div>`;
    el.appendChild(body);

    const unit = cfg.units === "celsius" ? "celsius" : "fahrenheit";
    const u = unit === "celsius" ? "°C" : "°F";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cfg.location.lat}` +
      `&longitude=${cfg.location.lon}&current=temperature_2m,weather_code,wind_speed_10m` +
      `&temperature_unit=${unit}&wind_speed_unit=mph`;

    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        const c = data.current;
        const [icon, desc] = WEATHER_CODES[c.weather_code] || ["🌡️", "—"];
        body.innerHTML = `
          <div class="weather-main">
            <span class="weather-icon">${icon}</span>
            <span class="weather-temp">${Math.round(c.temperature_2m)}${u}</span>
          </div>
          <div class="weather-desc">${desc}</div>
          <div class="weather-meta">Wind ${Math.round(c.wind_speed_10m)} mph</div>`;
      })
      .catch((err) => { body.innerHTML = `<div class="muted">Weather unavailable (${err.message})</div>`; });

    return el;
  }

  // ---- Todos --------------------------------------------------------------
  const TODO_KEY = "dashboard:todos";

  function todos() {
    const el = card("To-Do");
    const input = document.createElement("input");
    input.className = "todo-input";
    input.placeholder = "Add a task and press Enter…";
    const list = document.createElement("ul");
    list.className = "todo-list";
    el.append(input, list);

    let items = [];
    try { items = JSON.parse(localStorage.getItem(TODO_KEY)) || []; } catch (_) {}

    const persist = () => localStorage.setItem(TODO_KEY, JSON.stringify(items));

    function draw() {
      list.innerHTML = "";
      items.forEach((it, i) => {
        const li = document.createElement("li");
        li.className = "todo-item" + (it.done ? " done" : "");
        const cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = it.done;
        cb.addEventListener("change", () => { items[i].done = cb.checked; persist(); draw(); });
        const span = document.createElement("span");
        span.textContent = it.text;
        const del = document.createElement("button");
        del.className = "todo-del"; del.textContent = "✕";
        del.addEventListener("click", () => { items.splice(i, 1); persist(); draw(); });
        li.append(cb, span, del);
        list.appendChild(li);
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        items.push({ text: input.value.trim(), done: false });
        input.value = ""; persist(); draw();
      }
    });

    draw();
    return el;
  }

  // ---- Links --------------------------------------------------------------
  function links(cfg) {
    const el = card("Links");
    const ul = document.createElement("ul");
    ul.className = "links-list";
    (cfg.links || []).forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.url; a.textContent = l.title; a.target = "_blank"; a.rel = "noopener";
      li.appendChild(a); ul.appendChild(li);
    });
    if (!cfg.links || !cfg.links.length) {
      const p = document.createElement("div"); p.className = "muted";
      p.textContent = "Add links in Config."; el.appendChild(p);
    }
    el.appendChild(ul);
    return el;
  }

  // ---- Notes --------------------------------------------------------------
  const NOTES_KEY = "dashboard:notes";

  function notes() {
    const el = card("Notes");
    const area = document.createElement("textarea");
    area.className = "notes-area";
    area.placeholder = "Scratchpad… saved automatically.";
    area.value = localStorage.getItem(NOTES_KEY) || "";
    let t;
    area.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => localStorage.setItem(NOTES_KEY, area.value), 300);
    });
    el.appendChild(area);
    return el;
  }

  window.Widgets = { clock, weather, todos, links, notes };
})();
