/* =========================================================================
 * ILUSTRACIONES · Iluminación, decoración y flores
 * ========================================================================= */
(function (PH) {
  const { make, petals, bloom, sparkle, flame } = PH;

  const leaf = (k, x, y, rot, s = 1) =>
    `<path class="ot" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0 C6 -4 14 -4 20 0 C14 5 6 5 0 0Z" fill="${k.g('#7bd36a', '#23853a')}"/>`;

  // Vela alargada: (x) centro, (top) cuerpo, (base) base, ancho (w).
  const taper = (k, x, top, base, w, c1, c2, delay = 0) => `
    <path class="o" d="M${x - w / 2} ${top + 2} Q${x} ${top - 2} ${x + w / 2} ${top + 2} V${base} H${x - w / 2}Z" fill="${k.g(c1, c2, 'h')}"/>
    <path class="o" d="M${x - w / 2} ${top + 2} Q${x} ${top - 2} ${x + w / 2} ${top + 2} Q${x + w / 4} ${top + 8} ${x + w / 6} ${top + 5} Q${x} ${top + 11} ${x - w / 4} ${top + 5} Q${x - w / 3} ${top + 8} ${x - w / 2} ${top + 2}Z" fill="${k.g('#ffffff', c1, 'v')}" opacity=".85"/>
    <path class="sh" d="M${x - w / 2 + 2} ${top + 9} H${x - w / 2 + 4.4} V${base - 3} H${x - w / 2 + 2}Z"/>
    <path class="ln" d="M${x} ${top} V${top - 4}"/>
    ${flame(k, x, top - 3, 15, delay)}`;

  // Florero (cuello y panza) en (x) centro, base en (y).
  const vase = (k, c1, c2, x, y, w, h) => `
    <path class="o" d="M${x - w * 0.22} ${y - h} h${w * 0.44} q${w * 0.04} ${h * 0.25} ${w * 0.3} ${h * 0.45} q${w * 0.2} ${h * 0.3} ${-w * 0.02} ${h * 0.55} h${-w * 0.96} q${-w * 0.22} ${-h * 0.25} ${-w * 0.02} ${-h * 0.55} q${w * 0.26} ${-h * 0.2} ${w * 0.3} ${-h * 0.45}Z" fill="${k.g(c1, c2, 'h')}"/>
    <ellipse class="ot" cx="${x}" cy="${y - h}" rx="${w * 0.22}" ry="${h * 0.05}" fill="${c2}"/>
    <path class="sh" d="M${x - w * 0.3} ${y - h * 0.45} q-2 ${h * 0.2} 2 ${h * 0.34}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>`;

  // Maceta de barro (x centro, y base).
  const pot = (k, c1, c2, x, y, w, h, band = '#ffd23f') => `
    <path class="o" d="M${x - w / 2} ${y - h} H${x + w / 2} L${x + w * 0.38} ${y} H${x - w * 0.38}Z" fill="${k.g(c1, c2, 'h')}"/>
    <rect class="o" x="${x - w * 0.56}" y="${y - h - 4}" width="${w * 1.12}" height="8" rx="3" fill="${k.g(c1, c2)}"/>
    <path class="ot" d="M${x - w * 0.46} ${y - h * 0.55} H${x + w * 0.46}" stroke="${band}" stroke-width="3" fill="none"/>
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${x - w * 0.34 + i * w * 0.17}" cy="${y - h * 0.3}" r="1.7" fill="${band}"/>`).join('')}`;

  // Ramo de flores: cabezas en [x, y, r, [c1,c2,centro]] y tallos que se juntan abajo.
  const bunch = (k, heads, ox = 35, oy = 66) =>
    heads.map(([x, y]) => `<path class="ln" d="M${ox} ${oy} Q${(x + ox) / 2} ${(y + oy) / 2 + 6} ${x} ${y}" stroke="#23853a" stroke-width="3"/>`).join('') +
    leaf(k, ox - 2, oy - 12, -150, 0.9) + leaf(k, ox + 2, oy - 18, -30, 0.9) +
    heads.map(([x, y, r, c]) => bloom(k, x, y, r, c[0], c[1], c[2])).join('');

  const MARI = ['#ffd23f', '#ff8a00', '#b84a00'];
  const MARI2 = ['#ffb000', '#ff6a00', '#a23c00'];

  // Una cresta de gallo (terciopelo): conjunto de bultos rojos.
  const velvet = (k, cx, cy, s) =>
    [[-7, 2], [0, -4], [7, 1], [-3, 5], [4, 6], [0, 1]].map(([dx, dy]) =>
      `<circle class="ot" cx="${cx + dx * s}" cy="${cy + dy * s}" r="${6 * s}" fill="${k.r('#ff5a7a', '#8a0a3a')}"/>`).join('');

  Object.assign(PH, {
    /* ---------------------------------------------------------------- velas */
    vela: make('0 0 30 80', (k) => taper(k, 15, 28, 78, 15, '#fff6dc', '#f3d9a0') +
      `<ellipse class="o" cx="15" cy="78" rx="11" ry="2.5" fill="${k.g('#d9a441', '#9b6a1b')}"/>`),

    // Tres velas de colores festivos.
    velaColores: make('0 0 66 80', (k) =>
      taper(k, 14, 34, 78, 14, '#ff7ad1', '#d41f86', 0) +
      taper(k, 33, 20, 78, 15, '#5ee6e0', '#0e9aa5', 0.35) +
      taper(k, 52, 38, 78, 14, '#ffe066', '#f5a300', 0.7) +
      `<ellipse class="o" cx="33" cy="78" rx="30" ry="2.8" fill="${k.g('#ffb000', '#b46a00')}"/>`),

    // Veladora: vaso de vidrio rojo con etiqueta e ilustración.
    veladora: make('0 0 46 70', (k) => `
      <path class="o" d="M7 20 H39 L35 66 Q23 70 11 66Z" fill="${k.g('#ff6a6a', '#b0102f', 'h')}"/>
      <ellipse class="o" cx="23" cy="20" rx="16" ry="4" fill="#ffd0a8"/>
      <ellipse cx="23" cy="20" rx="12" ry="2.6" fill="#fff6dc"/>
      <path d="M10 36 H36 L34 58 Q23 61 12 58Z" fill="${k.g('#fff2c4', '#ffd47a')}" stroke="${PH.OUT}" stroke-width="1.4"/>
      <circle class="o" cx="23" cy="43" r="4" fill="#f1c39a"/><path class="ot" d="M16 58 Q23 44 30 58Z" fill="#38c8b0"/>
      <path class="sh" d="M10 24 q-1 18 2 36" fill="none" stroke="#fff" stroke-width="2.6" opacity=".55"/>
      ${flame(k, 23, 19, 17)}`),

    // Cirio: vela gruesa y alta, decorada con flores y moño.
    cirio: make('0 0 44 96', (k) => `
      ${taper(k, 22, 24, 92, 22, '#fff8e6', '#f1cf8c')}
      <rect class="o" x="9" y="44" width="26" height="6" fill="${k.g('#ffd23f', '#d98f1a')}"/>
      <rect class="o" x="9" y="66" width="26" height="6" fill="${k.g('#ffd23f', '#d98f1a')}"/>
      <path class="o" d="M22 56 l-9 -7 q-3 8 9 7 q12 1 9 -7Z" fill="${k.g('#ff6ab8', '#c2185b')}"/>
      <circle class="o" cx="22" cy="56" r="3" fill="#ff4f9a"/>
      ${bloom(k, 12, 86, 7, ...MARI)}${bloom(k, 32, 86, 7, ...MARI2)}
      <ellipse class="o" cx="22" cy="92" rx="18" ry="3.2" fill="${k.g('#d9a441', '#8a5a14')}"/>`),

    candelabro: make('0 0 80 84', (k) => `
      <path class="o" d="M40 82 L30 80 Q40 74 40 62 Q40 74 50 80Z" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <path class="ln" d="M40 66 V44" stroke="#b9791a" stroke-width="5"/>
      <path class="o" d="M40 56 Q18 56 14 38 M40 56 Q62 56 66 38" fill="none" stroke="#d9a441" stroke-width="4"/>
      <ellipse class="o" cx="14" cy="38" rx="6" ry="2.6" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <ellipse class="o" cx="66" cy="38" rx="6" ry="2.6" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <ellipse class="o" cx="40" cy="44" rx="6" ry="2.6" fill="${k.g('#ffe27a', '#b9791a')}"/>
      ${taper(k, 14, 18, 38, 9, '#fff6dc', '#f3d9a0', 0)}${taper(k, 40, 24, 44, 9, '#ff9ad8', '#d41f86', 0.4)}${taper(k, 66, 18, 38, 9, '#fff6dc', '#f3d9a0', 0.8)}
      <rect class="o" x="26" y="76" width="28" height="6" rx="3" fill="${k.g('#ffe27a', '#b9791a')}"/>`),

    /* --------------------------------------------------- faroles y adornos */
    // Farol de hojalata con calados que brillan.
    farol: make('0 0 56 86', (k) => `
      <path class="ln" d="M16 16 Q28 -4 40 16" stroke-width="2.6"/>
      <circle class="o" cx="28" cy="6" r="3" fill="#ffd23f"/>
      <path class="o" d="M12 20 H44 L40 24 H16Z" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <path class="o" d="M16 24 H40 L43 68 H13Z" fill="${k.g('#ffe9a0', '#ff8a1c')}"/>
      <circle class="ph-glow" cx="28" cy="46" r="15" fill="#fff3a0" opacity=".6"/>
      <g fill="#fff9d6" stroke="${PH.OUT}" stroke-width="1">
        <path d="M28 33 l2.6 5.4 5.9 .8 -4.3 4.1 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.1 5.9 -.8Z"/>
        <circle cx="20" cy="30" r="2"/><circle cx="36" cy="30" r="2"/><circle cx="19" cy="58" r="2"/><circle cx="37" cy="58" r="2"/><circle cx="28" cy="61" r="2.4"/>
      </g>
      <path class="ln" d="M22 24 L20.5 68 M34 24 L35.5 68" stroke="#b9791a" stroke-width="2"/>
      <path class="o" d="M10 68 H46 L43 76 H13Z" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <path class="o" d="M16 76 H40 L38 84 H18Z" fill="${k.g('#e2793a', '#8a3a14')}"/>`),

    // Farolito de papel con borlas.
    farolito: make('0 0 60 88', (k) => `
      <path class="ln" d="M30 2 V12"/>
      <ellipse class="o" cx="30" cy="14" rx="9" ry="4" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <path class="o" d="M30 14 C-2 20 -2 60 30 66 C62 60 62 20 30 14Z" fill="${k.g('#ff6ab8', '#c2185b', 'h')}"/>
      <path class="ot" d="M30 14 C14 22 14 58 30 66 C46 58 46 22 30 14Z" fill="${k.g('#ffd23f', '#ff8a00', 'h')}"/>
      <path class="ot" d="M30 14 C26 26 26 54 30 66" fill="none"/>
      <circle class="ph-glow" cx="30" cy="40" r="10" fill="#fff6c8" opacity=".7"/>
      <path class="sh" d="M14 28 q-3 12 0 22" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
      <ellipse class="o" cx="30" cy="67" rx="9" ry="3.6" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <path class="ln" d="M24 70 V82 M30 70 V86 M36 70 V82" stroke="#ff4f9a" stroke-width="3"/>
      <circle class="o" cx="24" cy="83" r="3" fill="#ffd23f"/><circle class="o" cx="30" cy="86" r="3" fill="#33e0d0"/><circle class="o" cx="36" cy="83" r="3" fill="#ffd23f"/>`),

    // Corona de flores de cempasúchil con moño.
    corona: make('0 0 76 76', (k) => {
      let out = `<circle cx="38" cy="38" r="26" fill="none" stroke="#2f8f3a" stroke-width="12" class="ln"/>`;
      for (let i = 0; i < 14; i++) {
        const a = (i * 2 * Math.PI) / 14;
        const c = i % 3 === 0 ? ['#ff7ad1', '#d41f86', '#7a0a4b'] : i % 2 ? MARI : MARI2;
        out += bloom(k, (38 + Math.cos(a) * 26).toFixed(1), (38 + Math.sin(a) * 26).toFixed(1), 7.4, c[0], c[1], c[2]);
      }
      return out + `<path class="o" d="M38 68 l-12 6 4 -10Z M38 68 l12 6 -4 -10Z" fill="${k.g('#ff6ab8', '#c2185b')}"/><circle class="o" cx="38" cy="67" r="4" fill="#ff4f9a"/>`;
    }),

    // Alebrije: figura fantástica de colores.
    alebrije: make('0 0 76 64', (k) => `
      <path class="o" d="M52 14 C70 4 72 22 64 26 C60 20 56 20 52 22Z" fill="${k.g('#ffd23f', '#ff6a00')}"/>
      <path class="o" d="M10 26 C2 18 6 8 16 12 C14 18 18 22 20 24Z" fill="${k.g('#ff7ad1', '#d41f86')}"/>
      <path class="o" d="M18 56 V46 M30 56 V46 M48 56 V46 M60 56 V46" stroke="#33b5a5" stroke-width="6"/>
      <path class="ln" d="M18 56 V46 M30 56 V46 M48 56 V46 M60 56 V46" stroke-width="2.2" opacity="0"/>
      <ellipse class="o" cx="40" cy="38" rx="26" ry="14" fill="${k.g('#38d6c4', '#0f7f9a', 'd')}"/>
      <path class="o" d="M52 32 C52 14 70 14 72 24 C74 32 64 34 60 34Z" fill="${k.g('#ff9ad8', '#d41f86')}"/>
      <circle cx="64" cy="22" r="3.4" fill="#fff" stroke="${PH.OUT}" stroke-width="1.4"/><circle cx="65" cy="22" r="1.5" fill="${PH.OUT}"/>
      <path class="o" d="M56 14 l2 -9 5 8Z" fill="#ffd23f"/><path class="o" d="M64 13 l6 -8 1 10Z" fill="#ff8a00"/>
      <path class="o" d="M18 30 C6 24 8 10 22 16 C28 20 26 28 26 30Z" fill="${k.g('#ffe066', '#ff7a00')}"/>
      ${[[26, 36, '#ff4f9a'], [36, 32, '#ffd23f'], [46, 38, '#ff7a1a'], [34, 44, '#8e3ccf'], [52, 44, '#ffd23f'], [24, 44, '#ffe9a8']].map(([x, y, c]) => `<circle class="ot" cx="${x}" cy="${y}" r="3.4" fill="${c}"/>`).join('')}
      <path class="ln" d="M14 40 q-8 4 -6 12" stroke-width="3.4" stroke="#ff4f9a"/>
      ${sparkle(70, 8, 4, '#fff6b0', 0.4)}`),

    /* ---------------------------------------------------------------- flores */
    cempasuchil: make('0 0 76 86', (k) => bunch(k, [[24, 24, 14, MARI], [50, 22, 14, MARI2], [37, 40, 15, MARI], [18, 48, 11, MARI2], [57, 46, 11, MARI]], 38, 80) +
      `<path class="o" d="M30 70 L46 70 L44 80 L32 80Z" fill="${k.g('#ff6ab8', '#c2185b')}"/>`),

    // Canasta llena de cempasúchil.
    canastaFlores: make('0 0 80 70', (k) =>
      [[18, 24], [34, 18], [50, 20], [64, 26], [26, 36], [44, 34], [58, 38]].map(([x, y], i) => bloom(k, x, y, 12, ...(i % 2 ? MARI2 : MARI))).join('') +
      `<path class="o" d="M8 38 H72 L66 66 Q40 72 14 66Z" fill="${k.g('#e0a463', '#8a4d1c')}"/>
       <path class="ot" d="M10 48 H70 M12 58 H68" fill="none" stroke="#6b3512" stroke-width="1.6"/>
       ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path class="ot" d="M${16 + i * 8.5} 40 L${15 + i * 8.8} 66" fill="none" stroke="#6b3512" stroke-width="1.2"/>`).join('')}
       <rect class="o" x="6" y="34" width="68" height="8" rx="4" fill="${k.g('#f0b873', '#a55a2a')}"/>`),

    // Pétalos: montoncito con pétalos sueltos.
    petalos: make('-6 -8 92 58', (k) => {
      const pet = (x, y, r, c1, c2) => `<path class="ot" transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C5 -9 15 -7 16 0 C14 8 4 9 0 0Z" fill="${k.g(c1, c2, 'd')}"/>`;
      const list = [[10, 38, -20], [20, 34, 10], [30, 38, -8], [40, 32, 20], [50, 37, -15], [60, 33, 12], [22, 28, -30], [34, 26, 25], [46, 25, -12], [56, 26, 30], [28, 19, 14], [40, 17, -24], [36, 10, 5], [50, 15, 20]];
      return list.map(([x, y, r], i) => pet(x, y, r, i % 3 ? '#ffd23f' : '#ffb000', i % 2 ? '#ff7a00' : '#ff9a1a')).join('') +
        pet(6, 24, 60, '#ffd23f', '#ff8a00') + pet(70, 22, -50, '#ffb000', '#ff7a00') + sparkle(28, 8, 4, '#fff6b0', 0.2);
    }),

    // Camino de pétalos (para guiar a las ánimas).
    caminoPetalos: make('-4 -4 96 52', (k) => {
      const pet = (x, y, r, c1, c2) => `<path class="ot" transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C4 -8 13 -6 14 0 C12 7 3 8 0 0Z" fill="${k.g(c1, c2, 'd')}"/>`;
      let out = '';
      for (let i = 0; i < 12; i++) {
        const x = 6 + i * 6.4;
        const y = 24 + Math.sin(i * 0.8) * 9;
        out += pet(x, y, i * 37 % 120 - 40, i % 2 ? '#ffd23f' : '#ffb000', i % 3 ? '#ff7a00' : '#ff3d7f');
        out += pet(x + 3, y + 7, i * 53 % 100 - 30, '#ffa51a', '#ff6a00');
      }
      return out + sparkle(70, 8, 4, '#fff6b0', 0.5);
    }),

    macetaCempasuchil: make('0 0 66 86', (k) =>
      [[33, 34, 15], [14, 44, 11], [52, 44, 11]].map(([x, y, r], i) => `<path class="ln" d="M33 62 Q${x} 56 ${x} ${y + 6}" stroke="#23853a" stroke-width="3.4"/>`).join('') +
      leaf(k, 14, 62, -160, 1.1) + leaf(k, 36, 60, -20, 1.1) +
      [[33, 34, 15, MARI], [14, 46, 11, MARI2], [52, 46, 11, MARI]].map(([x, y, r, c]) => bloom(k, x, y, r, ...c)).join('') +
      pot(k, '#e2793a', '#8a3a14', 33, 84, 38, 24)),

    macetaMixta: make('0 0 66 86', (k) =>
      `<path class="ln" d="M33 62 Q18 54 16 38 M33 62 Q33 50 33 30 M33 62 Q48 54 50 38" stroke="#23853a" stroke-width="3.4"/>` +
      leaf(k, 14, 62, -160, 1.1) + leaf(k, 36, 60, -20, 1.1) +
      bloom(k, 16, 36, 11, '#ff7ad1', '#d41f86', '#7a0a4b') + bloom(k, 33, 28, 13, '#c58bff', '#6a2bc4', '#3a0d6a') + bloom(k, 50, 36, 11, '#ff9a6a', '#e8262b', '#7a0a1a') +
      pot(k, '#33e0d0', '#0b8f9a', 33, 84, 38, 24, '#ffe27a')),

    // Terciopelo (cresta de gallo): flores rojas aterciopeladas en florero.
    terciopelo: make('0 0 70 88', (k) => `
      ${[[22, 30], [44, 24], [34, 40]].map(([x, y]) => `<path class="ln" d="M35 64 Q${x} ${y + 20} ${x} ${y + 6}" stroke="#23853a" stroke-width="3.2"/>`).join('')}
      ${leaf(k, 30, 58, -160, 0.9)}${leaf(k, 38, 56, -20, 0.9)}
      ${velvet(k, 22, 30, 1.25)}${velvet(k, 46, 24, 1.35)}${velvet(k, 34, 40, 1.2)}
      ${vase(k, '#8e5bd0', '#4a2a8c', 35, 86, 40, 36)}`),

    // Flor de nube: nubecitas blancas en florero turquesa.
    nube: make('0 0 70 88', (k) => `
      ${[[20, 34], [48, 28], [34, 22], [27, 46], [44, 44]].map(([x, y]) => `<path class="ln" d="M35 64 Q${x} ${y + 18} ${x} ${y + 4}" stroke="#2f8f3a" stroke-width="2.6"/>`).join('')}
      ${[[20, 34, 9], [48, 28, 10], [34, 22, 11], [27, 46, 8], [44, 44, 9]].map(([x, y, r]) =>
        [[-1, 0], [1, -0.8], [0.4, 1], [-0.8, -1], [1.1, 0.7], [0, -0.1]].map(([dx, dy]) => `<circle class="ot" cx="${x + dx * r * 0.7}" cy="${y + dy * r * 0.7}" r="${r * 0.55}" fill="${k.r('#ffffff', '#c9d7ff')}"/>`).join('')).join('')}
      ${vase(k, '#33e0d0', '#0b8f9a', 35, 86, 40, 36)}`),

    // Ramo mixto en florero rosa (alhelíes, rosas y cempasúchil).
    ramoMixto: make('0 0 70 88', (k) => `
      ${[[20, 32], [48, 30], [34, 22], [28, 46], [44, 46]].map(([x, y]) => `<path class="ln" d="M35 64 Q${x} ${y + 18} ${x} ${y + 4}" stroke="#23853a" stroke-width="3"/>`).join('')}
      ${leaf(k, 28, 58, -160, 0.9)}${leaf(k, 40, 56, -20, 0.9)}
      ${bloom(k, 20, 32, 11, '#ff7ad1', '#d41f86', '#7a0a4b')}${bloom(k, 48, 30, 11, ...MARI)}${bloom(k, 34, 22, 12, '#c58bff', '#6a2bc4', '#3a0d6a')}${bloom(k, 28, 46, 10, ...MARI2)}${bloom(k, 44, 46, 10, '#ff9a6a', '#e8262b', '#7a0a1a')}
      ${vase(k, '#ff7ad1', '#c2185b', 35, 86, 40, 36)}`),
  });
})(window.AltarPlaceholders);
