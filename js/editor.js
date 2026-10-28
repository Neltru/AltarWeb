/* =========================================================================
 * EDITOR
 * -------------------------------------------------------------------------
 * Interacción: panel de elementos, arrastrar y soltar con snap a los pisos,
 * selección/eliminación, deshacer/rehacer, guardar, descargar y compartir.
 * Los elementos y límites se configuran en js/config.js, no aquí.
 * ========================================================================= */
(function (Core, AltarStage) {
  const { CFG } = Core;
  const STORAGE_KEY = 'altar-digital:v2';
  const LOVED_KEY = 'altar-digital:difunto';
  const FAMILY_PHOTO_KEY = 'altar-digital:foto-familiar';
  const PH = window.AltarPlaceholders;
  const T = window.I18N.t;
  const HISTORY_MAX = 100;
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const $ = (id) => document.getElementById(id);
  const host = $('stage-host');
  const stage = AltarStage.create(host, { interactive: true });

  let state = loadInitialState();
  let past = [];
  let future = [];
  let selectedUid = null;
  let selectedSpot = null; // papel picado seleccionado (toque en móvil)
  let activeCategory = 'todos';
  let query = '';
  let armed = null; // objeto elegido en el inventario que espera un nivel (toque)

  /* ---------------------------------------------------------------- estado */

  function commit(next) {
    past.push(state);
    if (past.length > HISTORY_MAX) past.shift();
    future = [];
    state = next;
    render();
  }

  function undo() {
    if (!past.length) return;
    future.push(state);
    state = past.pop();
    selectedUid = null;
    render();
  }

  function redo() {
    if (!future.length) return;
    past.push(state);
    state = future.pop();
    selectedUid = null;
    render();
  }

  function render() {
    stage.render(state, { selectedUid, selectedSpot, draggingUid: drag && drag.started ? drag.uid : null });
    $('btn-undo').disabled = !past.length;
    $('btn-redo').disabled = !future.length;
    $('btn-clear').disabled = Core.isEmpty(state);
    $('canvas-empty').hidden = !Core.isEmpty(state);
    document.querySelectorAll('.tile[data-type]').forEach((t) => {
      t.classList.toggle('is-maxed', !Core.globalCheck(state, t.dataset.type));
    });
  }

  function findItem(uid) {
    for (let i = 0; i < state.slots.length; i++) {
      const k = state.slots[i].findIndex((it) => it && it.uid === uid);
      if (k !== -1) return { floor: i, index: k, item: state.slots[i][k] };
    }
    return null;
  }

  function removeItem(uid) {
    const found = findItem(uid);
    if (!found) return;
    const next = Core.cloneState(state);
    next.slots[found.floor][found.index] = null; // el espacio queda libre
    if (selectedUid === uid) selectedUid = null;
    commit(next);
  }

  // Coloca `type` en el nivel `i` (espacio libre más cercano a x, o al centro).
  function placeInFloor(i, type, x) {
    const res = Core.check(state, i, type);
    if (!res.ok) { toast(res.reason); return false; }
    const k0 = Core.nearestSlot(i, x == null ? Core.floorRect(i).cx : x);
    const k = Core.nearestFreeSlot(state, i, k0);
    if (k == null) { toast(T('levelFull', { level: Core.floorLabel(i) })); return false; }
    const next = Core.cloneState(state);
    next.slots[i][k] = { uid: Core.uid(), type };
    commit(next);
    return true;
  }

  // Añade el objeto en su nivel sugerido; si está lleno, prueba los demás.
  function addAuto(type) {
    const entry = Core.getEntry(type);
    const order = [...entry.niveles.map((n) => 7 - n), ...CFG.floors.map((_, i) => i)];
    let firstReason = null;
    for (const i of [...new Set(order)]) {
      const res = Core.check(state, i, type);
      if (res.ok) { placeInFloor(i, type); return; }
      firstReason = firstReason || res.reason;
      if (!Core.globalCheck(state, type)) break;
    }
    toast(Core.globalCheck(state, type) ? T('altarFull') : firstReason);
  }

  // Toque en un objeto del inventario: queda "en mano" hasta tocar un nivel.
  function arm(type) {
    if (armed === type) return disarm();
    if (!Core.globalCheck(state, type)) { toast(T('outOfStock')); return; }
    armed = type;
    const entry = Core.getEntry(type);
    $('armed-text').textContent = T('armedText', { name: entry.name });
    $('armed').hidden = false;
    document.body.classList.add('is-armed');
    markArmedTile();
  }
  function disarm() {
    armed = null;
    $('armed').hidden = true;
    document.body.classList.remove('is-armed');
    markArmedTile();
  }
  function markArmedTile() {
    document.querySelectorAll('.tile[data-type]').forEach((t) => t.classList.toggle('is-armed', t.dataset.type === armed));
  }

  /* ------------------------------------------------------------------ panel */

  function buildCats() {
    const all = [{ id: 'todos', name: T('all') }, ...CFG.categories];
    $('palette-cats').innerHTML = all.map((c) =>
      `<button class="cat" type="button" role="tab" data-cat="${c.id}">${c.name}</button>`).join('');
  }

  function buildPalette() {
    const cats = $('palette-cats');
    buildCats();
    cats.addEventListener('click', (e) => {
      const b = e.target.closest('.cat');
      if (b) selectCategory(b.dataset.cat);
    });
    $('search').addEventListener('input', (e) => { query = e.target.value; selectCategory(activeCategory, true); });
    // Teclado (Enter/Espacio sobre un objeto): colocarlo directamente en su nivel sugerido.
    $('palette-items').addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile || e.detail !== 0) return;
      if (tile.dataset.garland) addGarlandAuto(tile.dataset.garland);
      else addAuto(tile.dataset.type);
    });
    selectCategory(activeCategory);
  }

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function selectCategory(id, keepScroll) {
    activeCategory = id;
    document.querySelectorAll('.cat').forEach((b) => b.setAttribute('aria-selected', b.dataset.cat === id));
    const q = norm(query.trim());
    const match = (name) => !q || norm(name).includes(q);
    const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    // Sin atributo `title`: el globo de ayuda lo dibuja js/tooltip.js con el color del objeto.
    const tileHtml = (e) => `
      <button class="tile" type="button" data-type="${e.id}" data-tip-title="${esc(e.name)}" data-tip="${esc(e.info)}">
        <span class="tile__art">${Core.renderArt(e)}</span>
        <span class="tile__name">${e.name}</span>
      </button>`;
    const garlandName = (g) => T('garlandTile', { name: g.name });
    const garlandHtml = (g) => `
      <button class="tile tile--garland" type="button" data-garland="${g.id}" data-tip-title="${esc(garlandName(g))}" data-tip="${esc(T('garlandTipDesc'))}">
        <span class="tile__art">${garlandPreview(g)}</span>
        <span class="tile__name">${garlandName(g)}</span>
      </button>`;
    const cat = CFG.categories.find((c) => c.id === id);
    const tiles = [];
    if (id === 'todos') {
      CFG.catalog.filter((e) => match(e.name)).forEach((e) => tiles.push(tileHtml(e)));
      CFG.garlands.filter((g) => match(garlandName(g))).forEach((g) => tiles.push(garlandHtml(g)));
    } else if (cat && cat.source === 'garlands') {
      CFG.garlands.filter((g) => match(garlandName(g))).forEach((g) => tiles.push(garlandHtml(g)));
    } else {
      CFG.catalog.filter((e) => e.category === id && match(e.name)).forEach((e) => tiles.push(tileHtml(e)));
    }
    const box = $('palette-items');
    box.innerHTML = tiles.length ? tiles.join('') : `<p class="palette__empty">${T('noResults')}</p>`;
    if (!keepScroll) box.scrollTo(0, 0);
    markArmedTile();
    render();
    if (!keepScroll) $('palette').classList.remove('is-collapsed');
  }

  // Barra inferior (móvil): tocar o deslizar el asa la contrae/expande.
  (function setupHandle() {
    const handle = $('palette-handle');
    const palette = $('palette');
    let startY = null;
    let swiped = false;
    const set = (collapsed) => {
      palette.classList.toggle('is-collapsed', collapsed);
      handle.setAttribute('aria-expanded', !collapsed);
    };
    handle.addEventListener('pointerdown', (e) => { startY = e.clientY; swiped = false; });
    handle.addEventListener('pointerup', (e) => {
      if (startY == null) return;
      const dy = e.clientY - startY;
      startY = null;
      if (Math.abs(dy) > 20) { swiped = true; set(dy > 0); }
    });
    handle.addEventListener('click', () => {
      if (swiped) { swiped = false; return; }
      set(!palette.classList.contains('is-collapsed'));
    });
  })();

  /* ------------------------------------------------- papel picado colgante */

  // Tira corta para el panel y para el fantasma al arrastrar.
  const PREVIEW_SPOT = { from: [0, 4], to: [150, 4], sag: 6, flags: 4 };
  const garlandPreview = (g) =>
    Core.renderGarland(g, PREVIEW_SPOT).replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"');

  function setGarland(spotId, id) {
    if (state.garlands[spotId] === id) return;
    const next = Core.cloneState(state);
    next.garlands[spotId] = id;
    if (!id && selectedSpot === spotId) selectedSpot = null;
    commit(next);
  }

  // Toque en un tipo de papel picado: se cuelga en el primer lugar libre.
  function addGarlandAuto(id) {
    const free = CFG.garlandSpots.find((sp) => !state.garlands[sp.id]);
    if (free) setGarland(free.id, id);
    else toast(T('garlandAlready'));
  }

  /* -------------------------------------------------------- arrastrar/soltar */

  // drag = { kind: 'new' | 'move' | 'garland', type, uid, spot, pointerId, pointerType, source,
  //          startX, startY, started, ghost, target, result }
  let drag = null;

  function onPointerDown(e) {
    if (e.button > 0) return;
    if (drag) cancelDrag(); // por si se perdió un pointerup anterior
    const tile = e.target.closest('.tile');
    const item = e.target.closest('.item');
    if (e.target.closest('.item__delete')) return;

    if (tile && tile.dataset.garland) {
      drag = { kind: 'garland', type: tile.dataset.garland, source: 'palette' };
    } else if (tile) {
      drag = { kind: 'new', type: tile.dataset.type, source: 'palette' };
    } else if (item && host.contains(item)) {
      const found = findItem(item.dataset.uid);
      if (!found) return;
      drag = { kind: 'move', type: found.item.type, uid: found.item.uid, source: 'stage' };
    } else {
      if (host.contains(e.target) && !e.target.closest('.floor__btn, .garland')) {
        if (selectedUid || selectedSpot) { selectedUid = null; selectedSpot = null; render(); }
        // Táctil: tocar un nivel muestra su flecha (no hay "pasar el cursor").
        if (e.pointerType !== 'mouse') stage.setHover(stage.floorAt(stage.toStage(e.clientX, e.clientY)));
      }
      return;
    }
    Object.assign(drag, {
      pointerId: e.pointerId, pointerType: e.pointerType,
      startX: e.clientX, startY: e.clientY, started: false,
    });
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.started) {
      const dist = Math.hypot(dx, dy);
      if (drag.pointerType !== 'touch' || drag.source === 'stage') {
        if (dist > 4) startDrag(); else return;
      } else if (mobileQuery.matches) {
        // Barra inferior: deslizar hacia arriba arrastra; de lado, desplaza la lista.
        if (dy < -8 && Math.abs(dy) > Math.abs(dx)) startDrag();
        else if (Math.abs(dx) > 10) { drag = null; return; }
        else return;
      } else {
        // Panel lateral: arrastrar hacia el lienzo; vertical, desplaza la lista.
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) startDrag();
        else if (Math.abs(dy) > 10) { drag = null; return; }
        else return;
      }
    }
    e.preventDefault();
    updateDrag(e.clientX, e.clientY);
  }

  function startDrag() {
    drag.started = true;
    document.body.classList.add('is-dragging');
    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    if (drag.kind === 'garland') {
      document.body.classList.add('is-dragging-garland');
      drag.size = { w: 120, h: 44 };
      ghost.innerHTML = `<div class="ghost__art">${garlandPreview(Core.getGarland(drag.type))}</div>`;
    } else {
      const entry = Core.getEntry(drag.type);
      const s = stage.scale;
      drag.size = { w: entry.width * s, h: entry.height * s };
      ghost.innerHTML = `<div class="ghost__art">${Core.renderArt(entry)}</div>`;
    }
    ghost.style.width = drag.size.w + 'px';
    ghost.style.height = drag.size.h + 'px';
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    // En táctil el fantasma se dibuja por encima del dedo para que se vea.
    drag.lift = 28;
    stage.setHover(null);
    if (drag.kind === 'move') { selectedUid = null; render(); }
  }

  function updateDrag(cx, cy) {
    const { w, h } = drag.size;
    // Borde inferior del fantasma: es el punto que decide el piso.
    const baseY = drag.pointerType === 'touch' ? cy - drag.lift : cy + h / 2;
    drag.ghost.style.transform = `translate(${cx - w / 2}px, ${baseY - h}px)`;

    const r = host.getBoundingClientRect();
    const over = cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;

    // Devolver al inventario: soltar un objeto del altar sobre el panel.
    const pr = $('palette').getBoundingClientRect();
    drag.overPalette = drag.kind === 'move' && cx >= pr.left && cx <= pr.right && cy >= pr.top && cy <= pr.bottom;
    $('palette').classList.toggle('is-drop', !!drag.overPalette);
    if (drag.overPalette) { stage.highlight(null); drag.target = null; return; }

    // Papel picado: se cuelga en el lugar más cercano (nunca en un piso).
    if (drag.kind === 'garland') {
      drag.spot = over ? stage.nearestSpot(stage.toStage(cx, baseY - h / 2)) : null;
      stage.highlightSpot(drag.spot);
      return;
    }

    drag.target = null;
    drag.slot = null;
    drag.result = null;
    if (over) {
      const p = stage.toStage(cx, baseY);
      const moving = drag.kind === 'move' ? drag.uid : undefined;
      drag.target = nearestFloor(p.y);
      drag.result = Core.check(state, drag.target, drag.type, moving);
      if (drag.result.ok) drag.slot = targetSlot(drag.target, p.x, moving);
    }
    stage.highlight(drag.target, drag.result && !drag.result.ok, drag.slot);
  }

  // Espacio donde caerá: el más cercano al puntero. Si está ocupado, un elemento
  // que se mueve intercambia lugar con el ocupante; uno nuevo va al espacio libre más cercano.
  function targetSlot(floor, x, movingUid) {
    const k = Core.nearestSlot(floor, x);
    if (!state.slots[floor][k] || movingUid) return k;
    return Core.nearestFreeSlot(state, floor, k);
  }

  // Snap: el piso cuyo borde superior queda más cerca del punto de soltado.
  function nearestFloor(y) {
    let best = 0;
    let bestD = Infinity;
    CFG.floors.forEach((_, i) => {
      const d = Math.abs(Core.floorRect(i).top - y);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const d = drag;
    endDrag();

    if (d.kind === 'garland') {
      if (!d.started) addGarlandAuto(d.type);
      else if (d.spot) setGarland(d.spot, d.type); // reemplaza si ya había uno
      else render();
      return;
    }

    if (!d.started) {
      if (d.kind === 'new') arm(d.type);
      else { selectedUid = selectedUid === d.uid ? null : d.uid; render(); }
      return;
    }
    if (d.overPalette) { removeItem(d.uid); toast(T('returned')); return; }
    if (d.target == null) { render(); return; }               // soltado fuera del altar
    if (!d.result.ok) { toast(d.result.reason); render(); return; } // piso lleno / límite

    const next = Core.cloneState(state);
    if (d.kind === 'move') {
      const from = findItem(d.uid);
      if (from.floor === d.target && from.index === d.slot) { render(); return; } // mismo lugar
      // Intercambio: el ocupante (o el vacío) pasa al espacio de origen.
      next.slots[from.floor][from.index] = next.slots[d.target][d.slot];
      next.slots[d.target][d.slot] = from.item;
    } else {
      next.slots[d.target][d.slot] = { uid: Core.uid(), type: d.type };
    }
    commit(next);
  }

  function endDrag() {
    if (drag && drag.ghost) drag.ghost.remove();
    drag = null;
    document.body.classList.remove('is-dragging', 'is-dragging-garland');
    $('palette').classList.remove('is-drop');
    stage.highlight(null);
    stage.highlightSpot(null);
  }

  function cancelDrag() {
    if (!drag) return;
    endDrag();
    render();
  }

  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', cancelDrag);
  // Evita el menú contextual al mantener pulsado en móvil.
  document.addEventListener('contextmenu', (e) => { if (e.target.closest('.tile, .item')) e.preventDefault(); });

  host.addEventListener('click', (e) => {
    const garland = e.target.closest('.garland');
    if (garland) {
      const spotId = garland.dataset.spot;
      if (e.target.closest('.garland__delete')) setGarland(spotId, null);
      else { selectedSpot = selectedSpot === spotId ? null : spotId; render(); } // táctil: muestra ×
      return;
    }
    const del = e.target.closest('.item__delete');
    if (del) removeItem(del.closest('.item').dataset.uid);
    const cloth = e.target.closest('.floor__btn--cloth');
    if (cloth) return togglePanel('cloth', Number(cloth.dataset.floor));
    const floor = e.target.closest('.floor');
    // Con un objeto "en mano": el toque lo coloca en ese nivel.
    if (armed) {
      const fi = floor ? Number(floor.dataset.floor) : stage.floorAt(stage.toStage(e.clientX, e.clientY), 20);
      if (fi != null && !e.target.closest('.item')) {
        if (placeInFloor(fi, armed, stage.toStage(e.clientX, e.clientY).x)) {
          if (!Core.globalCheck(state, armed)) disarm();
        }
      }
      return;
    }
    // Clic en el propio nivel: se ilumina y muestra qué significa y qué va ahí.
    if (floor) togglePanel('info', Number(floor.dataset.floor));
  });

  /* ------------------------------------- botones de cada nivel (info y mantel) */

  // Al pasar el cursor por un nivel se ilumina su contorno y aparece su botón de mantel.
  host.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || drag) return;
    stage.setHover(stage.floorAt(stage.toStage(e.clientX, e.clientY), 44 / stage.scale));
  });
  host.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') stage.setHover(null); });

  // Solo una ventana abierta a la vez: 'info' (clic en el nivel) o 'cloth' (mantel).
  const panels = { info: $('floor-info'), cloth: $('cloth-picker') };
  let open = null; // { kind, floor }

  function togglePanel(kind, i) {
    if (open && open.kind === kind && open.floor === i) return closePanel();
    closePanel();
    open = { kind, floor: i };
    if (kind === 'info') fillFloorInfo(i); else fillClothPicker(i);
    panels[kind].hidden = false;
    stage.setLit(i);
    positionPanel();
  }

  function closePanel() {
    if (!open) return;
    panels[open.kind].hidden = true;
    open = null;
    stage.setLit(null);
  }

  function fillFloorInfo(i) {
    const f = CFG.floors[i];
    $('floor-info-label').textContent = Core.floorLabel(i);
    $('floor-info-title').textContent = f.title || '';
    $('floor-info-text').textContent = f.description || '';
    $('floor-info-list').innerHTML = (f.suggested || []).map((x) => `<li>${x}</li>`).join('');
  }

  // Selector de manteles: un clic aplica el mantel al piso y listo.
  function fillClothPicker(i, showPlainColors = false) {
    $('cloth-picker-label').textContent = Core.floorLabel(i);
    const r = Core.floorRect(i);
    const current = state.cloths[i];
    const isPlain = (c) => c.id === 'liso' || c.id.startsWith('liso');
    const option = (id, name, preview) => `
      <button class="cloth-option" type="button" data-cloth="${id}" aria-pressed="${(current || '') === id}">
        <span class="cloth-option__preview">${preview}</span>
        <span>${name}</span>
      </button>`;
    if (showPlainColors) {
      $('cloth-picker-list').innerHTML =
        `<button class="cloth-option cloth-option--back" type="button" data-cloth-back>${T('clothBack')}</button>` +
        CFG.tablecloths.filter(isPlain).map((c) => option(c.id, c.name, Core.renderCloth(c, r.width, r.height))).join('');
      return;
    }
    const currentPlain = CFG.tablecloths.find((c) => c.id === current && isPlain(c));
    const plainPreview = currentPlain || CFG.tablecloths.find((c) => c.id === 'liso');
    $('cloth-picker-list').innerHTML =
      option('', T('clothNone'), '') +
      `<button class="cloth-option" type="button" data-cloth-group="plain" aria-pressed="${!!currentPlain}"><span class="cloth-option__preview">${Core.renderCloth(plainPreview, r.width, r.height)}</span><span>${T('clothPlain')}</span></button>` +
      CFG.tablecloths.filter((c) => !isPlain(c)).map((c) => option(c.id, c.name, Core.renderCloth(c, r.width, r.height))).join('');
  }

  $('cloth-picker-list').addEventListener('click', (e) => {
    const b = e.target.closest('.cloth-option');
    if (!b || !open) return;
    if (b.hasAttribute('data-cloth-back')) { fillClothPicker(open.floor); return; }
    if (b.dataset.clothGroup === 'plain') { fillClothPicker(open.floor, true); return; }
    setCloth(open.floor, b.dataset.cloth || null);
    closePanel();
  });

  $('cloth-picker-all').addEventListener('click', () => {
    if (!open) return;
    const id = state.cloths[open.floor];
    const next = Core.cloneState(state);
    next.cloths = next.cloths.map(() => id);
    commit(next);
    closePanel();
    toast(id ? T('clothAllDone') : T('clothAllNone'));
  });

  function setCloth(i, id) {
    if (state.cloths[i] === id) return;
    const next = Core.cloneState(state);
    next.cloths[i] = id;
    commit(next);
  }

  // Coloca la ventana sin tapar el nivel iluminado. Prueba varias posiciones en
  // orden (a los lados del nivel, esquinas superiores, encima, debajo) y usa la primera que cabe en
  // el lienzo sin tocar el nivel. Si ninguna cabe, angosta la ventana para que
  // quepa a un lado (pantallas pequeñas); y si tampoco, usa la que menos tape.
  const MIN_PANEL_WIDTH = 150;

  function positionPanel() {
    if (!open) return;
    const box = panels[open.kind];
    box.style.width = ''; // ancho del CSS
    const fl = stage.floorEls[open.floor];
    const canvas = box.parentElement.getBoundingClientRect();
    const rel = (r) => ({ left: r.left - canvas.left, top: r.top - canvas.top, right: r.right - canvas.left, bottom: r.bottom - canvas.top });
    const floor = rel(fl.getBoundingClientRect());
    const btnEl = open.kind === 'cloth' ? fl.querySelector('.floor__btn--cloth') : null;
    const btn = btnEl ? rel(btnEl.getBoundingClientRect()) : floor;
    const outerLeft = Math.min(floor.left, btn.left);
    const outerRight = Math.max(floor.right, btn.right);
    const gap = 10;
    const m = 8; // margen con el borde del lienzo
    const midY = (floor.top + floor.bottom) / 2;

    const place = () => {
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      const clampX = (x) => Math.min(Math.max(m, x), canvas.width - w - m);
      const clampY = (y) => Math.min(Math.max(m, y), canvas.height - h - m);
      const right = { left: outerRight + gap, top: clampY(midY - h / 2) };
      const left = { left: outerLeft - gap - w, top: clampY(midY - h / 2) };
      const above = { left: clampX((floor.left + floor.right) / 2 - w / 2), top: floor.top - gap - h };
      const below = { left: clampX((floor.left + floor.right) / 2 - w / 2), top: floor.bottom + gap };
      // Esquinas superiores del lienzo: el altar es más angosto arriba y ahí suele haber lugar.
      const topRight = { left: canvas.width - w - m, top: m };
      const topLeft = { left: m, top: m };
      const sides = open.kind === 'info' ? [right, left] : [left, right];
      const corners = open.kind === 'info' ? [topRight, topLeft] : [topLeft, topRight];
      // En pantallas pequeñas se prefieren las esquinas; en escritorio, junto al nivel.
      const candidates = mobileQuery.matches
        ? [...corners, ...sides, above, below]
        : [...sides, ...corners, above, below];
      const fits = (c) => c.left >= m && c.left + w <= canvas.width - m && c.top >= m && c.top + h <= canvas.height - m;
      const overlap = (c) => {
        const ox = Math.max(0, Math.min(c.left + w, floor.right) - Math.max(c.left, floor.left));
        const oy = Math.max(0, Math.min(c.top + h, floor.bottom) - Math.max(c.top, floor.top));
        return ox * oy;
      };
      const clean = candidates.find((c) => fits(c) && !overlap(c));
      const fallback = () => candidates
        .map((c) => ({ left: clampX(c.left), top: clampY(c.top) }))
        .sort((a, b) => overlap(a) - overlap(b))[0];
      return { clean, fallback };
    };

    let { clean, fallback } = place();
    if (!clean) {
      // Angostar la ventana al espacio libre del lado más amplio.
      const side = Math.max(canvas.width - outerRight - gap - m, outerLeft - gap - m);
      if (side >= MIN_PANEL_WIDTH && side < box.offsetWidth) {
        box.style.width = Math.floor(side) + 'px';
        ({ clean, fallback } = place());
      }
    }
    const best = clean || fallback();
    box.style.left = best.left + 'px';
    box.style.top = best.top + 'px';
  }

  $('floor-info-close').addEventListener('click', closePanel);
  $('cloth-picker-close').addEventListener('click', closePanel);
  window.addEventListener('resize', positionPanel);
  // Clic fuera de la ventana y de los botones de nivel: se cierra.
  document.addEventListener('pointerdown', (e) => {
    if (open && !panels[open.kind].contains(e.target) && !e.target.closest('.floor, .floor__btn')) closePanel();
  });

  /* ------------------------------------------------------ barra superior */

  $('btn-undo').addEventListener('click', undo);
  $('btn-redo').addEventListener('click', redo);

  $('btn-clear').addEventListener('click', () => { if (!Core.isEmpty(state)) openModal('confirm-modal'); });
  $('confirm-no').addEventListener('click', () => closeModal('confirm-modal'));
  $('confirm-yes').addEventListener('click', () => {
    closeModal('confirm-modal');
    selectedUid = null; selectedSpot = null; closePanel(); disarm();
    commit(Core.emptyState());
    toast(T('altarReset'));
  });

  $('btn-save').addEventListener('click', () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Core.serialize(state)));
      toast(T('saved'));
    } catch {
      toast(T('saveFail'));
    }
  });

  $('btn-download').addEventListener('click', async () => {
    const svg = Core.toSVG(state);
    try {
      const png = await svgToPng(svg, 1.5);
      downloadBlob(png, 'mi-altar.png');
      toast(T('downloaded'));
    } catch {
      // Si el navegador no permite convertir a PNG, se descarga el SVG.
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'mi-altar.svg');
      toast(T('downloadedSvg'));
    }
  });

  $('btn-share').addEventListener('click', async () => {
    const url = location.href.split('#')[0] + '#a=' + Core.encode(state);
    if (navigator.share) {
      try { await navigator.share({ title: T('shareTitle'), url }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(T('linkCopied'));
    } catch {
      prompt(T('sharePrompt'), url);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) { if (e.key === 'Escape') e.target.blur(); return; }
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'Escape') { cancelDrag(); closePanel(); closeGuide(); closeModal('confirm-modal'); closeModal('loved-modal'); disarm(); if (selectedUid || selectedSpot) { selectedUid = null; selectedSpot = null; render(); } }
    else if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedUid) { e.preventDefault(); removeItem(selectedUid); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSpot) { e.preventDefault(); setGarland(selectedSpot, null); }
  });

  /* ------------------------------------------------------- ventanas (modales) */

  const modalOpener = {};
  function openModal(id) {
    const m = $(id);
    modalOpener[id] = document.activeElement;
    m.hidden = false;
    const f = m.querySelector('input, button');
    if (f) setTimeout(() => f.focus(), 30);
  }
  function closeModal(id) {
    const m = $(id);
    if (m.hidden) return;
    m.hidden = true;
    if (modalOpener[id] && modalOpener[id].focus) modalOpener[id].focus();
  }
  // Clic en el fondo oscuro cierra la ventana.
  document.querySelectorAll('.modal').forEach((m) => m.addEventListener('pointerdown', (e) => { if (e.target === m) closeModal(m.id); }));

  /* ------------------------------------------------------- Mi ser querido */

  let lovedPhoto = '';
  function loadLoved() {
    try {
      const d = JSON.parse(localStorage.getItem(LOVED_KEY) || 'null');
      if (d) { PH.deceased.name = d.name || ''; PH.deceased.photo = d.photo || ''; }
    } catch { /* sin almacenamiento */ }
  }
  function paintLovedPreview() {
    const p = $('loved-preview');
    p.style.backgroundImage = lovedPhoto ? `url("${lovedPhoto}")` : '';
    p.classList.toggle('has-photo', !!lovedPhoto);
  }
  $('btn-loved').addEventListener('click', () => {
    $('loved-name').value = PH.deceased.name;
    lovedPhoto = PH.deceased.photo;
    paintLovedPreview();
    openModal('loved-modal');
  });
  ['loved-close', 'loved-cancel'].forEach((id) => $(id).addEventListener('click', () => closeModal('loved-modal')));
  $('loved-remove').addEventListener('click', () => { lovedPhoto = ''; $('loved-file').value = ''; paintLovedPreview(); });
  $('loved-file').addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Se reduce la foto para que el altar y el guardado sigan ligeros.
        const max = 420;
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        lovedPhoto = c.toDataURL('image/jpeg', 0.85);
        paintLovedPreview();
      };
      img.onerror = () => toast(T('imageReadFail'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  $('loved-save').addEventListener('click', () => {
    PH.deceased.name = $('loved-name').value.trim();
    PH.deceased.photo = lovedPhoto;
    try { localStorage.setItem(LOVED_KEY, JSON.stringify(PH.deceased)); } catch { toast(T('lovedTooBig')); }
    stage.refreshArt();
    selectCategory(activeCategory, true);
    closeModal('loved-modal');
    toast(PH.deceased.name ? T('lovedDone', { name: PH.deceased.name }) : T('lovedUpdated'));
  });

  $('family-file').addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 420;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL('image/jpeg', 0.82);
        const entry = Core.getEntry('fotoFamilia');
        entry.image = photo;
        try {
          localStorage.setItem(FAMILY_PHOTO_KEY, photo);
          toast(T('familyUpdated'));
        } catch {
          toast(T('familySaveFail'));
        }
        stage.refreshArt();
        selectCategory(activeCategory, true);
      };
      img.onerror = () => toast(T('imageReadFail'));
      img.src = reader.result;
    };
    reader.onerror = () => toast(T('imageReadFail'));
    reader.readAsDataURL(file);
    ev.target.value = '';
  });

  /* ------------------------------------------------------- Guía de niveles */

  const guideWidths = [300, 410, 520, 630, 740, 850, 960];
  function buildGuide() {
    $('guide-body').innerHTML = [1, 2, 3, 4, 5, 6, 7].map((n) => {
      const fl = CFG.floors[7 - n];
      const items = CFG.catalog.filter((e) => e.niveles.includes(n));
      const pal = fl.pal;
      const mini = guideWidths.map((w, i) =>
        `<i class="${i === n - 1 ? 'on' : ''}" style="width:${Math.round((w / 960) * 100)}%"></i>`).join('');
      const thumbs = items.filter((e) => e.niveles[0] === n).slice(0, 6).concat(items.filter((e) => e.niveles[0] !== n)).slice(0, 6)
        .map((e) => `<span class="lvl__thumb">${Core.renderArt(e)}</span>`).join('');
      return `
      <article class="lvl" data-nivel="${n}" style="--a:${pal.a};--b:${pal.b};--t:${pal.trim}">
        <header class="lvl__head">
          <span class="lvl__num">${n}</span>
          <div class="lvl__titles"><h3>${T('levelWord')} ${n} — ${fl.title}</h3><p>${fl.short}</p></div>
          <div class="mini" role="img" aria-label="${T('miniAria', { n })}">${mini}</div>
        </header>
        <div class="lvl__stage" aria-hidden="true">${thumbs}</div>
        <p class="lvl__text">${fl.description}</p>
        <p class="lvl__where"><strong>${T('whereLabel')}</strong> ${n === 1 ? T('whereTop') : n === 7 ? T('whereBase') : T('whereMid', { n })}.
          <button class="link-btn" type="button" data-show="${n}">${T('showOnAltar')}</button></p>
        <p class="lvl__sub">${T('recommended')} <small>${T('recommendedHint')}</small></p>
        <div class="chips">${items.map((e) => `
          <button class="chip" type="button" data-id="${e.id}" data-nivel="${n}">
            <span class="chip__art">${Core.renderArt(e)}</span><span>${e.name}</span>
          </button>`).join('')}</div>
        <div class="detail" hidden>
          <h4></h4><p></p>
          <button class="btn btn--primary btn--sm" type="button" data-place="">${T('placeOn', { n })}</button>
        </div>
      </article>`;
    }).join('');
  }

  let guideBuilt = false;
  function openGuide() {
    disarm();
    if (!guideBuilt) { buildGuide(); guideBuilt = true; }
    $('guide-wrap').hidden = false;
    document.body.classList.add('guide-open');
    $('guide-close').focus();
  }
  function closeGuide() {
    if ($('guide-wrap').hidden) return;
    $('guide-wrap').hidden = true;
    document.body.classList.remove('guide-open');
    $('btn-guide').focus();
  }
  let litTimer;
  function showLevel(n, closeDrawer) {
    closePanel();
    stage.setLit(7 - n);
    stage.setHover(7 - n);
    clearTimeout(litTimer);
    litTimer = setTimeout(() => { stage.setLit(null); stage.setHover(null); }, 5000);
    if (closeDrawer) closeGuide();
  }
  $('btn-guide').addEventListener('click', openGuide);
  $('guide-close').addEventListener('click', closeGuide);
  $('guide-backdrop').addEventListener('click', closeGuide);
  $('guide-body').addEventListener('click', (ev) => {
    const show = ev.target.closest('[data-show]');
    if (show) { showLevel(Number(show.dataset.show), mobileQuery.matches); return; }
    const chip = ev.target.closest('.chip');
    if (chip) {
      const art = chip.closest('.lvl');
      const entry = Core.getEntry(chip.dataset.id);
      art.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-on', c === chip));
      const d = art.querySelector('.detail');
      d.hidden = false;
      d.querySelector('h4').textContent = entry.name;
      d.querySelector('p').textContent = entry.info;
      d.querySelector('[data-place]').dataset.place = entry.id;
      showLevel(Number(art.dataset.nivel), false);
      return;
    }
    const place = ev.target.closest('[data-place]');
    if (place && place.dataset.place) {
      const n = Number(place.closest('.lvl').dataset.nivel);
      if (placeInFloor(7 - n, place.dataset.place)) toast(T('placedIn', { name: Core.getEntry(place.dataset.place).name, n }));
      return;
    }
    const head = ev.target.closest('.lvl__head');
    if (head) showLevel(Number(head.closest('.lvl').dataset.nivel), false);
  });

  $('armed-cancel').addEventListener('click', disarm);
  $('armed-auto').addEventListener('click', () => { if (armed) { const t = armed; disarm(); addAuto(t); } });

  /* --------------------------------------------------------------- idioma */

  // Al cambiar de idioma se vuelve a escribir todo lo que se genera con JS.
  // El altar, las posiciones y el historial no se tocan.
  window.I18N.onChange(() => {
    buildCats();
    selectCategory(activeCategory, true);
    stage.relabel();
    if (guideBuilt) {
      const sc = $('guide-body').scrollTop;
      buildGuide();
      $('guide-body').scrollTop = sc;
    }
    if (open) {
      if (open.kind === 'info') fillFloorInfo(open.floor); else fillClothPicker(open.floor);
      positionPanel();
    }
    if (armed) $('armed-text').textContent = T('armedText', { name: Core.getEntry(armed).name });
    stage.refreshArt(); // el retrato muestra "Mi ser querido" si no hay nombre
    hideToast();
  });

  /* ------------------------------------------------------------- utilidades */

  function loadInitialState() {
    const m = location.hash.match(/#a=([^&]+)/);
    if (m) {
      try { return Core.decode(m[1]); } catch { /* enlace inválido: se ignora */ }
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return Core.deserialize(JSON.parse(saved));
    } catch { /* almacenamiento no disponible */ }
    return Core.emptyState();
  }

  function loadFamilyPhoto() {
    try {
      const photo = localStorage.getItem(FAMILY_PHOTO_KEY);
      if (photo) Core.getEntry('fotoFamilia').image = photo;
    } catch { /* almacenamiento no disponible */ }
  }

  function svgToPng(svg, ratio) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = CFG.stage.width * ratio;
          canvas.height = CFG.stage.height * ratio;
          const ctx = canvas.getContext('2d');
          ctx.scale(ratio, ratio);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png');
        } catch (err) { reject(err); }
      };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function downloadBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    $('toast-message').textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4200);
  }
  function hideToast() {
    $('toast').classList.remove('is-visible');
    clearTimeout(toastTimer);
  }
  $('toast-close').addEventListener('click', hideToast);

  window.I18N.applyStatic();
  loadLoved();
  loadFamilyPhoto();
  buildPalette();
  render();
  stage.refreshArt();
})(window.AltarCore, window.AltarStage);
