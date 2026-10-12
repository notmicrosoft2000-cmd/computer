/* ==========================================================================
   COMPUTER — site behaviour
   Vanilla JS only. Every interactive demo on the site is explicitly a
   simulation; nothing here talks to Discord, the bot, or any backend.
   ========================================================================== */
(function () {
  "use strict";

  var qs = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------- m nav */
  function initNav() {
    var toggle = qs(".nav-toggle");
    var menu = qs(".menubar");
    if (!toggle || !menu) return;
    // Collapse the menu by default on small screens.
    if (window.matchMedia("(max-width: 760px)").matches) {
      menu.classList.add("collapsed");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("collapsed") === false;
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ----------------------------------------------------------- doc sidebar */
  function initDocNav() {
    var toggle = qs(".docnav-toggle");
    var nav = qs(".docnav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Highlight the section currently in view.
    var links = qsa(".docnav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------------------------------------------------------- copy buttons */
  function initCopy() {
    qsa("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function (ok) {
          var old = btn.getAttribute("data-label") || btn.textContent;
          btn.setAttribute("data-label", old);
          btn.textContent = ok ? "Copied!" : "Press Ctrl+C";
          window.setTimeout(function () { btn.textContent = old; }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
    });
  }

  /* ------------------------------------------------------- command filter */
  function initFilter() {
    var box = qs("[data-filter-input]");
    if (!box) return;
    var rows = qsa("table.doc-table tbody tr, .filter-item");
    var sections = qsa("[data-filter-section]");
    var empty = qs("[data-filter-empty]");
    var apply = function () {
      var term = box.value.trim().toLowerCase();
      var any = false;
      rows.forEach(function (row) {
        var hay = (row.getAttribute("data-text") || row.textContent).toLowerCase();
        var show = !term || hay.indexOf(term) !== -1;
        row.hidden = !show;
        if (show) any = true;
      });
      sections.forEach(function (sec) {
        var visible = qsa("tr, .filter-item", sec).some(function (r) { return !r.hidden; });
        sec.hidden = !visible;
      });
      if (empty) empty.hidden = any || !term;
    };
    box.addEventListener("input", apply);
    qs("[data-filter-clear]") && qs("[data-filter-clear]").addEventListener("click", function () {
      box.value = ""; apply(); box.focus();
    });
  }

  /* ----------------------------------------------------- space mafia demo */
  var CREW_NAMES = [
    "Red", "Blue", "Green", "Pink", "Orange"
  ];
  var BOT_NAMES = ["Alex", "Skye", "Rune", "Patch", "Nova"];

  function initLobbyDemo() {
    var grid = qs("#slot-grid");
    if (!grid) return;
    var MIN = 4, MAX = 10;
    var count = 6;
    var readout = qs("#slot-count");
    var impReadout = qs("#slot-impostors");
    var specialsReadout = qs("#slot-specials");

    function render() {
      var crews = [];
      for (var i = 0; i < count; i++) {
        var name = i < CREW_NAMES.length ? CREW_NAMES[i] : BOT_NAMES[(i - CREW_NAMES.length) % BOT_NAMES.length];
        var isBot = i >= Math.min(count, 5);
        crews.push({ name: name, bot: isBot });
      }
      // second impostor only appears once the ship is full (7+), matching config
      var impostors = count >= 7 ? 2 : 1;
      grid.innerHTML = "";
      crews.forEach(function (c, idx) {
        var d = document.createElement("div");
        d.className = "slot " + (idx < impostors ? "imp" : "crew");
        d.setAttribute("role", "listitem");
        d.innerHTML = "<b>" + c.name + "</b><small>" +
          (idx < impostors ? "impostor" : (c.bot ? "crewmate (bot)" : "crewmate")) + "</small>";
        grid.appendChild(d);
      });
      // pad to MAX 10 with empty seats
      for (var e = count; e < MAX; e++) {
        var s = document.createElement("div");
        s.className = "slot empty";
        s.setAttribute("role", "listitem");
        s.innerHTML = "<b>&mdash;</b><small>open seat</small>";
        grid.appendChild(s);
      }
      if (readout) readout.textContent = count + " / " + MAX;
      if (impReadout) impReadout.textContent = String(impostors);
      if (specialsReadout) {
        var sp = [];
        if (count >= 4) sp.push("Scientist");
        if (count >= 5) sp.push("Engineer");
        if (count >= 6) sp.push("Guardian Angel");
        if (count >= 7) sp.push("Sheriff");
        if (count >= 8) sp.push("Marionette");
        if (count >= 9) sp.push("Jester");
        specialsReadout.textContent = sp.length ? sp.join(", ") : "none (minimum crew)";
      }
    }

    qs("#slot-plus") && qs("#slot-plus").addEventListener("click", function () {
      count = Math.min(MAX, count + 1); render();
    });
    qs("#slot-minus") && qs("#slot-minus").addEventListener("click", function () {
      count = Math.max(MIN, count - 1); render();
    });
    qs("#slot-reset") && qs("#slot-reset").addEventListener("click", function () {
      count = 6; render();
    });
    render();
  }

  function initTabs() {
    qsa("[data-tabs]").forEach(function (tablist) {
      var tabs = qsa("[role='tab']", tablist);
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) {
            t.setAttribute("aria-selected", "false");
            t.setAttribute("tabindex", "-1");
            var p = document.getElementById(t.getAttribute("aria-controls"));
            if (p) p.hidden = true;
          });
          tab.setAttribute("aria-selected", "true");
          tab.setAttribute("tabindex", "0");
          var panel = document.getElementById(tab.getAttribute("aria-controls"));
          if (panel) panel.hidden = false;
        });
        tab.addEventListener("keydown", function (ev) {
          var i = tabs.indexOf(tab);
          if (ev.key === "ArrowRight") { ev.preventDefault(); tabs[(i + 1) % tabs.length].focus(); }
          if (ev.key === "ArrowLeft") { ev.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
        });
      });
    });
  }

  /* --------------------------------------------------- telephone simulator */
  function initPhoneDemo() {
    var statusEl = qs("#phone-status");
    if (!statusEl) return;
    var destDisplay = qs("#phone-dest-display");
    var destEl = qs("#phone-dest");
    var timerEl = qs("#phone-timer");
    var errEl = qs("#phone-error");
    var logBody = qs("#call-log-body");
    var state = "Idle";
    var seconds = 0;
    var tick = null;

    function setStatus(s) {
      state = s;
      statusEl.textContent = s;
      var card = qs("#phone-card");
      if (card) {
        card.classList.toggle("ring-anim", s === "Ringing");
      }
    }
    function fmt(n) {
      var m = Math.floor(n / 60), sec = n % 60;
      return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
    }
    function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }
    function startTimer() {
      stopTimer(); seconds = 0; timerEl.textContent = fmt(0);
      tick = setInterval(function () { seconds++; timerEl.textContent = fmt(seconds); }, 1000);
    }
    function logRow(outcome) {
      if (!logBody) return;
      var now = new Date();
      var stamp = ("0" + now.getHours()).slice(-2) + ":" +
                  ("0" + now.getMinutes()).slice(-2) + ":" +
                  ("0" + now.getSeconds()).slice(-2);
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + stamp + "</td><td>" + (destEl.value || "#0000-Z") +
        "</td><td>" + outcome + "</td><td>" + fmt(seconds) + "</td>";
      logBody.insertBefore(tr, logBody.firstChild);
    }
    function clearError() { if (errEl) { errEl.hidden = true; errEl.textContent = ""; } }
    function fail(msg) { if (errEl) { errEl.hidden = false; errEl.textContent = msg; } }
    function syncDest() { if (destDisplay) destDisplay.innerHTML = destEl.value ? escapeHtml(destEl.value) : "&nbsp;"; }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    var VALID = /^(911|#?\d{4}(-[A-Za-z])?|[1-9])$/;
    function validate() {
      var v = destEl.value.trim();
      if (!v) { fail("Enter a destination, a #number, 911, or a speed-dial slot 1-9."); return false; }
      if (!VALID.test(v)) { fail("That does not look like a number. Try #4621-K, 911, or 1-9."); return false; }
      clearError(); return true;
    }

    qs("#phone-call") && qs("#phone-call").addEventListener("click", function () {
      if (!validate()) return;
      setStatus("Ringing");
      destEl.readOnly = true;
    });
    qs("#phone-answer") && qs("#phone-answer").addEventListener("click", function () {
      if (state !== "Ringing") return;
      setStatus("Connected");
      startTimer();
    });
    qs("#phone-decline") && qs("#phone-decline").addEventListener("click", function () {
      if (state !== "Ringing") return;
      setStatus("Busy");
      stopTimer();
      logRow("declined");
      destEl.readOnly = false;
      window.setTimeout(function () { if (state === "Busy") setStatus("Ended"); }, 900);
    });
    qs("#phone-hangup") && qs("#phone-hangup").addEventListener("click", function () {
      if (state === "Idle") return;
      stopTimer();
      if (state === "Connected") logRow("connected " + fmt(seconds));
      else logRow("missed");
      setStatus("Ended");
      timerEl.textContent = fmt(0);
      destEl.readOnly = false;
    });
    qsa(".keypad button[data-key]").forEach(function (k) {
      k.addEventListener("click", function () {
        if (destEl.readOnly) return;
        destEl.value = (destEl.value + k.getAttribute("data-key")).slice(0, 12);
        clearError(); syncDest();
      });
    });
    qs("#phone-clear") && qs("#phone-clear").addEventListener("click", function () {
      destEl.value = ""; clearError(); syncDest(); destEl.focus();
    });
    destEl.addEventListener("input", function () { destEl.readOnly = false; clearError(); syncDest(); });

    setStatus("Idle");
    timerEl.textContent = fmt(0);
    syncDest();
  }

  /* --------------------------------------------------------- site stamps */
  function initStamps() {
    qsa("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
    // Decorative "hit counter": shown, but explicitly not real analytics.
    var counter = qs("#hit-counter");
    if (counter) {
      var base = 1998;
      var digits = String(base).padStart(6, "0").split("");
      counter.innerHTML = "";
      digits.forEach(function (d) {
        var s = document.createElement("span");
        s.textContent = d;
        counter.appendChild(s);
      });
      counter.setAttribute("title", "Decorative odometer — not real analytics");
    }
  }

  /* ------------------------------------------------------------- bootstrap */
  function init() {
    initNav();
    initDocNav();
    initCopy();
    initFilter();
    initLobbyDemo();
    initTabs();
    initPhoneDemo();
    initStamps();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
