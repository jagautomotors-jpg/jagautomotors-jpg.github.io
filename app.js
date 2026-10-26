/* Jag Auto Motors — inventory filters and listing. You normally don't need to edit this file. */
(function () {
  "use strict";

  var D = window.DEALER || {};
  var ALL = (window.INVENTORY || []).filter(function (c) { return c.status !== "sold"; });

  var BODY = { suv: "SUV", sedan: "Sedan", truck: "Truck", hatch: "Hatchback", coupe: "Coupe", van: "Van" };
  var PRICE_STEPS = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 75000, 100000];
  var KM_STEPS = [25000, 50000, 75000, 100000, 150000, 200000];

  var state = blank();
  function blank() {
    return { q: "", make: "", model: "", ymin: "", ymax: "", pmin: "", pmax: "", km: "", body: [], sort: "year-desc" };
  }

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Number(n).toLocaleString("en-CA"); }
  function kms(n) { return Number(n).toLocaleString("en-CA") + " km"; }
  function shortMoney(n) { return n >= 1000 ? "$" + (n / 1000) + "k" : money(n); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  function byText(a, b) { return String(a).localeCompare(String(b)); }
  function opt(value, label, selected) {
    return '<option value="' + esc(value) + '"' + (selected ? " selected" : "") + ">" + esc(label) + "</option>";
  }

  /* ---------- Car drawing (used until real photos are added) ---------- */
  var SHAPES = {
    sedan: { b: "M10 64 L12 50 L58 42 L80 24 L130 24 L154 42 L188 47 L190 64 Z", g: "M66 42 L82 29 L104 29 L104 42 Z M109 42 L109 29 L128 29 L145 42 Z" },
    suv:   { b: "M10 64 L11 44 L38 40 L56 20 L154 20 L170 40 L188 43 L190 64 Z", g: "M46 40 L60 25 L98 25 L98 40 Z M103 40 L103 25 L150 25 L162 40 Z" },
    truck: { b: "M8 64 L9 44 L40 40 L58 20 L112 20 L116 40 L192 40 L192 64 Z",   g: "M48 40 L62 25 L84 25 L84 40 Z M89 40 L89 25 L108 25 L110 40 Z" },
    hatch: { b: "M12 64 L14 48 L52 42 L76 22 L150 22 L172 40 L186 46 L188 64 Z", g: "M62 42 L79 27 L110 27 L110 42 Z M115 42 L115 27 L147 27 L165 42 Z" },
    coupe: { b: "M10 64 L13 51 L66 43 L92 27 L128 27 L160 43 L188 48 L190 64 Z", g: "M76 43 L94 31 L122 31 L122 43 Z M126 43 L126 31 L132 31 L150 43 Z" },
    van:   { b: "M10 64 L11 40 L30 36 L44 16 L186 16 L190 40 L190 64 Z",        g: "M38 36 L48 21 L80 21 L80 36 Z M86 36 L86 21 L130 21 L130 36 Z" }
  };
  function art(c) {
    var s = SHAPES[c.body] || SHAPES.sedan;
    var paint = esc(c.colorHex || "#8A9390");
    var wheel = function (x) {
      return '<circle class="art-arch" cx="' + x + '" cy="64" r="16.5"/><circle class="art-tire" cx="' + x +
        '" cy="64" r="13"/><circle class="art-rim" cx="' + x + '" cy="64" r="5.5"/>';
    };
    return '<svg class="art" viewBox="0 0 200 86" role="img" aria-label="' + esc(c.color + " " + (BODY[c.body] || "")) + '">' +
      '<ellipse class="art-floor" cx="100" cy="78" rx="92" ry="5"/>' +
      '<path class="art-body" d="' + s.b + '" fill="' + paint + '" stroke="' + paint + '"/>' +
      '<path class="art-glass" d="' + s.g + '"/>' + wheel(50) + wheel(152) + "</svg>";
  }
  function media(c, cls) {
    if (c.photos && c.photos.length) {
      return '<img class="' + (cls || "") + '" src="' + esc(c.photos[0]) + '" alt="' + esc(c.year + " " + c.make + " " + c.model) + '" loading="lazy">';
    }
    return art(c);
  }

  /* ---------- Filtering ---------- */
  function matches(c, skip) {
    if (skip !== "make" && state.make && c.make !== state.make) return false;
    if (skip !== "model" && state.model && c.model !== state.model) return false;
    if (state.ymin && c.year < +state.ymin) return false;
    if (state.ymax && c.year > +state.ymax) return false;
    if (state.pmin && c.price < +state.pmin) return false;
    if (state.pmax && c.price > +state.pmax) return false;
    if (state.km && c.km > +state.km) return false;
    if (skip !== "body" && state.body.length && state.body.indexOf(c.body) < 0) return false;
    var q = state.q.trim().toLowerCase();
    if (q) {
      var hay = [c.year, c.make, c.model, c.trim, c.color, c.drivetrain, c.fuel, c.transmission, BODY[c.body], c.stock]
        .join(" ").toLowerCase();
      var words = q.split(/\s+/);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
    }
    return true;
  }
  var SORTS = {
    "year-desc": function (a, b) { return b.year - a.year || a.price - b.price; },
    "price-asc": function (a, b) { return a.price - b.price; },
    "price-desc": function (a, b) { return b.price - a.price; },
    "km-asc": function (a, b) { return a.km - b.km; }
  };

  /* ---------- Building the controls ---------- */
  var years = uniq(ALL.map(function (c) { return c.year; })).sort(function (a, b) { return b - a; });

  function countBy(list, key) {
    var out = {};
    list.forEach(function (c) { out[c[key]] = (out[c[key]] || 0) + 1; });
    return out;
  }

  function buildMakeOptions(sel, current) {
    var pool = ALL.filter(function (c) { return matches(c, "make"); });
    var counts = countBy(pool, "make");
    var makes = uniq(ALL.map(function (c) { return c.make; })).sort(byText);
    sel.innerHTML = opt("", "All makes", !current) + makes.map(function (m) {
      return opt(m, m + " (" + (counts[m] || 0) + ")", m === current);
    }).join("");
  }
  function buildModelOptions() {
    var sel = $("f-model");
    if (!state.make) {
      sel.innerHTML = opt("", "Choose a make first", true);
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    var pool = ALL.filter(function (c) { return c.make === state.make && matches(c, "model"); });
    var counts = countBy(pool, "model");
    var models = uniq(ALL.filter(function (c) { return c.make === state.make; }).map(function (c) { return c.model; })).sort(byText);
    sel.innerHTML = opt("", "All " + state.make + " models", !state.model) + models.map(function (m) {
      return opt(m, m + " (" + (counts[m] || 0) + ")", m === state.model);
    }).join("");
  }
  function buildRange(id, values, anyLabel, fmt, current) {
    $(id).innerHTML = opt("", anyLabel, !current) + values.map(function (v) {
      return opt(v, fmt(v), String(v) === String(current));
    }).join("");
  }
  function buildBody() {
    var pool = ALL.filter(function (c) { return matches(c, "body"); });
    var counts = countBy(pool, "body");
    var types = Object.keys(BODY).filter(function (k) { return ALL.some(function (c) { return c.body === k; }); });
    $("f-body").innerHTML = types.map(function (t) {
      var on = state.body.indexOf(t) >= 0;
      return '<input type="checkbox" id="body-' + t + '" value="' + t + '"' + (on ? " checked" : "") + '>' +
        '<label for="body-' + t + '">' + BODY[t] + ' <span class="ct">' + (counts[t] || 0) + "</span></label>";
    }).join("");
  }
  function buildControls() {
    buildMakeOptions($("f-make"), state.make);
    buildModelOptions();
    buildRange("f-ymin", years.slice().reverse(), "From any", String, state.ymin);
    buildRange("f-ymax", years, "To any", String, state.ymax);
    buildRange("f-pmin", PRICE_STEPS, "No min", shortMoney, state.pmin);
    buildRange("f-pmax", PRICE_STEPS, "No max", shortMoney, state.pmax);
    buildRange("f-km", KM_STEPS, "Any kilometres", function (v) { return "Under " + kms(v); }, state.km);
    buildBody();
    if ($("f-q").value !== state.q) $("f-q").value = state.q;
    $("f-sort").value = state.sort;
  }

  /* ---------- Rendering ---------- */
  function card(c) {
    var tag = c.status === "pending" ? '<span class="tag pending">Sale pending</span>' : "";
    return '<li><button class="card" type="button" data-stock="' + esc(c.stock) + '" aria-label="View ' +
      esc(c.year + " " + c.make + " " + c.model + ", " + money(c.price)) + '">' +
      '<div class="media">' + media(c) + tag + '<span class="stockno">' + esc(c.stock) + "</span></div>" +
      '<div class="card-body">' +
        '<h3 class="card-title">' + esc(c.year + " " + c.make + " " + c.model) + "</h3>" +
        '<span class="card-trim">' + esc(c.trim) + "</span>" +
        '<span class="card-specs"><span>' + kms(c.km) + "</span><span>" + esc(c.drivetrain) + "</span><span>" + esc(c.transmission) + "</span></span>" +
        '<span class="card-foot"><span class="price">' + money(c.price) + '</span><span class="view">View details →</span></span>' +
      "</div></button></li>";
  }

  function activeChips() {
    var chips = [];
    if (state.q) chips.push(["q", "“" + state.q + "”"]);
    if (state.make) chips.push(["make", state.make]);
    if (state.model) chips.push(["model", state.model]);
    if (state.ymin || state.ymax) chips.push(["year", (state.ymin || "Any") + " – " + (state.ymax || "Any")]);
    if (state.pmin || state.pmax) chips.push(["price", (state.pmin ? shortMoney(+state.pmin) : "$0") + " – " + (state.pmax ? shortMoney(+state.pmax) : "any")]);
    if (state.km) chips.push(["km", "Under " + kms(state.km)]);
    state.body.forEach(function (b) { chips.push(["body:" + b, BODY[b]]); });
    return chips;
  }

  function render() {
    var list = ALL.filter(function (c) { return matches(c); }).sort(SORTS[state.sort]);
    $("grid").innerHTML = list.map(card).join("");
    $("empty").hidden = list.length > 0;
    $("count").innerHTML = "<strong>" + list.length + "</strong> of " + ALL.length + " vehicles";
    $("filtersDone").textContent = "Show " + list.length + (list.length === 1 ? " car" : " cars");

    var chips = activeChips();
    $("chips").innerHTML = chips.map(function (ch) {
      return '<button class="chip" type="button" data-clear="' + esc(ch[0]) + '">' + esc(ch[1]) +
        ' <span aria-hidden="true">×</span><span class="sr">Remove filter</span></button>';
    }).join("");
    var badge = $("filterBadge");
    badge.hidden = chips.length === 0;
    badge.textContent = chips.length;
  }

  function update() { buildControls(); render(); }

  /* ---------- Events ---------- */
  function onFilterChange(e) {
    var t = e.target;
    switch (t.id) {
      case "f-make": state.make = t.value; state.model = ""; break;
      case "f-model": state.model = t.value; break;
      case "f-ymin": state.ymin = t.value; if (state.ymax && +state.ymin > +state.ymax) state.ymax = ""; break;
      case "f-ymax": state.ymax = t.value; if (state.ymin && +state.ymin > +state.ymax) state.ymin = ""; break;
      case "f-pmin": state.pmin = t.value; if (state.pmax && +state.pmin > +state.pmax) state.pmax = ""; break;
      case "f-pmax": state.pmax = t.value; if (state.pmin && +state.pmin > +state.pmax) state.pmin = ""; break;
      case "f-km": state.km = t.value; break;
      default:
        if (t.type === "checkbox") {
          state.body = Array.prototype.map.call(document.querySelectorAll("#f-body input:checked"), function (i) { return i.value; });
        } else return;
    }
    update();
    var again = document.getElementById(t.id);
    if (again && t.type === "checkbox") again.focus();
  }

  function reset() { var sort = state.sort; state = blank(); state.sort = sort; update(); }

  function clearChip(key) {
    if (key === "year") { state.ymin = ""; state.ymax = ""; }
    else if (key === "price") { state.pmin = ""; state.pmax = ""; }
    else if (key === "make") { state.make = ""; state.model = ""; }
    else if (key.indexOf("body:") === 0) { var b = key.slice(5); state.body = state.body.filter(function (x) { return x !== b; }); }
    else state[key] = "";
    update();
  }

  /* ---------- Detail dialog ---------- */
  var dlg = $("carDialog");
  var lastFocus = null;
  function openCar(stock) {
    var c = ALL.filter(function (x) { return x.stock === stock; })[0];
    if (!c) return;
    lastFocus = document.activeElement;
    $("dlgStock").textContent = "Stock " + c.stock + (c.status === "pending" ? " · Sale pending" : "");
    $("dlgTitle").textContent = c.year + " " + c.make + " " + c.model;
    $("dlgTrim").textContent = c.trim;
    $("dlgPrice").textContent = money(c.price);
    var specs = [
      ["Kilometres", kms(c.km)], ["Body", BODY[c.body]], ["Engine", c.engine], ["Transmission", c.transmission],
      ["Drivetrain", c.drivetrain], ["Fuel", c.fuel], ["Exterior", c.color]
    ].filter(function (r) { return r[1]; });
    $("dlgSpecs").innerHTML = specs.map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
    $("dlgHl").innerHTML = (c.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    $("dlgHl").hidden = !(c.highlights && c.highlights.length);
    $("dlgRef").textContent = "Mention stock " + c.stock + " when you call or email.";

    var m = $("dlgMedia");
    if (c.photos && c.photos.length) {
      m.innerHTML = '<img class="main-photo" id="dlgMain" src="' + esc(c.photos[0]) + '" alt="' + esc(c.year + " " + c.make + " " + c.model) + '">' +
        (c.photos.length > 1 ? '<div class="thumbs">' + c.photos.map(function (p, i) {
          return '<button type="button" data-src="' + esc(p) + '" aria-current="' + (i === 0) + '" aria-label="Photo ' + (i + 1) + '"><img src="' + esc(p) + '" alt=""></button>';
        }).join("") + "</div>" : "");
    } else {
      m.innerHTML = art(c);
    }
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function closeCar() {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  dlg.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) closeCar();
    var th = e.target.closest(".thumbs button");
    if (th) {
      $("dlgMain").src = th.getAttribute("data-src");
      Array.prototype.forEach.call(dlg.querySelectorAll(".thumbs button"), function (b) { b.setAttribute("aria-current", String(b === th)); });
    }
  });
  $("dlgClose").addEventListener("click", closeCar);

  /* ---------- Copy buttons ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".copy");
    if (!btn) return;
    var text = btn.getAttribute("data-copy") === "phone" ? D.phone : D.email;
    var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); };
    var fallback = function () {
      var span = btn.parentNode.querySelector(".v");
      if (!span) return;
      var r = document.createRange(); r.selectNodeContents(span);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = "Selected";
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (err) { fallback(); }
  });

  /* ---------- Wire up ---------- */
  var filters = $("filters");
  filters.addEventListener("change", onFilterChange);
  var qTimer;
  $("f-q").addEventListener("input", function (e) {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { state.q = e.target.value; buildMakeOptions($("f-make"), state.make); buildModelOptions(); buildBody(); render(); }, 150);
  });
  $("f-sort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
  $("grid").addEventListener("click", function (e) {
    var c = e.target.closest(".card");
    if (c) openCar(c.getAttribute("data-stock"));
  });
  $("chips").addEventListener("click", function (e) {
    var c = e.target.closest(".chip");
    if (c) clearChip(c.getAttribute("data-clear"));
  });
  ["resetTop", "resetBottom", "resetEmpty"].forEach(function (id) { $(id).addEventListener("click", reset); });

  function setDrawer(open) {
    document.body.classList.toggle("filters-open", open);
    if (open) $("filtersClose").focus(); else $("filtersOpen").focus();
  }
  $("filtersOpen").addEventListener("click", function () { setDrawer(true); });
  $("filtersClose").addEventListener("click", function () { setDrawer(false); });
  $("filtersDone").addEventListener("click", function () { setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("filters-open")) setDrawer(false);
  });

  // Hero quick search
  var qMake = $("q-make"), qPrice = $("q-price");
  qMake.innerHTML = opt("", "Any make", true) + uniq(ALL.map(function (c) { return c.make; })).sort(byText).map(function (m) { return opt(m, m); }).join("");
  qPrice.innerHTML = opt("", "Any price", true) + PRICE_STEPS.map(function (v) { return opt(v, "Up to " + shortMoney(v)); }).join("");
  $("quickForm").addEventListener("submit", function (e) {
    e.preventDefault();
    state.make = qMake.value; state.model = ""; state.pmax = qPrice.value;
    if (state.pmin && state.pmax && +state.pmin > +state.pmax) state.pmin = "";
    update();
    $("inventory").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Dealer details
  $("headPhone").textContent = D.phone || "";
  $("contactList").innerHTML = [
    ["Phone", D.phone, "phone"], ["Email", D.email, "email"], ["Address", D.address, ""]
  ].filter(function (r) { return r[1]; }).map(function (r) {
    return '<li><span class="k">' + r[0] + '</span><span class="v">' + esc(r[1]) + "</span>" +
      (r[2] ? '<button class="copy" type="button" data-copy="' + r[2] + '">Copy</button>' : "<span></span>") + "</li>";
  }).join("");
  $("hoursBody").innerHTML = (D.hours || []).map(function (h) { return "<tr><td>" + esc(h[0]) + "</td><td>" + esc(h[1]) + "</td></tr>"; }).join("");
  $("dlgPhone").textContent = D.phone || "";
  $("dlgEmail").textContent = D.email || "";
  $("footName").textContent = D.name || "";
  $("footDealer").textContent = D.dealerNo || "";
  $("footYear").textContent = "© " + new Date().getFullYear() + " " + (D.name || "");
  $("sampleNote").hidden = !window.SAMPLE_INVENTORY;

  update();
})();
