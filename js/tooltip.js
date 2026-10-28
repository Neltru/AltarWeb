/* =========================================================================
 * GLOBO DE AYUDA (tooltip)
 * -------------------------------------------------------------------------
 * Reemplaza el cuadro negro nativo del navegador (atributo `title`) por un
 * globo redondeado que usa los colores del objeto sobre el que está el cursor.
 *
 *   data-tip-title="Nombre"   (opcional) título en negritas
 *   data-tip="Descripción"    texto del globo
 *   title="Texto"             cualquier `title` se convierte solo en un globo
 *
 * Los colores salen de las variables CSS --c1 y --c2 del elemento (las que ya
 * usan los objetos del inventario para su fondo). Sin ellas, usa el morado
 * por defecto. Solo aparece con ratón (en pantallas táctiles no hay "hover").
 * ========================================================================= */
(function () {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.appendChild(tip);

  let current = null;
  let showTimer = 0;

  // Un `title` nativo se guarda en data-tip para que el navegador no dibuje el suyo.
  function adoptTitle(el) {
    if (el.hasAttribute('title')) {
      const t = el.getAttribute('title');
      if (t) el.dataset.tip = t;
      el.removeAttribute('title');
    }
  }

  function colors(el) {
    const cs = getComputedStyle(el);
    const c1 = cs.getPropertyValue('--c1').trim() || '#7a2bd6';
    const c2 = cs.getPropertyValue('--c2').trim() || '#3a1266';
    return { c1, c2 };
  }

  function fill(el) {
    const title = el.dataset.tipTitle;
    const text = el.dataset.tip || '';
    tip.textContent = '';
    if (title) {
      const b = document.createElement('strong');
      b.className = 'tip__title';
      b.textContent = title;
      tip.appendChild(b);
    }
    if (text) {
      const p = document.createElement('span');
      p.className = 'tip__text';
      p.textContent = text;
      tip.appendChild(p);
    }
    const { c1, c2 } = colors(el);
    tip.style.setProperty('--tip-1', c1);
    tip.style.setProperty('--tip-2', c2);
  }

  function place(el) {
    const m = 12;
    const r = el.getBoundingClientRect();
    tip.style.left = '0px'; tip.style.top = '0px';
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    let x, y, side;
    // Prefiere la derecha del objeto (el inventario está a la izquierda), luego arriba/abajo/izquierda.
    if (r.right + m + w <= vw - 8) { x = r.right + m; y = r.top + r.height / 2 - h / 2; side = 'right'; }
    else if (r.top - m - h >= 8) { x = r.left + r.width / 2 - w / 2; y = r.top - m - h; side = 'top'; }
    else if (r.bottom + m + h <= vh - 8) { x = r.left + r.width / 2 - w / 2; y = r.bottom + m; side = 'bottom'; }
    else { x = r.left - m - w; y = r.top + r.height / 2 - h / 2; side = 'left'; }
    x = Math.min(Math.max(8, x), vw - w - 8);
    y = Math.min(Math.max(8, y), vh - h - 8);
    tip.dataset.side = side;
    tip.style.left = Math.round(x) + 'px';
    tip.style.top = Math.round(y) + 'px';
    // La flechita apunta al centro del objeto aunque el globo se haya desplazado.
    const ax = Math.min(Math.max(18, r.left + r.width / 2 - x), w - 18);
    const ay = Math.min(Math.max(18, r.top + r.height / 2 - y), h - 18);
    tip.style.setProperty('--arrow-x', ax + 'px');
    tip.style.setProperty('--arrow-y', ay + 'px');
  }

  function show(el) {
    fill(el);
    tip.hidden = false;
    place(el);
    tip.classList.add('is-on');
  }

  function hide() {
    clearTimeout(showTimer);
    current = null;
    tip.classList.remove('is-on');
    tip.hidden = true;
  }

  document.addEventListener('mouseover', (e) => {
    if (!canHover.matches || document.body.classList.contains('is-dragging')) return;
    let el = e.target.closest && e.target.closest('[title], [data-tip]');
    if (el) adoptTitle(el);
    if (!el || (!el.dataset.tip && !el.dataset.tipTitle)) { if (!el) hide(); return; }
    if (el === current) return;
    clearTimeout(showTimer);
    current = el;
    showTimer = setTimeout(() => { if (current === el && document.body.contains(el)) show(el); }, 180);
  });

  document.addEventListener('mouseout', (e) => {
    if (!current) return;
    if (e.relatedTarget && current.contains(e.relatedTarget)) return;
    hide();
  });

  // Al empezar a arrastrar, desplazar o escribir, el globo sobra.
  ['pointerdown', 'wheel', 'keydown', 'scroll', 'blur'].forEach((t) =>
    window.addEventListener(t, hide, { passive: true, capture: true }));
})();
