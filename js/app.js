/* app.js — render widgets from config, wire theme toggle and config drawer. */
(() => {
  "use strict";

  const grid = document.getElementById("grid");
  const drawer = document.getElementById("drawer");
  const scrim = document.getElementById("scrim");
  const configText = document.getElementById("config-text");
  const configError = document.getElementById("config-error");

  let cfg = window.DashConfig.load();

  function applyTheme() {
    document.body.setAttribute("data-theme", cfg.theme === "light" ? "light" : "dark");
  }

  /** Tear down current widgets (clears intervals) and re-render from cfg. */
  function renderWidgets() {
    grid.querySelectorAll(".card").forEach((c) =>
      c.dispatchEvent(new Event("dashboard:teardown")));
    grid.innerHTML = "";
    (cfg.widgets || []).forEach((name) => {
      const factory = window.Widgets[name];
      if (factory) grid.appendChild(factory(cfg));
    });
  }

  function renderAll() { applyTheme(); renderWidgets(); }

  // ---- Drawer -------------------------------------------------------------
  function openDrawer() {
    configText.value = JSON.stringify(cfg, null, 2);
    configError.hidden = true;
    drawer.hidden = false; scrim.hidden = false;
  }
  function closeDrawer() { drawer.hidden = true; scrim.hidden = true; }

  function applyConfig() {
    let parsed;
    try { parsed = JSON.parse(configText.value); }
    catch (e) { configError.textContent = "Invalid JSON: " + e.message; configError.hidden = false; return; }
    cfg = { ...window.DashConfig.DEFAULT_CONFIG, ...parsed };
    window.DashConfig.save(cfg);
    renderAll();
    closeDrawer();
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dashboard-config.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---- Wiring -------------------------------------------------------------
  document.getElementById("btn-theme").addEventListener("click", () => {
    cfg.theme = cfg.theme === "light" ? "dark" : "light";
    window.DashConfig.save(cfg);
    applyTheme();
  });
  document.getElementById("btn-config").addEventListener("click", openDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  document.getElementById("config-apply").addEventListener("click", applyConfig);
  document.getElementById("config-export").addEventListener("click", exportConfig);
  document.getElementById("config-reset").addEventListener("click", () => {
    cfg = window.DashConfig.reset();
    configText.value = JSON.stringify(cfg, null, 2);
    renderAll();
  });

  const fileInput = document.getElementById("config-file");
  document.getElementById("config-import").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { configText.value = reader.result; };
    reader.readAsText(file);
    fileInput.value = "";
  });

  // ---- Init ---------------------------------------------------------------
  renderAll();
})();
