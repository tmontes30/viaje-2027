(() => {
  "use strict";

  const D = Object.fromEntries(window.DESTINOS.map(d => [d.id, d]));
  const STORAGE_KEY = "lunaDeMiel.plan.v1";
  const THEME_KEY = "lunaDeMiel.theme";

  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let uidSeq = 0;
  const uid = () => "s" + Date.now().toString(36) + (uidSeq++);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin storage */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* sin storage */ } }
  };

  // ---------------------------------------------------------------- estado
  const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const isTime = s => /^\d{2}:\d{2}$/.test(s);
  function normFlight(f, def) {
    f = f || {};
    return {
      from: f.from == null ? def.from : f.from,
      to: f.to == null ? def.to : f.to,
      date: isDate(f.date) ? f.date : def.date,
      time: isTime(f.time) ? f.time : def.time,
      hours: Math.max(1, Math.min(80, +f.hours || def.hours)),
      price: f.price == null ? def.price : f.price,
      notes: f.notes == null ? def.notes : f.notes
    };
  }

  function normalize(plan) {
    const F = window.VUELOS_DEFAULT;
    const pf = (plan && plan.flights) || {};
    const p = {
      travelers: (plan && +plan.travelers) || 2,
      flights: { out: normFlight(pf.out, F.out), back: normFlight(pf.back, F.back) },
      stops: []
    };
    delete p.flights.back.date; // la fecha de vuelta sale del itinerario
    for (const s of (plan && plan.stops) || []) {
      if (!s || !D[s.id]) continue;
      p.stops.push({
        uid: s.uid || uid(),
        id: s.id,
        nights: Math.max(1, Math.min(60, Math.round(+s.nights) || 1)),
        lodging: s.lodging || "",
        link: s.link || "",
        price: s.price == null ? "" : s.price,
        extra: s.extra == null ? "" : s.extra,
        notes: s.notes || ""
      });
    }
    return p;
  }

  function compact(plan) {
    return {
      travelers: plan.travelers,
      flights: plan.flights,
      stops: plan.stops.map(s => {
        const o = { id: s.id, nights: s.nights };
        for (const k of ["lodging", "link", "price", "extra", "notes"]) if (s[k] !== "" && s[k] != null) o[k] = s[k];
        return o;
      })
    };
  }

  let pendingToast = null;
  function loadInitial() {
    let local = null;
    const raw = store.get(STORAGE_KEY);
    if (raw) { try { local = normalize(JSON.parse(raw)); } catch (e) { local = null; } }

    if (location.hash.startsWith("#plan=") && window.LZString) {
      let shared = null;
      try { shared = JSON.parse(LZString.decompressFromEncodedURIComponent(location.hash.slice(6))); } catch (e) { shared = null; }
      history.replaceState(null, "", location.pathname + location.search);
      if (shared) {
        const sharedN = normalize(shared);
        const same = local && JSON.stringify(compact(local)) === JSON.stringify(compact(sharedN));
        if (!local || same || confirm("Abriste un link con un plan compartido.\n¿Reemplazar el plan guardado en este navegador?")) {
          pendingToast = "Plan cargado desde el link";
          return sharedN;
        }
      }
    }
    if (local) return local;
    return normalize(JSON.parse(JSON.stringify(window.PLAN_SUGERIDO)));
  }

  let state = loadInitial();
  const openEdits = new Set();
  const save = () => store.set(STORAGE_KEY, JSON.stringify(compact(state)));

  // ---------------------------------------------------------------- fechas
  const parseDate = s => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const addDays = (dt, n) => new Date(dt.getTime() + n * 864e5);
  const iso = dt => dt.toISOString().slice(0, 10);
  const fmtShort = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "UTC" });
  const fmtD = dt => fmtShort.format(dt).replace(".", "");

  // Horas "de reloj": se modelan como fechas UTC que representan la hora local de cada lugar.
  const HOUR = 3600e3;
  const TZ_DIFF = window.ZONAS.dest - window.ZONAS.home; // +12 h
  const wall = (dateStr, time) => {
    const [y, m, d] = dateStr.split("-").map(Number), [hh, mm] = time.split(":").map(Number);
    return new Date(Date.UTC(y, m - 1, d, hh, mm));
  };
  const dayOf = dt => new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  function outTimes() {
    const o = state.flights.out;
    const dep = wall(o.date, o.time);
    return { dep, arr: new Date(dep.getTime() + (o.hours + TZ_DIFF) * HOUR) };
  }
  const arrivalDate = () => dayOf(outTimes().arr);
  function backTimes(sched) {
    const b = state.flights.back;
    const end = sched.length ? sched[sched.length - 1].outD : arrivalDate();
    const dep = wall(iso(end), b.time);
    return { dep, arr: new Date(dep.getTime() + (b.hours - TZ_DIFF) * HOUR) };
  }
  const fmtLong = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const fmtTime = dt => dt.toISOString().slice(11, 16);
  const fmtDT = dt => fmtLong.format(dt).replace(/\./g, "") + " " + fmtTime(dt);

  function schedule() {
    let dt = arrivalDate();
    return state.stops.map(s => {
      const inD = dt, outD = addDays(dt, s.nights);
      dt = outD;
      return { inD, outD };
    });
  }

  function monthKey(dt) {
    const m = dt.getUTCMonth();
    return m === 4 ? "may" : m === 5 ? "jun" : null;
  }
  function stayWeather(d, inD, nights) {
    const mid = addDays(inD, Math.floor(nights / 2));
    const k = monthKey(mid);
    return k ? Object.assign({ key: k }, d.weather[k]) : null;
  }
  const RATING = { good: "clima ideal", ok: "clima regular", bad: "mucha lluvia" };

  // ---------------------------------------------------------------- traslados
  const CONN = {};
  for (const c of window.CONEXIONES) { CONN[c.a + "|" + c.b] = c; CONN[c.b + "|" + c.a] = c; }

  function km(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  const legCache = new Map();
  function getLeg(aId, bId) {
    const key = aId + "|" + bId;
    if (legCache.has(key)) return legCache.get(key);
    const a = D[aId], b = D[bId];
    let leg;
    if (aId === bId) leg = { mode: "car", hours: 0, cost: 0, how: "Mismo destino.", known: true };
    else if (CONN[key]) leg = Object.assign({ known: true }, CONN[key]);
    else if (a.country !== b.country) {
      const I = window.CONEXION_INTERNACIONAL;
      leg = { mode: "flight", hours: I.baseHours + a.gateway + b.gateway, cost: I.cost, how: I.how, known: true, intl: true };
    } else {
      const dist = km(a, b);
      if (a.island === b.island) leg = { mode: "car", hours: dist / 30 + 0.3, cost: 20, how: "Estimado: auto con chofer." };
      else if (dist < 250) leg = { mode: "boat", hours: dist / 25 + 2.5, cost: 40, how: "Estimado: no cargamos una conexión directa, revisar fast boats o combinación barco + auto." };
      else leg = { mode: "flight", hours: 3 + dist / 600, cost: 130, how: "Estimado: probablemente vuelo con escala (Manila, Cebu o Bali)." };
      leg.known = false;
    }
    legCache.set(key, leg);
    return leg;
  }

  function fmtH(h) {
    if (h < 1) return Math.round(h * 60 / 5) * 5 + " min";
    return (Math.round(h * 2) / 2).toString().replace(".", ",") + " h";
  }
  const MODE_LABEL = { flight: "Vuelo", boat: "Barco", car: "Auto" };
  const MODE_ICON = {
    flight: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    boat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 15l1.5-5H11V4h2l5 6h2.5L19 15H4zm-2 2h20c-1 2-2.5 3-4 3-1.2 0-2.2-.6-3-1.5-.8.9-1.8 1.5-3 1.5s-2.2-.6-3-1.5C8.2 19.4 7.2 20 6 20c-1.5 0-3-1-4-3z"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11a2 2 0 0 1 2 2v4h-2v2h-3v-2H8v2H5v-2H3v-4a2 2 0 0 1 2-2zm2.1 0h9.8l-1-3H8.1l-1 3zM6.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>'
  };

  // ---------------------------------------------------------------- optimizador
  // Costo = horas de traslado + llegar/salir por el aeropuerto internacional,
  // penaliza hacer Filipinas después de Indonesia (monzón) y premia terminar en playa cerca del aeropuerto.
  function routeCost(ids) {
    if (!ids.length) return 0;
    const last = D[ids[ids.length - 1]];
    let c = D[ids[0]].gateway + last.gateway;
    let seenID = false;
    for (let i = 0; i < ids.length; i++) {
      if (i > 0) c += getLeg(ids[i - 1], ids[i]).hours;
      const country = D[ids[i]].country;
      if (country === "Indonesia") seenID = true;
      else if (seenID) c += 50;
    }
    if (last.endFriendly) c -= 1.5;
    return c;
  }

  function optimizeOrder(stops) {
    const ids = stops.map(s => s.id);
    const n = ids.length;
    const before = routeCost(ids);
    if (n < 2) return { order: [0], before, after: before };
    // las escalas de tránsito (ej. Manila al llegar) van siempre primero; el resto se permuta
    const all = stops.map((_, i) => i);
    const fixed = all.filter(i => D[ids[i]].kind === "transito");
    const free = all.filter(i => D[ids[i]].kind !== "transito");
    const f = fixed.length, m = free.length;
    const costOf = idx => routeCost(idx.map(i => ids[i]));
    let best = fixed.concat(free);
    let bestC = costOf(best);

    if (m <= 8) {
      // Heap's algorithm sobre la parte libre
      const a = free.slice(), c = new Array(m).fill(0);
      let i = 0;
      while (i < m) {
        if (c[i] < i) {
          const j = i % 2 ? c[i] : 0;
          [a[j], a[i]] = [a[i], a[j]];
          const cand = fixed.concat(a);
          const cost = costOf(cand);
          if (cost < bestC - 1e-9) { bestC = cost; best = cand; }
          c[i]++; i = 0;
        } else { c[i] = 0; i++; }
      }
    } else {
      // búsqueda local: mover un destino o invertir un tramo mientras mejore
      let improved = true;
      while (improved) {
        improved = false;
        for (let i = f; i < n && !improved; i++) {
          for (let j = f; j < n && !improved; j++) {
            if (i === j) continue;
            const moved = best.slice(); const [x] = moved.splice(i, 1); moved.splice(j, 0, x);
            const cm = costOf(moved);
            if (cm < bestC - 1e-9) { best = moved; bestC = cm; improved = true; break; }
            if (j > i) {
              const rev = best.slice(0, i).concat(best.slice(i, j + 1).reverse(), best.slice(j + 1));
              const cr = costOf(rev);
              if (cr < bestC - 1e-9) { best = rev; bestC = cr; improved = true; }
            }
          }
        }
      }
    }
    return { order: best, before, after: bestC };
  }

  function bestInsertIndex(id) {
    const ids = state.stops.map(s => s.id);
    let bestI = ids.length, bestC = Infinity;
    for (let i = 0; i <= ids.length; i++) {
      const c = routeCost(ids.slice(0, i).concat(id, ids.slice(i)));
      if (c < bestC - 1e-9) { bestC = c; bestI = i; }
    }
    return bestI;
  }

  // ---------------------------------------------------------------- avisos
  function computeWarnings(sched) {
    const w = [];
    const s = state.stops;
    if (!s.length) return [{ lvl: "ok", t: "Todavía no hay destinos. Agregá lugares desde la pestaña Explorar." }];
    const year = arrivalDate().getUTCFullYear();
    const arrH = outTimes().arr.getUTCHours();
    if (arrH < 11) w.push({ lvl: "good", t: `Tip: llegan a ${asiaAirport("out")} a las ${fmtTime(outTimes().arr)}: conviene reservar el hotel desde la noche anterior (o pedir early check-in) para dormir apenas lleguen.` });
    const monsoon = Date.UTC(year, 5, 15);
    let seenID = false, orderWarned = false;

    s.forEach((st, i) => {
      const d = D[st.id], { inD, outD } = sched[i];
      if (d.country === "Indonesia") seenID = true;
      else if (seenID && !orderWarned) {
        orderWarned = true;
        w.push({ lvl: "bad", t: "Conviene hacer Filipinas primero: en junio empieza el monzón allá, mientras que Indonesia sigue seca." });
      }
      if (d.kind !== "transito") {
        const wx = stayWeather(d, inD, st.nights);
        if (d.country === "Filipinas" && d.id !== "siargao" && outD.getTime() > monsoon) {
          w.push({ lvl: "bad", t: `${d.name}: se quedan hasta el ${fmtD(outD)}, ya con el monzón (desde mediados de junio hay más lluvia y tours cancelados). Mejor ir antes.` });
        } else if (!wx) {
          w.push({ lvl: "ok", t: `${d.name}: cae fuera de mayo/junio y no hay datos de clima cargados para esa fecha.` });
        } else if (wx.rating === "bad") {
          w.push({ lvl: "bad", t: `${d.name}: ${wx.note}` });
        } else if (wx.rating === "ok" && d.country === "Filipinas") {
          w.push({ lvl: "ok", t: `${d.name}: ${wx.note}` });
        }
      }
      if (st.nights < d.nights[0]) w.push({ lvl: "ok", t: `${d.name}: ${st.nights} noche${st.nights > 1 ? "s" : ""} queda corto (recomendado ${d.nights[0]}–${d.nights[1]}).` });
      else if (st.nights > d.nights[1] + 2) w.push({ lvl: "ok", t: `${d.name}: ${st.nights} noches es bastante (recomendado ${d.nights[0]}–${d.nights[1]}). ¿Quizás sumar otro destino?` });

      if (i > 0) {
        const leg = getLeg(s[i - 1].id, st.id);
        const a = D[s[i - 1].id];
        if (!leg.known) w.push({ lvl: "ok", t: `${a.name} → ${d.name}: tramo estimado, no hay conexión directa cargada. Revisar cómo llegar.` });
        else if (leg.hours >= 6 && !leg.intl) w.push({ lvl: "ok", t: `${a.name} → ${d.name}: tramo largo (~${fmtH(leg.hours)}).` });
      }
    });

    const total = s.reduce((a, b) => a + b.nights, 0);
    if (total > 31) w.push({ lvl: "ok", t: `Son ${total} noches: más de lo que pensaban (25-30).` });

    const ids = new Set(s.map(x => x.id));
    if (ids.has("lembongan") && ids.has("penida")) w.push({ lvl: "good", t: "Tip: Nusa Penida se puede hacer como excursión de un día desde Lembongan, sin cambiar de hotel." });
    if (ids.has("gilit") && !ids.has("giliair") && !ids.has("gilimeno")) w.push({ lvl: "good", t: "Tip: para luna de miel, Gili Air o Gili Meno son más tranquilas que Gili T." });

    if (!w.some(x => x.lvl !== "good")) w.unshift({ lvl: "good", t: "Todo en orden: el clima acompaña en todas las paradas y los traslados cierran." });
    return w;
  }

  // ---------------------------------------------------------------- render: panel
  function renderStats(sched) {
    const total = state.stops.reduce((a, b) => a + b.nights, 0);
    const depDay = parseDate(state.flights.out.date);
    const home = dayOf(backTimes(sched).arr);
    $("#statNights").textContent = total;
    $("#statDays").textContent = Math.round((home - depDay) / 864e5);
    $("#statEnd").textContent = fmtD(home);
    $("#departDate").value = state.flights.out.date;

    const today = new Date(); const t0 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((depDay.getTime() - t0) / 864e5);
    $("#countdown").textContent = days > 1 ? `faltan ${days} días` : days >= 0 ? "¡ya casi!" : "¡buen viaje!";
  }

  function renderWarnings(sched) {
    const ICON = { bad: "⚠️", ok: "💡", good: "✅" };
    $("#warnings").innerHTML = computeWarnings(sched)
      .map(w => `<div class="warn ${w.lvl}"><b>${ICON[w.lvl]}</b><span>${esc(w.t)}</span></div>`).join("");
  }

  function legHtml(aId, bId) {
    const leg = getLeg(aId, bId);
    const long = leg.hours >= 6 && !leg.intl ? " long" : "";
    return `<li class="leg ${leg.mode}${long}" aria-hidden="false">
      <span class="mode">${MODE_ICON[leg.mode]}</span>
      <div><strong>${MODE_LABEL[leg.mode]} · ~${fmtH(leg.hours)}</strong> · ~US$${leg.cost} p/p${leg.known ? "" : " (estimado)"}
      <span class="how">${esc(leg.how)}</span></div></li>`;
  }

  function editHtml(s) {
    const f = (field, label, type, ph, cls) => `<label class="${cls || ""}">${label}
      <input type="${type}" data-field="${field}" value="${esc(s[field])}" placeholder="${esc(ph)}" ${type === "number" ? 'min="0" step="1" inputmode="decimal"' : ""}></label>`;
    return `<div class="stop-edit">
      ${f("lodging", "Alojamiento", "text", "Nombre del hotel", "full")}
      ${f("link", "Link (Booking, Airbnb, web)", "url", "https://…", "full")}
      ${f("price", "US$ por noche (habitación)", "number", "0")}
      ${f("extra", "Extras / actividades (US$)", "number", "0")}
      <label class="full">Notas<textarea data-field="notes" placeholder="Tours, restaurantes, ideas…">${esc(s.notes)}</textarea></label>
    </div>`;
  }

  // aeropuerto en Asia: el que escribieron, o el del país del primer/último destino
  function asiaAirport(kind) {
    const f = state.flights[kind];
    const typed = kind === "out" ? f.to : f.from;
    if (typed) return typed;
    const s = kind === "out" ? state.stops[0] : state.stops[state.stops.length - 1];
    return s ? (window.AEROPUERTOS[D[s.id].country] || D[s.id].name) : "—";
  }

  function flightHtml(kind, sched) {
    const f = state.flights[kind];
    const from = kind === "out" ? f.from : asiaAirport("back");
    const to = kind === "out" ? asiaAirport("out") : f.to;
    const { dep, arr } = kind === "out" ? outTimes() : backTimes(sched);
    const open = openEdits.has("flight-" + kind);
    const clock = (arr - dep) / HOUR; // diferencia en hora local
    const why = kind === "out"
      ? `El vuelo dura ${fmtH(f.hours)}, pero por la diferencia horaria (${window.ZONAS.destName}: +${TZ_DIFF} h respecto de ${window.ZONAS.homeName}) llegan ${fmtH(clock)} después según el reloj.`
      : `El vuelo dura ${fmtH(f.hours)}, pero por la diferencia horaria llegan solo ${fmtH(clock)} después según el reloj: "ganan" ${TZ_DIFF} h.`;
    const inp = (field, label, type, cls, extra) => `<label class="${cls || ""}">${label}
      <input type="${type}" data-ffield="${field}" value="${esc(f[field])}" ${extra || ""}></label>`;
    const autoPh = kind === "out" ? `placeholder="Automático: ${esc(asiaAirport("out"))}"` : `placeholder="Automático: ${esc(asiaAirport("back"))}"`;
    return `<li class="flight-card" data-flight="${kind}">
      <div class="stop-head">
        <span class="num plane">${MODE_ICON.flight}</span>
        <div class="stop-title">
          <h3>${kind === "out" ? "Vuelo de ida" : "Vuelo de vuelta"}</h3>
          <div class="dates">${esc(from)} → ${esc(to)}</div>
        </div>
        <button class="linkish" data-act="fedit">${open ? "Listo" : "Editar"}</button>
      </div>
      <div class="flight-times">
        <div><small>Sale (hora local)</small><strong>${fmtDT(dep)}</strong></div>
        <div><small>Llega (hora local)</small><strong>${fmtDT(arr)}</strong></div>
      </div>
      <div class="stop-meta">
        <span class="pill">✈ ${fmtH(f.hours)} de viaje</span>
        ${f.price !== "" ? `<span class="pill">US$ ${esc(f.price)} p/p</span>` : ""}
        <span class="flight-why">${esc(why)}</span>
      </div>
      ${open ? `<div class="stop-edit">
        ${inp("from", "Desde", "text", "", kind === "back" ? autoPh : "")}
        ${inp("to", "Hasta", "text", "", kind === "out" ? autoPh : "")}
        ${kind === "out" ? inp("date", "Fecha de salida", "date") : `<label>Fecha de salida<input type="text" value="${esc(fmtD(dep))} (último día del itinerario)" disabled></label>`}
        ${inp("time", "Hora de salida", "time")}
        ${inp("hours", "Duración total (h, con escalas)", "number", "", 'min="1" max="80" step="0.5"')}
        ${inp("price", "Precio US$ por persona", "number", "", 'min="0" step="1"')}
        <label class="full">Notas / aerolínea<textarea data-ffield="notes">${esc(f.notes)}</textarea></label>
      </div>` : ""}
    </li>`;
  }

  function renderList(sched) {
    const html = [flightHtml("out", sched)];
    state.stops.forEach((s, i) => {
      const d = D[s.id], { inD, outD } = sched[i];
      if (i > 0) html.push(legHtml(state.stops[i - 1].id, s.id));
      const wx = stayWeather(d, inD, s.nights);
      const open = openEdits.has(s.uid);
      html.push(`<li class="stop" data-uid="${s.uid}" data-country="${esc(d.country)}">
        <div class="stop-head">
          <span class="num" title="Arrastrar para reordenar">${i + 1}</span>
          <div class="stop-title">
            <h3 data-act="detail">${esc(d.name)}</h3>
            <div class="dates">${fmtD(inD)} → ${fmtD(outD)} · ${esc(d.country)}</div>
          </div>
          <div class="stepper">
            <button data-act="minus" aria-label="Una noche menos">−</button>
            <div class="n"><strong>${s.nights}</strong>noche${s.nights > 1 ? "s" : ""}</div>
            <button data-act="plus" aria-label="Una noche más">+</button>
          </div>
        </div>
        <div class="stop-meta">
          ${wx ? `<span class="pill ${wx.rating}">${RATING[wx.rating]}</span>` : ""}
          ${s.lodging ? `<span class="pill">🏨 ${s.link ? `<a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.lodging)}</a>` : esc(s.lodging)}</span>` : ""}
          ${s.price !== "" ? `<span class="pill">US$ ${esc(s.price)}/noche</span>` : ""}
          <div class="stop-tools">
            <button data-act="up" title="Subir" ${i === 0 ? "disabled" : ""}>↑</button>
            <button data-act="down" title="Bajar" ${i === state.stops.length - 1 ? "disabled" : ""}>↓</button>
            <button data-act="edit">${open ? "Listo" : "Editar"}</button>
            <button data-act="remove" title="Quitar">✕</button>
          </div>
        </div>
        ${open ? editHtml(s) : ""}
      </li>`);
    });
    html.push(flightHtml("back", sched));
    $("#stopList").innerHTML = html.join("");
  }

  const money = n => "US$ " + Math.round(n).toLocaleString("es-AR");
  function renderBudget() {
    let lodging = 0, priced = 0, extras = 0, transport = 0;
    state.stops.forEach((s, i) => {
      const p = parseFloat(s.price);
      if (!isNaN(p)) { lodging += p * s.nights; priced++; }
      const e = parseFloat(s.extra);
      if (!isNaN(e)) extras += e;
      if (i > 0) transport += getLeg(state.stops[i - 1].id, s.id).cost * state.travelers;
    });
    const fp = k => { const v = parseFloat(state.flights[k].price); return isNaN(v) ? 0 : v; };
    const flights = (fp("out") + fp("back")) * state.travelers;
    $("#budget").innerHTML = `<h3>Presupuesto</h3>
      <div class="row"><span>Vuelos Santiago ⇄ Asia (×${state.travelers})</span><span>${money(flights)}</span></div>
      <div class="row"><span>Alojamiento <small>(${priced}/${state.stops.length} con precio)</small></span><span>${money(lodging)}</span></div>
      <div class="row"><span>Traslados entre destinos (est. ×${state.travelers})</span><span>${money(transport)}</span></div>
      <div class="row"><span>Extras / actividades</span><span>${money(extras)}</span></div>
      <div class="row total"><span>Total</span><span>${money(flights + lodging + transport + extras)}</span></div>
      <p class="note">Precios de vuelos y traslados estimados: editalos cuando tengan cotizaciones reales. Tocá “Editar” en cada destino para cargar alojamiento y precios.</p>`;
  }

  // ---------------------------------------------------------------- render: explorar / clima / tips
  const FILTERS = [
    { k: "all", label: "Todos", fn: () => true },
    { k: "rec", label: "Recomendados", fn: d => d.kind === "base" },
    { k: "ph", label: "Filipinas", fn: d => d.country === "Filipinas" },
    { k: "bali", label: "Bali", fn: d => d.island === "bali" },
    { k: "nusa", label: "Nusa", fn: d => d.island === "nusa" },
    { k: "lg", label: "Lombok y Gilis", fn: d => d.island === "gili" || d.island === "lombok" },
    { k: "komodo", label: "Komodo", fn: d => d.island === "flores" }
  ];
  const nightsRec = d => d.nights[0] === d.nights[1]
    ? d.nights[0] + " noche" + (d.nights[0] > 1 ? "s" : "") + " sugerida" + (d.nights[0] > 1 ? "s" : "")
    : d.nights[0] + "–" + d.nights[1] + " noches sugeridas";
  const KIND = { base: "Recomendado", opcional: "Opcional", extra: "Extra", transito: "Escala" };
  let filter = "all";

  const wxPill = (d, k) => `<span class="pill ${d.weather[k].rating}">${k === "may" ? "May" : "Jun"}: ${RATING[d.weather[k].rating]}</span>`;

  function renderExplore() {
    $("#exploreFilters").innerHTML = FILTERS.map(f =>
      `<button class="chip ${f.k === filter ? "active" : ""}" data-filter="${f.k}">${f.label}</button>`).join("");
    const inPlan = new Set(state.stops.map(s => s.id));
    const fn = FILTERS.find(f => f.k === filter).fn;
    $("#exploreList").innerHTML = window.DESTINOS.filter(fn).map(d => `
      <div class="card ${inPlan.has(d.id) ? "in-plan" : ""}" data-id="${d.id}">
        <div class="card-top"><h3>${esc(d.name)}</h3><span class="kind ${d.kind}">${KIND[d.kind]}</span></div>
        <div class="region">${esc(d.country)} · ${nightsRec(d)}</div>
        <p>${esc(d.verdict)}</p>
        <div class="card-foot">
          ${wxPill(d, "may")}${wxPill(d, "jun")}
          <span class="spacer"></span>
          <button class="btn small" data-act="detail">Ver ficha</button>
          <button class="btn small ${inPlan.has(d.id) ? "" : "primary"}" data-act="add">${inPlan.has(d.id) ? "✓ En el plan" : "+ Agregar"}</button>
        </div>
      </div>`).join("");
  }

  function renderClima() {
    const bar = w => `<div class="rainbar ${w.rating}"><i style="width:${Math.max(4, Math.round(w.rain / 300 * 70))}px"></i><span>${w.rain} mm · ${w.days} d</span></div>`;
    const rows = [];
    for (const country of ["Filipinas", "Indonesia"]) {
      rows.push(`<tr class="group"><td colspan="3">${country}</td></tr>`);
      for (const d of window.DESTINOS.filter(x => x.country === country)) {
        rows.push(`<tr><td class="name">${esc(d.name)}</td><td>${bar(d.weather.may)}</td><td>${bar(d.weather.jun)}</td></tr>`);
      }
    }
    $("#climaTable").innerHTML = `<table class="clima"><thead><tr><th>Destino</th><th>Mayo</th><th>Junio</th></tr></thead><tbody>${rows.join("")}</tbody></table>
      <p class="hint" style="margin-top:10px">Verde: ideal · Amarillo: lluvias o mar picado posibles · Rojo: temporada de lluvias. Valores promedio aproximados.</p>`;
  }

  function renderTips() {
    $("#tipsList").innerHTML = window.TIPS.map(t => `<div class="tip"><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></div>`).join("");
  }

  // ---------------------------------------------------------------- mapa
  const map = L.map("map", { zoomControl: true, worldCopyJump: true }).setView([2, 118], 5);
  let tiles = null;
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t === "dark" || (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  };
  // Teselas de Esri: no requieren API key (funcionan también abriendo el archivo local)
  function setTiles() {
    if (tiles) map.removeLayer(tiles);
    const esri = p => `https://server.arcgisonline.com/ArcGIS/rest/services/${p}/MapServer/tile/{z}/{y}/{x}`;
    const opts = { maxZoom: 16, attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, OpenStreetMap" };
    tiles = isDark()
      ? L.layerGroup([L.tileLayer(esri("Canvas/World_Dark_Gray_Base"), opts), L.tileLayer(esri("Canvas/World_Dark_Gray_Reference"), opts)])
      : L.tileLayer(esri("World_Topo_Map"), opts);
    tiles.addTo(map);
  }

  const catalogLayer = L.layerGroup().addTo(map);
  const routeLayer = L.layerGroup().addTo(map);
  const planLayer = L.layerGroup().addTo(map);
  const markerById = {};
  const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function curve(a, b) {
    const [x1, y1] = a, [x2, y2] = b;
    const cx = (x1 + x2) / 2 - (y2 - y1) * 0.18, cy = (y1 + y2) / 2 + (x2 - x1) * 0.18;
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, u = 1 - t;
      pts.push([u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]);
    }
    return pts;
  }

  function popupHtml(d, inPlan) {
    return `<div class="popup"><h3>${esc(d.name)}</h3><p>${esc(d.verdict)}</p>
      <div class="row"><button class="btn small" data-pop="detail" data-id="${d.id}">Ver ficha</button>
      ${inPlan ? "" : `<button class="btn small primary" data-pop="add" data-id="${d.id}">+ Agregar</button>`}</div></div>`;
  }

  function renderMap(fit) {
    catalogLayer.clearLayers(); routeLayer.clearLayers(); planLayer.clearLayers();
    const inPlan = {};
    state.stops.forEach((s, i) => (inPlan[s.id] = inPlan[s.id] || []).push(i + 1));
    const muted = cssVar("--muted");

    for (const d of window.DESTINOS) {
      if (inPlan[d.id]) continue;
      const m = L.circleMarker([d.lat, d.lng], { radius: 7, color: muted, weight: 2, fillColor: muted, fillOpacity: .35 })
        .bindTooltip(d.name, { direction: "top", offset: [0, -6] })
        .bindPopup(popupHtml(d, false), { maxWidth: 260 })
        .addTo(catalogLayer);
      markerById[d.id] = m;
    }

    const colors = { flight: cssVar("--flight"), boat: cssVar("--boat"), car: cssVar("--car") };
    for (let i = 1; i < state.stops.length; i++) {
      const a = D[state.stops[i - 1].id], b = D[state.stops[i].id];
      if (a.id === b.id) continue;
      const leg = getLeg(a.id, b.id);
      const pts = leg.mode === "flight" ? curve([a.lat, a.lng], [b.lat, b.lng]) : [[a.lat, a.lng], [b.lat, b.lng]];
      L.polyline(pts, {
        color: colors[leg.mode], weight: 3, opacity: .9,
        dashArray: leg.mode === "flight" ? "6 8" : null
      }).bindTooltip(`${a.name} → ${b.name}: ${MODE_LABEL[leg.mode]} ~${fmtH(leg.hours)}`, { sticky: true }).addTo(routeLayer);
    }

    for (const id of Object.keys(inPlan)) {
      const d = D[id];
      const icon = L.divIcon({
        className: "", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28],
        html: `<div class="pin ${d.country === "Filipinas" ? "ph" : ""}"><b>${inPlan[id].join("·")}</b></div>`
      });
      const m = L.marker([d.lat, d.lng], { icon, riseOnHover: true })
        .bindTooltip(d.name, { permanent: true, direction: "right", offset: [12, -16], className: "pin-label" })
        .bindPopup(popupHtml(d, true), { maxWidth: 260 })
        .addTo(planLayer);
      markerById[id] = m;
    }

    if (fit && state.stops.length) {
      const b = L.latLngBounds(state.stops.map(s => [D[s.id].lat, D[s.id].lng]));
      map.fitBounds(b, { padding: [50, 50], maxZoom: 10 });
    }
  }

  // ---------------------------------------------------------------- ficha
  const dlg = $("#detail");
  function openDetail(id) {
    const d = D[id];
    const sched = schedule();
    const idx = state.stops.findIndex(s => s.id === id);
    const dates = idx >= 0 ? sched[idx] : null;
    const q = encodeURIComponent;
    const bookingParams = dates ? `&checkin=${iso(dates.inD)}&checkout=${iso(dates.outD)}&group_adults=2&no_rooms=1` : "&group_adults=2";
    const airbnbParams = dates ? `?checkin=${iso(dates.inD)}&checkout=${iso(dates.outD)}&adults=2` : "?adults=2";
    const place = d.name + ", " + d.country;
    const wx = k => {
      const w = d.weather[k];
      return `<div class="${w.rating}"><strong>${k === "may" ? "Mayo" : "Junio"} · ${RATING[w.rating]}</strong>
        <small>${w.rain} mm · ${w.days} días de lluvia · ${w.temp}°C</small><p>${esc(w.note)}</p></div>`;
    };
    dlg.innerHTML = `
      <div class="detail-head">
        <h2>${esc(d.name)}</h2>
        <div class="region">${esc(d.country)} · ${KIND[d.kind]} · ${nightsRec(d)}${dates ? ` · En el plan: ${fmtD(dates.inD)} → ${fmtD(dates.outD)}` : ""}</div>
        <button class="close" data-act="close" aria-label="Cerrar">×</button>
      </div>
      <div class="detail-body">
        <div class="verdict">${esc(d.verdict)}</div>
        <p>${esc(d.desc)}</p>
        <h4>Clima</h4>
        <div class="wx">${wx("may")}${wx("jun")}</div>
        <h4>Qué hacer</h4>
        <ul>${d.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
        <h4>Dónde dormir</h4>
        <ul>${d.zonas.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
        <h4>Alojamientos sugeridos</h4>
        ${d.lodging.map(l => `<div class="lodge">
          <div><span class="lvl">${l.level}</span> <strong>${esc(l.name)}</strong><small>${esc(l.note)}</small></div>
          <div class="lodge-links">
            <a href="https://www.google.com/maps/search/?api=1&query=${q(l.name + " " + place)}" target="_blank" rel="noopener">Mapa</a>
            <a href="https://www.booking.com/searchresults.html?ss=${q(l.name)}${bookingParams}" target="_blank" rel="noopener">Booking</a>
            ${idx >= 0 ? `<button class="btn small" data-act="uselodge" data-name="${esc(l.name)}">Elegir</button>` : ""}
          </div></div>`).join("")}
        <p style="font-size:13px;margin-top:10px">Buscar más:
          <a href="https://www.booking.com/searchresults.html?ss=${q(place)}${bookingParams}" target="_blank" rel="noopener">Booking</a> ·
          <a href="https://www.airbnb.com/s/${q(place)}/homes${airbnbParams}" target="_blank" rel="noopener">Airbnb</a> ·
          <a href="https://www.google.com/maps/search/?api=1&query=${q(place)}" target="_blank" rel="noopener">Google Maps</a>
        </p>
        <div class="detail-actions">
          ${idx >= 0
            ? `<button class="btn" data-act="remove">Quitar del plan</button>`
            : `<button class="btn primary" data-act="add">+ Agregar al plan</button>`}
          <button class="btn" data-act="map">Ver en el mapa</button>
        </div>
      </div>`;
    dlg.dataset.id = id;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  dlg.addEventListener("click", e => {
    if (e.target === dlg) return dlg.close();
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = dlg.dataset.id;
    const act = btn.dataset.act;
    if (act === "close") dlg.close();
    else if (act === "add") { addStop(id); openDetail(id); }
    else if (act === "remove") {
      const i = state.stops.map(s => s.id).lastIndexOf(id);
      if (i >= 0) removeStop(state.stops[i].uid);
      openDetail(id);
    } else if (act === "map") { dlg.close(); focusOnMap(id); }
    else if (act === "uselodge") {
      const s = state.stops.find(x => x.id === id);
      if (s) {
        s.lodging = btn.dataset.name; openEdits.add(s.uid);
        commit(); toast(`Alojamiento elegido para ${D[id].name}. Cargá el precio en “Editar”.`);
      }
    }
  });

  function focusOnMap(id) {
    const d = D[id];
    if (window.matchMedia("(max-width: 860px)").matches) window.scrollTo({ top: 0, behavior: "smooth" });
    map.flyTo([d.lat, d.lng], Math.max(map.getZoom(), 9), { duration: .8 });
    const m = markerById[id];
    if (m) setTimeout(() => m.openPopup(), 850);
  }

  // ---------------------------------------------------------------- acciones
  function commit(fit) {
    save();
    const sched = schedule();
    renderStats(sched);
    renderWarnings(sched);
    renderList(sched);
    renderBudget();
    renderExplore();
    renderMap(fit);
  }

  function addStop(id) {
    const d = D[id];
    const at = bestInsertIndex(id);
    const nights = d.nights[1] === d.nights[0] ? d.nights[0] : Math.round((d.nights[0] + d.nights[1]) / 2);
    state.stops.splice(at, 0, { uid: uid(), id, nights, lodging: "", link: "", price: "", extra: "", notes: "" });
    commit(true);
    toast(`${d.name} agregado en la posición ${at + 1} (la que menos traslados suma).`);
  }
  function removeStop(u) {
    const i = state.stops.findIndex(s => s.uid === u);
    if (i < 0) return;
    const [s] = state.stops.splice(i, 1);
    openEdits.delete(u);
    commit();
    toast(`${D[s.id].name} quitado del plan.`);
  }
  function moveStop(u, to) {
    const i = state.stops.findIndex(s => s.uid === u);
    if (i < 0 || to < 0 || to >= state.stops.length || i === to) return;
    const [s] = state.stops.splice(i, 1);
    state.stops.splice(to, 0, s);
    commit();
  }

  function optimize() {
    const { order, before, after } = optimizeOrder(state.stops);
    const changed = order.some((v, i) => v !== i);
    if (!changed) return toast("El recorrido ya está optimizado 👌");
    state.stops = order.map(i => state.stops[i]);
    commit(true);
    const saved = before - after;
    toast(saved >= 0.5 && saved < 40 ? `Recorrido optimizado: ~${fmtH(saved)} menos de traslados.` : "Recorrido optimizado.");
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // lista: clicks
  $("#stopList").addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    const fl = e.target.closest(".flight-card");
    if (btn && fl && btn.dataset.act === "fedit") {
      const k = "flight-" + fl.dataset.flight;
      if (openEdits.has(k)) openEdits.delete(k); else openEdits.add(k);
      return commit();
    }
    const li = e.target.closest(".stop");
    if (!btn || !li) return;
    const u = li.dataset.uid;
    const s = state.stops.find(x => x.uid === u);
    const i = state.stops.indexOf(s);
    switch (btn.dataset.act) {
      case "plus": s.nights = Math.min(60, s.nights + 1); commit(); break;
      case "minus": s.nights = Math.max(1, s.nights - 1); commit(); break;
      case "up": moveStop(u, i - 1); break;
      case "down": moveStop(u, i + 1); break;
      case "remove": removeStop(u); break;
      case "detail": openDetail(s.id); break;
      case "edit":
        if (openEdits.has(u)) openEdits.delete(u); else openEdits.add(u);
        commit();
        if (openEdits.has(u)) { const inp = $(`.stop[data-uid="${u}"] input`); if (inp) inp.focus(); }
        break;
    }
  });
  // lista: edición de campos
  // vuelos: texto y precio se guardan al tipear; fecha/hora/duración recalculan todo al confirmar
  const FLIGHT_SCHEDULE_FIELDS = ["date", "time", "hours"];
  function setFlightField(el) {
    const fl = el.closest(".flight-card");
    const field = el.dataset.ffield;
    const f = state.flights[fl.dataset.flight];
    if (field === "date" && !isDate(el.value)) return false;
    if (field === "time" && !isTime(el.value)) return false;
    if (field === "hours") { const h = parseFloat(el.value); if (!(h >= 1 && h <= 80)) return false; f.hours = h; }
    else f[field] = el.value;
    return true;
  }
  $("#stopList").addEventListener("change", e => {
    if (FLIGHT_SCHEDULE_FIELDS.includes(e.target.dataset.ffield) && setFlightField(e.target)) commit();
  });
  $("#stopList").addEventListener("input", e => {
    const ff = e.target.dataset.ffield;
    if (ff) {
      if (!FLIGHT_SCHEDULE_FIELDS.includes(ff) && setFlightField(e.target)) { save(); renderBudget(); }
      return;
    }
    const f = e.target.dataset.field;
    const li = e.target.closest(".stop");
    if (!f || !li) return;
    const s = state.stops.find(x => x.uid === li.dataset.uid);
    s[f] = e.target.value;
    save();
    renderBudget();
  });

  // lista: drag & drop (desde el número)
  let dragUid = null;
  const list = $("#stopList");
  list.addEventListener("mousedown", e => {
    const h = e.target.closest(".stop .num");
    if (h) h.closest(".stop").draggable = true;
  });
  list.addEventListener("dragstart", e => {
    const li = e.target.closest(".stop");
    if (!li) return;
    dragUid = li.dataset.uid;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", dragUid); } catch (err) { /* IE */ }
  });
  list.addEventListener("dragover", e => {
    if (!dragUid) return;
    e.preventDefault();
    list.querySelectorAll(".drop-before").forEach(x => x.classList.remove("drop-before"));
    const li = e.target.closest(".stop");
    if (li && li.dataset.uid !== dragUid) li.classList.add("drop-before");
  });
  list.addEventListener("drop", e => {
    e.preventDefault();
    const li = e.target.closest(".stop");
    if (!dragUid || !li) return;
    const from = state.stops.findIndex(s => s.uid === dragUid);
    let to = state.stops.findIndex(s => s.uid === li.dataset.uid);
    const rect = li.getBoundingClientRect();
    if (e.clientY > rect.top + rect.height / 2) to++;
    if (from < to) to--;
    dragUid = null;
    moveStop(state.stops[from].uid, to);
  });
  list.addEventListener("dragend", () => {
    dragUid = null;
    list.querySelectorAll(".stop").forEach(x => { x.draggable = false; x.classList.remove("dragging", "drop-before"); });
  });

  // explorar
  $("#exploreFilters").addEventListener("click", e => {
    const c = e.target.closest("[data-filter]");
    if (c) { filter = c.dataset.filter; renderExplore(); }
  });
  $("#exploreList").addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    const btn = e.target.closest("[data-act]");
    if (btn && btn.dataset.act === "add") {
      if (state.stops.some(s => s.id === id)) openDetail(id); else addStop(id);
    } else if (btn && btn.dataset.act === "detail") openDetail(id);
    else focusOnMap(id);
  });

  // zoom rápido por país
  const REGION_BOUNDS = {
    Filipinas: [[8.8, 117.8], [15.2, 126.8]],
    Indonesia: [[-9.1, 114.9], [-8.2, 116.5]]
  };
  $("#zoomers").addEventListener("click", e => {
    const b = e.target.closest("[data-zoom]");
    if (!b) return;
    const z = b.dataset.zoom;
    const pts = state.stops.map(s => D[s.id]).filter(d => z === "all" || d.country === z).map(d => [d.lat, d.lng]);
    if (z !== "all") pts.push(...REGION_BOUNDS[z]);
    if (pts.length) map.flyToBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 10, duration: .8 });
  });

  // popups del mapa
  map.getContainer().addEventListener("click", e => {
    const b = e.target.closest("[data-pop]");
    if (!b) return;
    map.closePopup();
    if (b.dataset.pop === "detail") openDetail(b.dataset.id);
    else addStop(b.dataset.id);
  });

  // tabs
  function showTab(name) {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".tab-body").forEach(s => (s.hidden = s.id !== "tab-" + name));
  }
  document.querySelector(".tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]");
    if (b) showTab(b.dataset.tab);
  });
  $("#btnAdd").addEventListener("click", () => { filter = "all"; renderExplore(); showTab("explore"); });

  // barra superior
  $("#departDate").addEventListener("change", e => {
    if (isDate(e.target.value)) { state.flights.out.date = e.target.value; commit(); }
  });
  $("#btnOptimize").addEventListener("click", optimize);

  $("#btnShare").addEventListener("click", async () => {
    const url = location.origin + location.pathname + "#plan=" + LZString.compressToEncodedURIComponent(JSON.stringify(compact(state)));
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copiado. Al abrirlo se ve este mismo plan 💌");
    } catch (e) {
      prompt("Copiá este link:", url);
    }
  });

  const menu = $("#menuList");
  $("#btnMenu").addEventListener("click", e => { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener("click", e => { if (!e.target.closest(".menu")) menu.hidden = true; });
  menu.addEventListener("click", () => { menu.hidden = true; });

  $("#btnExport").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(compact(state), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "luna-de-miel-plan.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("#btnImport").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        state = normalize(JSON.parse(r.result));
        openEdits.clear();
        commit(true);
        toast("Plan importado.");
      } catch (err) { toast("No se pudo leer el archivo."); }
    };
    r.readAsText(file);
    e.target.value = "";
  });
  $("#btnReset").addEventListener("click", () => {
    if (!confirm("¿Volver al plan sugerido? Se pierden los cambios (exportá antes si querés guardarlos).")) return;
    state = normalize(JSON.parse(JSON.stringify(window.PLAN_SUGERIDO)));
    openEdits.clear();
    commit(true);
  });

  // tema
  const savedTheme = store.get(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.dataset.theme = savedTheme;
  $("#btnTheme").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set(THEME_KEY, next);
    setTiles(); renderMap(false);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { setTiles(); renderMap(false); });

  // inicio
  setTiles();
  renderClima();
  renderTips();
  commit(true);
  if (pendingToast) toast(pendingToast);
})();
