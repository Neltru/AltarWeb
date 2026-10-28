/* =========================================================================
 * LIENZO (DOM)
 * -------------------------------------------------------------------------
 * Dibuja los pisos y los elementos dentro de un contenedor y lo escala para
 * que quepa. Lo usan tanto la landing (vista previa) como el editor.
 * ========================================================================= */
window.AltarStage = (function (Core) {
  const { CFG } = Core;

  function create(container, { interactive = false } = {}) {
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.style.width = CFG.stage.width + 'px';
    stage.style.height = CFG.stage.height + 'px';
    container.appendChild(stage);

    // Fondo decorativo (arco de cempasúchil, rayos, destellos).
    const back = document.createElement('div');
    back.className = 'stage__back';
    back.innerHTML = window.AltarPlaceholders.backdrop(CFG.stage.width, CFG.stage.height);
    stage.appendChild(back);

    const floorEls = CFG.floors.map((_, i) => {
      const r = Core.floorRect(i);
      const el = document.createElement('div');
      el.className = 'floor';
      el.dataset.floor = i;
      Object.assign(el.style, {
        left: r.left + 'px', top: r.top + 'px',
        width: r.width + 'px', height: r.height + 'px',
      });
      el.innerHTML = `<div class="floor__art">${Core.renderFloorArt(i)}</div><div class="floor__cloth"></div><span class="floor__tag">${I18N.t('floorFull')}</span>` +
        (interactive ? `
        <button class="floor__btn floor__btn--cloth" type="button" data-floor="${i}"
          aria-label="${I18N.t('clothOf', { level: Core.floorLabel(i) })}" title="${I18N.t('cloth')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v5H3z"/><path d="M3 12l2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3"/></svg>
        </button>` : '');
      // Botón de mantel en el extremo izquierdo. La información del nivel se abre
      // haciendo clic en el propio nivel (ver js/editor.js).
      if (interactive) el.title = I18N.t('floorTip', { level: Core.floorLabel(i) });
      stage.appendChild(el);
      return el;
    });

    // Marcas de los espacios de cada piso (solo en el editor). Se ven al
    // arrastrar o al pasar el cursor por el piso; se crean después de todos
    // los pisos para quedar por encima de ellos.
    const slotEls = CFG.floors.map((_, i) => {
      if (!interactive) return [];
      return Array.from({ length: Core.slotCount(i) }, (_, k) => {
        const s = Core.slotRect(i, k);
        const h = Math.min(56, CFG.floors[i].height - 6);
        const el = document.createElement('div');
        el.className = 'slot';
        Object.assign(el.style, {
          left: s.left + CFG.layout.slotGap / 2 + 'px', top: s.top - h + 'px',
          width: s.width - CFG.layout.slotGap + 'px', height: h + 'px',
        });
        stage.appendChild(el);
        return el;
      });
    });

    // Lugares para el papel picado colgante: uno por lugar de CFG.garlandSpots.
    const garlandEls = Object.fromEntries((CFG.garlandSpots || []).map((sp) => {
      const { x, y, w, h } = Core.garlandGeometry(sp).box;
      const el = document.createElement('div');
      el.className = 'garland';
      el.dataset.spot = sp.id;
      Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      el.innerHTML = `<div class="garland__art"></div>` +
        (interactive ? `<button class="item__delete garland__delete" type="button" aria-label="${I18N.t('removeGarland', { name: sp.name })}">×</button>` : '');
      stage.appendChild(el);
      return [sp.id, el];
    }));

    const itemEls = new Map(); // uid → elemento DOM
    let scale = 1;

    function fit() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      scale = Math.min(cw / CFG.stage.width, ch / CFG.stage.height);
      stage.style.transform = `scale(${scale})`;
      // Escala inversa: permite que controles (flechas) conserven su tamaño en pantalla.
      stage.style.setProperty('--inv-scale', 1 / scale);
      stage.style.left = (cw - CFG.stage.width * scale) / 2 + 'px';
      stage.style.top = (ch - CFG.stage.height * scale) / 2 + 'px';
    }
    // Proporción del lienzo disponible en CSS (var(--stage-ratio)).
    container.style.setProperty('--stage-ratio', `${CFG.stage.width} / ${CFG.stage.height}`);
    new ResizeObserver(fit).observe(container);
    fit();

    // Sincroniza el DOM con el estado (reutiliza nodos para animar el reacomodo).
    function render(state, { selectedUid = null, draggingUid = null, selectedSpot = null } = {}) {
      // Papel picado colgante: solo se redibuja si cambió.
      for (const [spotId, el] of Object.entries(garlandEls)) {
        const id = state.garlands[spotId] || '';
        if (el.dataset.garland !== id) {
          el.dataset.garland = id;
          const garland = Core.getGarland(id);
          el.querySelector('.garland__art').innerHTML = garland ? Core.renderGarland(garland, Core.getSpot(spotId)) : '';
          el.classList.toggle('has-garland', !!garland);
          if (garland) el.title = garland.name;
          else el.removeAttribute('title');
        }
        el.classList.toggle('is-selected', spotId === selectedSpot);
      }

      const seen = new Set();
      state.slots.forEach((items, i) => {
        floorEls[i].classList.toggle('is-full', Core.isFloorFull(state, i));
        // Mantel: solo se redibuja si cambió.
        const clothId = state.cloths[i] || '';
        if (floorEls[i].dataset.cloth !== clothId) {
          floorEls[i].dataset.cloth = clothId;
          const cloth = Core.getCloth(clothId);
          const r = Core.floorRect(i);
          floorEls[i].querySelector('.floor__cloth').innerHTML = cloth ? Core.renderCloth(cloth, r.width, r.height) : '';
          floorEls[i].classList.toggle('has-cloth', !!cloth);
        }
        Core.layoutFloor(items, i).forEach((p) => {
          seen.add(p.uid);
          let el = itemEls.get(p.uid);
          if (!el) {
            el = document.createElement('div');
            el.className = 'item is-entering';
            el.dataset.uid = p.uid;
            el.dataset.type = p.type;
            const entry = Core.getEntry(p.type);
            el.title = entry.name;
            el.innerHTML = `<div class="item__art">${Core.renderArt(entry)}</div>` +
              (interactive ? `<button class="item__delete" type="button" aria-label="${I18N.t('removeItem', { name: entry.name })}">×</button>` : '');
            stage.appendChild(el);
            itemEls.set(p.uid, el);
            requestAnimationFrame(() => el.classList.remove('is-entering'));
          }
          Object.assign(el.style, {
            left: p.x + 'px', top: p.y + 'px', width: p.w + 'px', height: p.h + 'px',
          });
          el.classList.toggle('is-selected', p.uid === selectedUid);
          el.classList.toggle('is-dragging', p.uid === draggingUid);
        });
      });
      for (const [id, el] of itemEls) if (!seen.has(id)) { el.remove(); itemEls.delete(id); }
    }

    // Redibuja los objetos que dependen de los datos del difunto.
    function refreshArt() {
      itemEls.forEach((el) => {
        const entry = Core.getEntry(el.dataset.type);
        if (entry && entry.dynamic) el.querySelector('.item__art').innerHTML = Core.renderArt(entry);
      });
    }

    // Convierte coordenadas de pantalla a coordenadas del lienzo.
    function toStage(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      return { x: (clientX - r.left) / scale, y: (clientY - r.top) / scale };
    }

    // Marca el piso y el espacio destino durante un arrastre
    // (`blocked` = no se puede soltar ahí).
    function highlight(i, blocked, slot = null) {
      floorEls.forEach((el, k) => {
        el.classList.toggle('is-target', k === i && !blocked);
        el.classList.toggle('is-blocked', k === i && blocked);
      });
      slotEls.forEach((row, k) => row.forEach((el, j) => {
        el.classList.toggle('is-target', k === i && j === slot && !blocked);
      }));
    }

    // Lugar de papel picado más cercano al punto (coordenadas del lienzo).
    function nearestSpot(p) {
      let best = null;
      let bestD = Infinity;
      for (const sp of CFG.garlandSpots || []) {
        const b = Core.garlandGeometry(sp).box;
        const d = Math.hypot(b.x + b.w / 2 - p.x, b.y + b.h / 2 - p.y);
        if (d < bestD) { bestD = d; best = sp.id; }
      }
      return best;
    }

    // Marca el lugar donde se colgará el papel picado durante un arrastre.
    const highlightSpot = (id) => Object.entries(garlandEls)
      .forEach(([spotId, el]) => el.classList.toggle('is-target', spotId === id));

    // Piso bajo el punto (coordenadas del lienzo). `extra` amplía la zona hacia
    // ambos lados para incluir los botones de los extremos. null si no hay ninguno.
    function floorAt(p, extra = 0) {
      for (let i = 0; i < CFG.floors.length; i++) {
        const r = Core.floorRect(i);
        if (p.y >= r.top && p.y <= r.top + r.height && p.x >= r.left - extra && p.x <= r.left + r.width + extra) return i;
      }
      return null;
    }

    // Muestra la flecha del piso `i` (al pasar el cursor o al tocar el piso).
    // También muestra sus espacios, para ver dónde se puede colocar algo.
    const setHover = (i) => {
      floorEls.forEach((el, k) => el.classList.toggle('is-hover', k === i));
      slotEls.forEach((row, k) => row.forEach((el) => el.classList.toggle('is-visible', k === i)));
    };
    // Ilumina el piso `i` (al abrir su información). null = ninguno.
    const setLit = (i) => floorEls.forEach((el, k) => el.classList.toggle('is-lit', k === i));

    // Vuelve a escribir los textos del altar cuando cambia el idioma.
    function relabel() {
      floorEls.forEach((el, i) => {
        const tag = el.querySelector('.floor__tag');
        if (tag) tag.textContent = I18N.t('floorFull');
        if (!interactive) return;
        el.title = I18N.t('floorTip', { level: Core.floorLabel(i) });
        const cb = el.querySelector('.floor__btn--cloth');
        if (cb) { cb.title = I18N.t('cloth'); cb.setAttribute('aria-label', I18N.t('clothOf', { level: Core.floorLabel(i) })); }
      });
      for (const [spotId, el] of Object.entries(garlandEls)) {
        const g = Core.getGarland(el.dataset.garland);
        if (g) el.title = g.name;
        const del = el.querySelector('.garland__delete');
        if (del) del.setAttribute('aria-label', I18N.t('removeGarland', { name: Core.getSpot(spotId).name }));
      }
      for (const el of itemEls.values()) {
        const entry = Core.getEntry(el.dataset.type);
        el.title = entry.name;
        const del = el.querySelector('.item__delete');
        if (del) del.setAttribute('aria-label', I18N.t('removeItem', { name: entry.name }));
      }
    }

    return {
      el: stage, floorEls, render, refreshArt, relabel, toStage, highlight, fit, floorAt, setHover, setLit,
      nearestSpot, highlightSpot,
      get scale() { return scale; },
    };
  }

  return { create };
})(window.AltarCore);
