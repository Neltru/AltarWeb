/* =========================================================================
 * LÓGICA DEL ALTAR (sin DOM)
 * -------------------------------------------------------------------------
 * Cada piso tiene un número fijo de ESPACIOS (slots), repartidos a lo ancho
 * y con la misma separación. El número de espacios es el límite por piso
 * (CFG.limits.perFloor). Un espacio puede estar vacío, así que se puede
 * poner un elemento en cualquier espacio sin llenar antes los demás.
 *
 *   state = {
 *     slots:  [ [ { uid, type } | null, ... ], ... ]  // por piso, un valor por
 *                                                     // espacio (izquierda → derecha)
 *     cloths: [ idDeMantel | null, ... ]              // mantel de cada piso
 *     garlands: { idDeLugar: idDePapelPicado | null } // papel picado colgante
 *   }
 *   (índice de piso 0 = abajo)
 *
 * Aquí viven: posiciones de los espacios, validación de límites, guardado
 * (serialización) y exportación a SVG. Todo se calcula a partir de
 * js/config.js, así que normalmente no hace falta editar este archivo.
 * ========================================================================= */
window.AltarCore = (function (CFG) {
  const byId = Object.fromEntries(CFG.catalog.map((e) => [e.id, e]));

  const getEntry = (id) => byId[id];
  const DEFAULT_SLOTS = 5; // si un piso no tiene límite configurado
  const slotCount = (i) => CFG.limits.perFloor?.[i] ?? DEFAULT_SLOTS;
  const clothById = Object.fromEntries((CFG.tablecloths || []).map((c) => [c.id, c]));
  const getCloth = (id) => (id ? clothById[id] : null);
  const garlandById = Object.fromEntries((CFG.garlands || []).map((g) => [g.id, g]));
  const getGarland = (id) => (id ? garlandById[id] : null);
  const spots = CFG.garlandSpots || [];
  const getSpot = (id) => spots.find((sp) => sp.id === id);

  const emptyState = () => ({
    slots: CFG.floors.map((_, i) => Array(slotCount(i)).fill(null)),
    cloths: CFG.floors.map(() => null),
    garlands: Object.fromEntries(spots.map((sp) => [sp.id, null])),
  });
  const cloneState = (s) => ({
    slots: s.slots.map((f) => f.map((it) => (it ? { ...it } : null))),
    cloths: [...s.cloths],
    garlands: { ...s.garlands },
  });
  const totalCount = (s) => s.slots.reduce((n, f) => n + f.filter(Boolean).length, 0);
  // Sin elementos, manteles ni papel picado.
  const isEmpty = (s) => !totalCount(s) && s.cloths.every((c) => !c) && Object.values(s.garlands).every((g) => !g);

  let uidCounter = 0;
  const uid = () => `i${Date.now().toString(36)}${(uidCounter++).toString(36)}`;

  // Rectángulo de un piso en coordenadas del lienzo (top = borde superior).
  function floorRect(i) {
    const f = CFG.floors[i];
    const cx = f.x ?? CFG.stage.width / 2;
    return {
      left: cx - f.width / 2,
      top: CFG.stage.height - f.bottom - f.height,
      width: f.width,
      height: f.height,
      cx,
    };
  }

  // Espacio `k` del piso `i`: franja del ancho del piso dividida en partes
  // iguales (descontando el margen `padding` de cada extremo).
  function slotRect(i, k) {
    const r = floorRect(i);
    const n = slotCount(i);
    const w = (r.width - CFG.layout.padding * 2) / n;
    const left = r.left + CFG.layout.padding + w * k;
    return { left, width: w, cx: left + w / 2, top: r.top };
  }

  // Posición de cada elemento del piso: centrado en su espacio y apoyado en el
  // borde superior del piso. Si es más ancho que el espacio, se reduce para caber.
  function layoutFloor(slots, i) {
    const out = [];
    slots.forEach((it, k) => {
      if (!it) return;
      const e = getEntry(it.type);
      const s = slotRect(i, k);
      // `maxWidth` en el catálogo permite que un objeto sobresalga un poco de su espacio.
      const scale = Math.min(1, (e.maxWidth ?? s.width - CFG.layout.slotGap) / e.width);
      const w = e.width * scale;
      const h = e.height * scale;
      out.push({ ...it, slot: k, x: s.cx - w / 2, y: s.top - h, w, h });
    });
    return out;
  }

  // Espacio más cercano a la coordenada x dentro del piso `i`.
  function nearestSlot(i, x) {
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k < slotCount(i); k++) {
      const d = Math.abs(slotRect(i, k).cx - x);
      if (d < bestD) { bestD = d; best = k; }
    }
    return best;
  }

  // Espacio libre más cercano a `k` (o null si no hay). `excludeUid` cuenta como libre.
  function nearestFreeSlot(state, i, k, excludeUid) {
    const row = state.slots[i];
    const free = (j) => !row[j] || row[j].uid === excludeUid;
    for (let d = 0; d < row.length; d++) {
      if (k - d >= 0 && free(k - d)) return k - d;
      if (k + d < row.length && free(k + d)) return k + d;
    }
    return null;
  }

  const floorLabel = (i) => CFG.floors[i].label || `Piso ${i + 1}`;

  // Un piso está lleno cuando todos sus espacios están ocupados.
  const isFloorFull = (state, i) => state.slots[i].every(Boolean);

  // Cuenta elementos que cumplen `pred`.
  function count(state, pred) {
    let n = 0;
    for (const f of state.slots) for (const it of f) if (it && pred(it)) n++;
    return n;
  }

  // ¿Se puede colocar `type` en el piso `i`? Si se mueve un elemento existente,
  // pasa su uid en `excludeUid`: su espacio cuenta como libre y no suma a los límites.
  function check(state, i, type, excludeUid) {
    const entry = getEntry(type);
    const L = CFG.limits;
    const level = 7 - i;
    if (!entry.niveles.includes(level)) {
      const T = window.I18N.t;
      const allowed = entry.niveles.join(T('or'));
      const where = entry.niveles.length > 1 ? T('whereMany', { n: allowed }) : T('whereOne', { n: allowed });
      return { ok: false, reason: T('mustGo', { name: entry.name, where }) };
    }
    const hasFree = state.slots[i].some((it) => !it || it.uid === excludeUid);
    // Mover a un piso lleno sigue siendo válido: intercambia lugar con otro elemento.
    if (!hasFree && !excludeUid) return { ok: false, reason: window.I18N.t('levelFull', { level: floorLabel(i) }) };

    // Los límites globales solo aplican a elementos nuevos (mover no suma).
    if (!excludeUid) {
      const itemMax = L.perItem?.[type];
      if (itemMax != null && count(state, (it) => it.type === type) >= itemMax)
        return { ok: false, reason: window.I18N.t('maxItem', { name: entry.name, n: itemMax }) };

      const catMax = L.perCategory?.[entry.category];
      if (catMax != null && count(state, (it) => getEntry(it.type).category === entry.category) >= catMax) {
        const cat = CFG.categories.find((c) => c.id === entry.category);
        return { ok: false, reason: window.I18N.t('maxCategory', { name: cat ? cat.name.toLowerCase() : entry.category, n: catMax }) };
      }

      if (L.total != null && totalCount(state) >= L.total)
        return { ok: false, reason: window.I18N.t('maxTotal', { n: L.total }) };
    }
    return { ok: true };
  }

  // Límites globales (sin piso). Sirve para desactivar botones del panel.
  function globalCheck(state, type) {
    const entry = getEntry(type);
    const L = CFG.limits;
    const itemMax = L.perItem?.[type];
    if (itemMax != null && count(state, (it) => it.type === type) >= itemMax) return false;
    const catMax = L.perCategory?.[entry.category];
    if (catMax != null && count(state, (it) => getEntry(it.type).category === entry.category) >= catMax) return false;
    if (L.total != null && totalCount(state) >= L.total) return false;
    return true;
  }

  // Guardado compacto: { s: id de cada espacio (null = vacío), c: mantel de cada
  // piso, g: papel picado de cada lugar }.
  // Ignora ids que ya no existan en el catálogo y se adapta si cambia el número
  // de espacios. También acepta el formato anterior (solo el arreglo de espacios).
  const serialize = (state) => ({
    s: state.slots.map((f) => f.map((it) => (it ? it.type : null))),
    c: state.cloths,
    g: state.garlands,
  });
  function deserialize(data) {
    const s = emptyState();
    const slots = Array.isArray(data) ? data : data && data.s;
    const cloths = data && Array.isArray(data.c) ? data.c : [];
    if (Array.isArray(slots)) {
      slots.slice(0, s.slots.length).forEach((f, i) => {
        if (!Array.isArray(f)) return;
        f.slice(0, s.slots[i].length).forEach((type, k) => { if (byId[type]) s.slots[i][k] = { uid: uid(), type }; });
      });
    }
    cloths.slice(0, s.cloths.length).forEach((id, i) => { if (clothById[id]) s.cloths[i] = id; });
    const garlands = (data && data.g) || {};
    spots.forEach((sp) => { if (garlandById[garlands[sp.id]]) s.garlands[sp.id] = garlands[sp.id]; });
    return s;
  }

  // Codificación para enlaces compartibles (#a=...).
  const encode = (state) => btoa(unescape(encodeURIComponent(JSON.stringify(serialize(state)))));
  const decode = (str) => deserialize(JSON.parse(decodeURIComponent(escape(atob(str)))));

  // Geometría de una tira de papel picado en un lugar (`spot`), en coordenadas
  // del lienzo: cordel (curva que se cuelga `sag` en el centro), banderitas
  // repartidas a lo largo y la caja que lo contiene todo.
  function garlandGeometry(spot) {
    const [x0, y0] = spot.from;
    const [x1, y1] = spot.to;
    const qx = (x0 + x1) / 2;
    const qy = (y0 + y1) / 2 + spot.sag * 2; // punto de control: el centro baja `sag`
    const at = (t) => [
      (1 - t) ** 2 * x0 + 2 * (1 - t) * t * qx + t * t * x1,
      (1 - t) ** 2 * y0 + 2 * (1 - t) * t * qy + t * t * y1,
    ];
    const fw = (Math.hypot(x1 - x0, y1 - y0) / spot.flags) * CFG.layout.flagWidth;
    const fh = CFG.layout.flagHeight;
    const flags = Array.from({ length: spot.flags }, (_, k) => {
      const [x, y] = at((k + 0.5) / spot.flags);
      return { x: x - fw / 2, y, w: fw, h: fh };
    });
    let minX = Math.min(x0, x1);
    let maxX = Math.max(x0, x1);
    let minY = Math.min(y0, y1);
    let maxY = Math.max(y0, y1);
    flags.forEach((f) => {
      minX = Math.min(minX, f.x);
      maxX = Math.max(maxX, f.x + f.w);
      maxY = Math.max(maxY, f.y + f.h);
    });
    const pad = 4;
    return {
      box: { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 },
      path: `M${x0} ${y0} Q${qx} ${qy} ${x1} ${y1}`,
      flags,
    };
  }

  // SVG de una tira de papel picado `garland` colgada en `spot`. El viewBox usa
  // coordenadas del lienzo, así que se coloca directamente sobre su caja.
  function renderGarland(garland, spot) {
    const g = garlandGeometry(spot);
    const flags = g.flags.map((f, k) => {
      const body = garland.image
        ? `<image href="${garland.image}" width="${f.w}" height="${f.h}" preserveAspectRatio="none"/>`
        : garland.flag(f.w, f.h, k % 2 === 1, k);
      // Grupo exterior: posición. Interior: animación de vaivén (desfasada por banderita).
      return `<g transform="translate(${f.x} ${f.y})"><g class="ph-sway" style="animation-delay:${(-k * 0.45).toFixed(2)}s">${body}</g></g>`;
    }).join('');
    const { x, y, w, h } = g.box;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="none" class="ph">${flags}<path class="ln" d="${g.path}"/></svg>`;
  }

  // Contenido de un mantel para un piso de `w` × `h`: imagen final o placeholder.
  function renderCloth(cloth, w, h) {
    if (cloth.image) return `<img src="${cloth.image}" alt="${cloth.name}" draggable="false">`;
    return cloth.render(w, h);
  }

  // Contenido HTML/SVG de un elemento: imagen final si existe, si no el placeholder.
  function renderArt(entry) {
    if (entry.image) return `<img src="${entry.image}" alt="${entry.name}" draggable="false">`;
    return entry.render(entry);
  }

  // Dibujo de un nivel (colores de config → pal).
  function renderFloorArt(i) {
    const r = floorRect(i);
    return window.AltarPlaceholders.floorArt(r.width, r.height, CFG.floors[i].pal, i);
  }

  // Construye un SVG autónomo del altar (para "Descargar imagen").
  // `logos`: [{ href (data URL), width, height, scale? }] que se dibujan en las esquinas superiores.
  function toSVG(state, logos = []) {
    const PHs = window.AltarPlaceholders;
    const { width: W, height: H } = CFG.stage;
    let out = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    out += `<style>${PHs.CSS}</style>`;
    out += PHs.backdrop(W, H, true).replace('<svg ', `<svg x="0" y="0" width="${W}" height="${H}" `);
    // Polvo de estrellas fijo.
    for (let n = 0; n < 70; n++) {
      const v = (s) => { const t = Math.sin(n * 12.9898 + s * 78.233) * 43758.5453; return t - Math.floor(t); };
      out += `<circle cx="${(v(1) * W).toFixed(0)}" cy="${(v(2) * H).toFixed(0)}" r="${(1 + v(3) * 2).toFixed(1)}" fill="${v(4) > 0.5 ? '#fff6b0' : '#ffd0f2'}" opacity="${(0.3 + v(5) * 0.5).toFixed(2)}"/>`;
    }
    CFG.floors.forEach((_, i) => {
      const r = floorRect(i);
      const attrs = `x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}"`;
      out += renderFloorArt(i).replace('<svg ', `<svg ${attrs} `);
      const cl = getCloth(state.cloths[i]);
      if (cl) {
        out += cl.image
          ? `<image ${attrs} href="${cl.image}" preserveAspectRatio="none"/>`
          : cl.render(r.width, r.height).replace('<svg ', `<svg ${attrs} `);
      }
    });
    spots.forEach((sp) => {
      const garland = getGarland(state.garlands[sp.id]);
      if (!garland) return;
      const { x, y, w, h } = garlandGeometry(sp).box;
      out += renderGarland(garland, sp).replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
    });
    state.slots.forEach((items, i) => {
      layoutFloor(items, i).forEach((p) => {
        const e = getEntry(p.type);
        const attrs = `x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"`;
        out += e.image
          ? `<image ${attrs} href="${e.image}" preserveAspectRatio="xMidYMax meet"/>`
          : e.render(e).replace('<svg ', `<svg ${attrs} `);
      });
    });
    const name = (PHs.deceased.name || '').trim();
    if (name) {
      const safe = name.replace(/[&<>"']/g, '');
      out += `<text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="20" fill="#ffe27a" stroke="#3a0d4a" stroke-width="4" paint-order="stroke">${window.I18N.t('memoryOf', { name: safe })}</text>`;
    }
    // Logos institucionales: el primero a la izquierda, el segundo a la derecha.
    // Misma área para todos (así un logo ancho no se ve más grande que uno cuadrado),
    // multiplicada por `scale` si el logo la define.
    const LOGO_AREA = 80 * 80, LOGO_M = 20;
    logos.slice(0, 2).forEach((l, i) => {
      const r = l.width / l.height;
      const s = l.scale || 1;
      const w = Math.sqrt(LOGO_AREA * r) * s;
      const h = Math.sqrt(LOGO_AREA / r) * s;
      const x = i === 0 ? LOGO_M : W - LOGO_M - w;
      out += `<image x="${x.toFixed(1)}" y="${LOGO_M}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" href="${l.href}" preserveAspectRatio="xMidYMid meet"/>`;
    });
    return out + '</svg>';
  }

  return {
    CFG, getEntry, getCloth, getGarland, getSpot, garlandGeometry, renderGarland, emptyState, cloneState, totalCount, isEmpty, uid,
    floorRect, floorLabel, slotCount, slotRect, nearestSlot, nearestFreeSlot,
    layoutFloor, isFloorFull, check, globalCheck, renderFloorArt,
    serialize, deserialize, encode, decode, renderArt, renderCloth, toSVG,
  };
})(window.ALTAR_CONFIG);
