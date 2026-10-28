/* =========================================================================
 * ILUSTRACIONES · Escenario: niveles, manteles, fondo y papel picado colgante
 * ========================================================================= */
(function (PH) {
  const { kit, bloom, sparkle, OUT, petals } = PH;
  const NS = 'xmlns="http://www.w3.org/2000/svg"';

  /* ---------------------------------------------------------------- colores */
  // Colores festivos del papel picado (se reparten banderita por banderita).
  const PAPER = ['#ff3e9a', '#ff8a00', '#ffd23f', '#2fe0d0', '#7ed321', '#a56bff', '#ff5a5a', '#4aa8ff'];

  /* ----------------------------------------------------------------- niveles */
  // Dibujo de un nivel del altar (w × h). `pal` = { a, b, trim, trim2 }.
  // `idx` elige el motivo decorativo del frente.
  PH.floorArt = (w, h, pal, idx = 0) => {
    const k = kit();
    const n = Math.max(6, Math.round(w / 52));
    const cell = (w - 16) / n;
    const mid = h * 0.58;
    let motif = '';
    for (let i = 0; i < n; i++) {
      const cx = 8 + cell * (i + 0.5);
      const s = Math.min(cell * 0.32, h * 0.2);
      const alt = i % 2 ? pal.trim2 : pal.trim;
      switch (idx % 4) {
        case 0: // rombos
          motif += `<path class="ot" d="M${cx} ${mid - s * 1.3} L${cx + s} ${mid} L${cx} ${mid + s * 1.3} L${cx - s} ${mid}Z" fill="${alt}"/><circle cx="${cx}" cy="${mid}" r="${s * 0.34}" fill="#fff" opacity=".9"/>`;
          break;
        case 1: // flores
          motif += `${petals(cx, mid, 6, s * 0.42, s * 0.6, s * 0.72, alt)}<circle class="ot" cx="${cx}" cy="${mid}" r="${s * 0.4}" fill="#fff6b0"/>`;
          break;
        case 2: // arcos
          motif += `<path class="ot" d="M${cx - s} ${mid + s} A${s} ${s * 1.2} 0 0 1 ${cx + s} ${mid + s}Z" fill="${alt}"/><circle cx="${cx}" cy="${mid + s * 0.2}" r="${s * 0.3}" fill="#fff" opacity=".9"/>`;
          break;
        default: // zigzag de triángulos
          motif += `<path class="ot" d="M${cx - s} ${mid + s} L${cx} ${mid - s} L${cx + s} ${mid + s}Z" fill="${alt}"/><circle cx="${cx}" cy="${mid + s * 0.35}" r="${s * 0.26}" fill="#fff" opacity=".9"/>`;
      }
    }
    // Flequillo de triángulos que cuelga del borde superior.
    const fn = Math.round((w - 12) / 16);
    const fcell = (w - 12) / fn;
    const fringe = Array.from({ length: fn }, (_, i) =>
      `<path class="ot" d="M${6 + i * fcell} 12 H${6 + (i + 1) * fcell} L${6 + (i + 0.5) * fcell} ${12 + Math.min(14, h * 0.17)}Z" fill="${i % 2 ? pal.trim2 : pal.trim}"/>`).join('');
    return `<svg ${NS} viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="ph"><defs></defs>
      <rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="9" fill="${k.g(pal.a, pal.b)}"/>
      <rect x="3" y="3" width="${w - 6}" height="11" rx="6" fill="#fff" opacity=".35"/>
      ${fringe}
      ${motif}
      <rect x="6" y="${h - 14}" width="${w - 12}" height="5" rx="2.5" fill="${pal.trim}" opacity=".95" class="ot"/>
      <rect x="6" y="${h - 8}" width="${w - 12}" height="2.6" rx="1.3" fill="#fff" opacity=".55"/>
      <rect x="3" y="${h * 0.45}" width="${w - 6}" height="${h * 0.5}" fill="#000" opacity=".06"/>
    </svg>`.replace('<defs></defs>', k.D.length ? `<defs>${k.D.join('')}</defs>` : '');
  };

  /* ----------------------------------------------------------------- manteles */
  const cloth = (w, h, body, defs = '') =>
    `<svg ${NS} viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="ph">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
  const lin = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

  Object.assign(PH, {
    clothPlain: (w, h) => cloth(w, h, `<rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="url(#cpl)"/><rect x="5" y="${h - 12}" width="${w - 10}" height="4" rx="2" fill="#fff" opacity=".7"/>`, lin('cpl', '#ff7ad1', '#c2185b')),

    clothStripes: (w, h) => cloth(w, h, `<rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="url(#cst)"/>
      <rect x="2" y="${h * 0.2}" width="${w - 4}" height="${h * 0.12}" fill="#2fe0d0"/><rect x="2" y="${h * 0.42}" width="${w - 4}" height="${h * 0.05}" fill="#fff"/>
      <rect x="2" y="${h * 0.62}" width="${w - 4}" height="${h * 0.12}" fill="#a56bff"/>`, lin('cst', '#ffb347', '#e8560a')),

    clothScallop: (w, h) => {
      const r = h * 0.16;
      const n = Math.max(1, Math.round((w - 3) / (r * 2)));
      const step = (w - 3) / n;
      let d = `M1.5 1.5 H${w - 1.5} V${h * 0.6}`;
      for (let i = n - 1; i >= 0; i--) d += ` Q${(1.5 + step * (i + 0.5)).toFixed(1)} ${(h * 0.6 + r * 2).toFixed(1)} ${(1.5 + step * i).toFixed(1)} ${h * 0.6}`;
      d += ' Z';
      return cloth(w, h, `<path class="o" d="${d}" fill="url(#csc)"/>
        ${Array.from({ length: n }, (_, i) => `<circle cx="${(1.5 + step * (i + 0.5)).toFixed(1)}" cy="${h * 0.6 + r * 0.5}" r="${r * 0.28}" fill="#ff4f9a"/>`).join('')}
        <rect x="2" y="${h * 0.14}" width="${w - 4}" height="${h * 0.1}" fill="#ff4f9a" opacity=".9"/>`, lin('csc', '#fff08a', '#ffc233'));
    },

    clothPicado: (w, h) => {
      const n = Math.max(6, Math.round(w / 38));
      const cell = (w - 6) / n;
      let holes = '';
      for (let i = 0; i < n; i++) {
        const cx = 3 + cell * (i + 0.5);
        holes += `<path d="M${cx} ${h * 0.3} l${cell * 0.2} ${h * 0.16} l${-cell * 0.2} ${h * 0.16} l${-cell * 0.2} ${-h * 0.16}Z" fill="#ffe27a"/><circle cx="${cx}" cy="${h * 0.8}" r="${cell * 0.1}" fill="#ffe27a"/>`;
      }
      return cloth(w, h, `<rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="url(#cpi)"/>${holes}<rect x="5" y="${h * 0.12}" width="${w - 10}" height="3" fill="#ffe27a" opacity=".8"/>`, lin('cpi', '#b07bff', '#5a22b8'));
    },

    clothBordado: (w, h) => {
      const n = Math.max(6, Math.round(w / 46));
      const cell = (w - 6) / n;
      let fl = '';
      for (let i = 0; i < n; i++) {
        const cx = 3 + cell * (i + 0.5);
        const c = ['#ff4f9a', '#7a2bd6', '#ff8a00'][i % 3];
        fl += `${petals(cx, h * 0.5, 6, 3.4, 5, 7.4, c)}<circle class="ot" cx="${cx}" cy="${h * 0.5}" r="3" fill="#ffd23f"/><path class="ot" d="M${cx - 12} ${h * 0.5} q6 -6 10 0 M${cx + 12} ${h * 0.5} q-6 6 -10 0" fill="none" stroke="#2f8f3a" stroke-width="2"/>`;
      }
      return cloth(w, h, `<rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="url(#cbo)"/>${fl}<rect x="5" y="${h - 12}" width="${w - 10}" height="4" rx="2" fill="#2fe0d0"/>`, lin('cbo', '#ffffff', '#ead9ff'));
    },

    clothSarape: (w, h) => {
      const n = Math.max(8, Math.round(w / 30));
      const cell = (w - 6) / n;
      const zig = Array.from({ length: n }, (_, i) => `<path d="M${3 + i * cell} ${h * 0.7} l${cell / 2} ${-h * 0.34} l${cell / 2} ${h * 0.34}Z" fill="${['#ffd23f', '#ff4f9a', '#2fe0d0'][i % 3]}" stroke="${OUT}" stroke-width="1.2"/>`).join('');
      return cloth(w, h, `<rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="url(#csa)"/>${zig}<rect x="2" y="${h * 0.76}" width="${w - 4}" height="${h * 0.1}" fill="#ffd23f"/><rect x="2" y="${h * 0.12}" width="${w - 4}" height="${h * 0.08}" fill="#ffd23f"/>`, lin('csa', '#3fcf6a', '#1a7a3a'));
    },

    /* --------------------------------------------- papel picado colgante */
    // Cada banderita recibe (ancho, alto, alterna, k = número de banderita).
    // Los calados son huecos reales (fill-rule evenodd).
    flagClassic: (w, h, alt, i = 0) => {
      const c = PAPER[i % PAPER.length];
      const sc = w / 5;
      let outer = `M0 0 H${w} V${h - 6}`;
      for (let j = 4; j >= 0; j--) outer += ` Q${(sc * (j + 0.5)).toFixed(1)} ${h + 4} ${(sc * j).toFixed(1)} ${h - 6}`;
      outer += 'Z';
      const circ = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
      const holes = circ(w * 0.28, h * 0.32, w * 0.09) + circ(w * 0.72, h * 0.32, w * 0.09) +
        `M${w / 2} ${h * 0.2} l${w * 0.12} ${h * 0.14} l${-w * 0.12} ${h * 0.14} l${-w * 0.12} ${-h * 0.14}Z` +
        circ(w * 0.3, h * 0.62, w * 0.05) + circ(w * 0.5, h * 0.66, w * 0.05) + circ(w * 0.7, h * 0.62, w * 0.05);
      return `<path class="ot" fill-rule="evenodd" fill="${c}" d="${outer}${holes}"/><path d="M0 0 H${w} V4 H0Z" fill="#fff" opacity=".4"/>`;
    },

    flagTriangle: (w, h, alt, i = 0) => {
      const c = PAPER[(i + 3) % PAPER.length];
      const circ = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
      return `<path class="ot" fill-rule="evenodd" fill="${c}" d="M0 0 H${w} L${w / 2} ${h}Z${circ(w / 2, h * 0.26, w * 0.1)}${circ(w / 2, h * 0.5, w * 0.06)}"/><path d="M0 0 H${w} V4 H0Z" fill="#fff" opacity=".4"/>`;
    },

    flagScallop: (w, h, alt, i = 0) => {
      const c = PAPER[(i + 5) % PAPER.length];
      const sc = w / 4;
      let outer = `M0 0 H${w} V${h * 0.7}`;
      for (let j = 3; j >= 0; j--) outer += ` Q${(sc * (j + 0.5)).toFixed(1)} ${h * 1.12} ${(sc * j).toFixed(1)} ${h * 0.7}`;
      outer += 'Z';
      const wave = (y) => `M${w * 0.14} ${y} q${w * 0.18} ${-h * 0.14} ${w * 0.36} 0 t${w * 0.36} 0 v${h * 0.07} q${-w * 0.18} ${h * 0.14} ${-w * 0.36} 0 t${-w * 0.36} 0Z`;
      return `<path class="ot" fill-rule="evenodd" fill="${c}" d="${outer}${wave(h * 0.24)}${wave(h * 0.46)}"/><path d="M0 0 H${w} V4 H0Z" fill="#fff" opacity=".4"/>`;
    },

    flagCalado: (w, h, alt, i = 0) => {
      const c = PAPER[(i + 1) % PAPER.length];
      const z = w / 4;
      let outer = `M0 0 H${w} V${h - 8}`;
      for (let j = 3; j >= 0; j--) outer += ` L${(z * (j + 0.5)).toFixed(1)} ${h} L${(z * j).toFixed(1)} ${h - 8}`;
      outer += 'Z';
      const star = (cx, cy, r) => `M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3}Z`;
      return `<path class="ot" fill-rule="evenodd" fill="${c}" d="${outer}${star(w / 2, h * 0.34, w * 0.26)}${star(w * 0.2, h * 0.7, w * 0.1)}${star(w * 0.8, h * 0.7, w * 0.1)}"/><path d="M0 0 H${w} V4 H0Z" fill="#fff" opacity=".4"/>`;
    },

    /* ------------------------------------------------------------------ fondo */
    // Fondo del altar (arco de cempasúchil, rayos y destellos) en coordenadas del lienzo.
    backdrop: (W, H, withBg = false) => {
      const k = kit();
      const cx = W / 2;
      const cy = H * 0.64;
      const rx = W * 0.47;
      const ry = H * 0.6;
      let out = '';
      if (withBg) {
        out += `<rect width="${W}" height="${H}" fill="${k.g('#3a0f63', '#1a0630')}"/>`;
      }
      // Halo y rayos detrás del nivel superior.
      out += `<circle cx="${cx}" cy="${H * 0.22}" r="${W * 0.34}" fill="${k.r('#ff9ad8', '#3a0f63')}" opacity=".35"/>`;
      out += Array.from({ length: 16 }, (_, i) => {
        const a = Math.PI + (i * Math.PI) / 15;
        const a2 = a + 0.07;
        const L = W * 0.7;
        return `<path d="M${cx} ${H * 0.28} L${(cx + Math.cos(a) * L).toFixed(0)} ${(H * 0.28 + Math.sin(a) * L).toFixed(0)} L${(cx + Math.cos(a2) * L).toFixed(0)} ${(H * 0.28 + Math.sin(a2) * L).toFixed(0)}Z" fill="#ffe27a" opacity=".07"/>`;
      }).join('');
      // Arco de cempasúchil que rodea el altar.
      out += `<path d="M${cx - rx} ${H} A${rx} ${ry} 0 0 1 ${cx + rx} ${H}" fill="none" stroke="#1f7a3a" stroke-width="26" opacity=".95"/>`;
      const cols = [['#ffd23f', '#ff8a00', '#b84a00'], ['#ffb000', '#ff6a00', '#a23c00'], ['#ffe066', '#ffa000', '#b86200']];
      const N = 30;
      for (let i = 0; i <= N; i++) {
        const a = Math.PI + (i * Math.PI) / N;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry + (H - cy) * 0 + 0;
        if (y > H - 20) continue;
        const c = cols[i % 3];
        out += bloom(k, x.toFixed(1), (y).toFixed(1), 19 + (i % 2) * 3, c[0], c[1], c[2]);
        if (i % 5 === 2) out += bloom(k, (x + 12).toFixed(1), (y - 14).toFixed(1), 10, '#ff7ad1', '#d41f86', '#7a0a4b');
      }
      // Destellos.
      const spots = [[120, 110], [880, 100], [210, 250], [790, 230], [330, 60], [680, 70], [60, 330], [940, 320], [500, 40]];
      out += spots.map(([x, y], i) => sparkle(x, y, 8 + (i % 3) * 3, i % 2 ? '#fff6b0' : '#ffd0f2', i * 0.35)).join('');
      return `<svg ${NS} viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="ph"><defs>${k.D.join('')}</defs>${out}</svg>`;
    },
  });
})(window.AltarPlaceholders);
