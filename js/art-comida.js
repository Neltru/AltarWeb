/* =========================================================================
 * ILUSTRACIONES · Alimentos, bebidas, agua y limpieza
 * ========================================================================= */
(function (PH) {
  const { make, sparkle } = PH;
  const OUT = PH.OUT;

  const steam = (x, y, delay = 0, s = 1) =>
    `<path class="ph-smoke" style="animation-delay:${delay}s" fill="#fff" opacity=".75" d="M${x} ${y} c${-6 * s} ${-6 * s} ${6 * s} ${-9 * s} 0 ${-18 * s} c${8 * s} ${6 * s} ${-4 * s} ${9 * s} ${3 * s} ${18 * s}Z"/>`;

  // Plato de talavera (centro x, y; radio horizontal rx).
  const plate = (k, x, y, rx, c1 = '#4aa8ff', c2 = '#1b4fa3') => `
    <ellipse class="o" cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.2}" fill="${k.g('#ffffff', '#dcecff')}"/>
    <ellipse class="ot" cx="${x}" cy="${y}" rx="${rx * 0.86}" ry="${rx * 0.15}" fill="none" stroke="${c1}" stroke-width="2.4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${x - rx * 0.7 + i * rx * 0.2}" cy="${y + (i % 2 ? rx * 0.02 : -rx * 0.02)}" r="1.5" fill="${c2}"/>`).join('')}`;

  // Pan de muerto: cuerpo en domo + huesos + bolita.
  const bread = (k, c1, c2, strip1, strip2, extra = '') => `
    <ellipse class="sd" cx="40" cy="50" rx="34" ry="4"/>
    <path class="o" d="M4 48 C4 14 76 14 76 48 Q40 56 4 48Z" fill="${k.g(c1, c2)}"/>
    <path class="ot" d="M16 44 C22 24 30 22 34 18 L38 20 C34 26 30 36 28 47Z" fill="${k.g(strip1, strip2)}"/>
    <path class="ot" d="M64 44 C58 24 50 22 46 18 L42 20 C46 26 50 36 52 47Z" fill="${k.g(strip1, strip2)}"/>
    <path class="ot" d="M8 38 C26 28 54 28 72 38 C54 34 26 34 8 38Z" fill="${k.g(strip1, strip2)}"/>
    <path class="ot" d="M14 46 C30 40 50 40 66 46 C50 44 30 44 14 46Z" fill="${k.g(strip1, strip2)}" opacity=".9"/>
    <circle class="ot" cx="40" cy="17" r="6.4" fill="${k.g(strip1, strip2)}"/>
    <path class="sh" d="M16 32 C20 22 28 18 34 18" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
    ${extra}`;

  // Mandarinas, naranjas y manzanas: frutas redondas con hoja.
  const round = (k, cx, cy, r, c1, c2, o = {}) => `
    <ellipse class="o" cx="${cx}" cy="${cy}" rx="${r * (o.sx || 1)}" ry="${r * (o.sy || 0.94)}" fill="${k.r(c1, c2)}"/>
    <path class="sh" d="M${cx - r * 0.6} ${cy - r * 0.2} q${r * 0.15} ${-r * 0.55} ${r * 0.6} ${-r * 0.6}" fill="none" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round" opacity=".6"/>
    ${o.apple ? `<path class="ln" d="M${cx} ${cy - r * 0.8} q1 -${r * 0.4} ${r * 0.3} -${r * 0.6}" stroke="#6b3512"/>` : `<circle cx="${cx}" cy="${cy - r * 0.8}" r="${r * 0.12}" fill="#2f8f3a"/>`}
    <path class="ot" transform="translate(${cx} ${cy - r * 0.78}) rotate(-20)" d="M0 0 C${r * 0.3} ${-r * 0.5} ${r * 0.8} ${-r * 0.5} ${r} ${-r * 0.1} C${r * 0.6} ${r * 0.2} ${r * 0.2} ${r * 0.1} 0 0Z" fill="${k.g('#7bd36a', '#23853a')}"/>`;

  // Banana: tubo curvo con contorno y brillo.
  const banana = (x1, y1, cx, cy, x2, y2) => `
    <path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${OUT}" stroke-width="13" stroke-linecap="round"/>
    <path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="#ffd93b" stroke-width="9.4" stroke-linecap="round"/>
    <path d="M${x1 + 1} ${y1 - 2} Q${cx} ${cy - 3} ${x2 - 1} ${y2 - 2}" fill="none" stroke="#fff6a8" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
    <circle cx="${x2}" cy="${y2}" r="2.6" fill="#6b3512"/>`;

  // Taza de barro decorada con vapor.
  const mug = (k, c1, c2, liquid, extra) => `
    <path class="o" d="M42 22 H50 Q58 24 56 34 Q54 42 44 42" fill="none" stroke-width="6"/>
    <path d="M42 22 H50 Q58 24 56 34 Q54 42 44 42" fill="none" stroke="${c1}" stroke-width="2.6" stroke-linecap="round"/>
    <path class="o" d="M8 22 H44 L41 54 Q26 60 11 54Z" fill="${k.g(c1, c2, 'h')}"/>
    <ellipse class="o" cx="26" cy="22" rx="18" ry="5" fill="${k.g('#ffffff', '#e7d9ff')}"/>
    <ellipse cx="26" cy="22.4" rx="14.6" ry="3.4" fill="${liquid}"/>
    ${extra}
    <path class="ot" d="M12 36 H40" stroke="#fff" stroke-width="2.4" fill="none" stroke-dasharray="1 4.4" stroke-linecap="round"/>
    <path class="sh" d="M12 26 q-1 12 1.6 24" fill="none" stroke="#fff" stroke-width="2.6" opacity=".5"/>
    ${steam(20, 16, 0, 0.8)}${steam(31, 16, -1.2, 0.8)}`;

  // Botella genérica: vidrio, líquido, etiqueta y tapón.
  const bottle = (k, o) => `
    <path class="o" d="M${15 - o.nw} 3 H${15 + o.nw} V${o.neck} C${15 + o.nw} ${o.neck + 8} ${15 + o.bw} ${o.neck + 10} ${15 + o.bw} ${o.neck + 20} V66 Q15 71 ${15 - o.bw} 66 V${o.neck + 20} C${15 - o.bw} ${o.neck + 10} ${15 - o.nw} ${o.neck + 8} ${15 - o.nw} ${o.neck}Z" fill="${k.g(o.glass1, o.glass2, 'h')}"/>
    <path d="M${15 - o.bw + 1.6} ${o.neck + 24} H${15 + o.bw - 1.6} V64 Q15 68 ${15 - o.bw + 1.6} 64Z" fill="${k.g(o.liq1, o.liq2)}" opacity=".95"/>
    <rect class="o" x="${15 - o.bw}" y="${o.ly}" width="${o.bw * 2}" height="${o.lh}" fill="${k.g(o.lab1, o.lab2, 'h')}"/>
    <circle class="ot" cx="15" cy="${o.ly + o.lh / 2}" r="${Math.min(o.bw, o.lh) * 0.32}" fill="${o.dot}"/>
    <path class="sh" d="M${15 - o.bw + 3} ${o.neck + 22} q-1 14 0 ${40 - o.neck}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".55"/>
    <rect class="o" x="${15 - o.nw - 1.4}" y="0" width="${o.nw * 2 + 2.8}" height="6" rx="2" fill="${k.g(o.cap1, o.cap2)}"/>`;

  Object.assign(PH, {
    /* ------------------------------------------------------------------ pan */
    panClasico: make('0 0 80 56', (k) => bread(k, '#f5b95e', '#cf7a2a', '#ffe0a0', '#f0aa52')),

    panAzucar: make('0 0 80 56', (k) => bread(k, '#ff8fcb', '#d63a8c', '#ffd0ea', '#ff6ab8',
      Array.from({ length: 14 }, (_, i) => `<circle cx="${12 + ((i * 29) % 56)}" cy="${28 + ((i * 17) % 18)}" r="1.5" fill="${['#fff', '#ffe066', '#7fe9ff'][i % 3]}"/>`).join(''))),

    panYema: make('0 0 80 56', (k) => bread(k, '#ffd24a', '#e08a12', '#fff0a0', '#ffc233',
      Array.from({ length: 16 }, (_, i) => `<ellipse cx="${10 + ((i * 31) % 60)}" cy="${26 + ((i * 19) % 20)}" rx="1.6" ry=".9" fill="#fff9e0" transform="rotate(${i * 40} 40 40)"/>`).join(''))),

    // Pan de ánima: figura humana de pan con carita de azúcar.
    panAnima: make('0 0 60 70', (k) => `
      <ellipse class="sd" cx="30" cy="66" rx="22" ry="3.6"/>
      <path class="o" d="M12 62 C6 40 14 30 30 30 C46 30 54 40 48 62 Q30 70 12 62Z" fill="${k.g('#e8a24a', '#a8591a')}"/>
      <path class="o" d="M12 44 C24 54 36 54 48 44 L46 52 C36 60 24 60 14 52Z" fill="${k.g('#f6c777', '#d9873a')}"/>
      <circle class="o" cx="30" cy="20" r="13" fill="${k.r('#f6c777', '#c9722a')}"/>
      <circle cx="25.4" cy="19" r="2.2" fill="#fff"/><circle cx="34.6" cy="19" r="2.2" fill="#fff"/>
      <circle cx="25.4" cy="19" r="1" fill="${OUT}"/><circle cx="34.6" cy="19" r="1" fill="${OUT}"/>
      <path class="lt" d="M25 26 Q30 30 35 26"/>
      <circle cx="21" cy="25" r="2.4" fill="#ff7ad1" opacity=".8"/><circle cx="39" cy="25" r="2.4" fill="#ff7ad1" opacity=".8"/>
      ${[[18, 40], [30, 42], [42, 40], [24, 52], [36, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join('')}
      <path class="sh" d="M18 14 q4 -5 10 -5" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>`),

    /* -------------------------------------------------------------- platillos */
    tamales: make('0 0 86 56', (k) => {
      const tam = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">
        <path class="o" d="M-27 0 L-21 -9 Q0 -14 21 -9 L27 0 L21 9 Q0 14 -21 9Z" fill="${k.g('#fff3c0', '#e2b95a')}"/>
        <path class="lt" d="M-18 -6 Q0 -9 18 -6 M-20 0 H20 M-18 6 Q0 9 18 6" opacity=".55"/>
        <ellipse class="ot" cx="25" cy="0" rx="3" ry="4.4" fill="#fff8d6"/>
        <rect class="ot" x="-12" y="-11" width="4" height="22" rx="1.6" fill="#ff4f9a"/><rect class="ot" x="10" y="-10" width="4" height="20" rx="1.6" fill="#ffd23f"/></g>`;
      return `<ellipse class="sd" cx="43" cy="52" rx="38" ry="4"/>` + plate(k, 43, 46, 40, '#ff6ab8', '#c2185b') + tam(32, 37, -6) + tam(56, 36, 8) + tam(44, 25, -2);
    }),

    mole: make('0 0 80 58', (k) => `
      ${steam(26, 20, 0, 0.9)}${steam(40, 18, -1, 0.9)}${steam(54, 20, -2, 0.9)}
      <path class="o" d="M6 24 C6 52 22 56 40 56 C58 56 74 52 74 24Z" fill="${k.g('#e2793a', '#8a3a14')}"/>
      <path class="o" d="M2 26 Q-4 26 2 34 M78 26 Q84 26 78 34" fill="none" stroke-width="5"/>
      <ellipse class="o" cx="40" cy="24" rx="35" ry="9" fill="${k.g('#c2501a', '#7a2f0e')}"/>
      <ellipse cx="40" cy="24.6" rx="30" ry="6.4" fill="${k.r('#7a3a22', '#2a1008')}"/>
      ${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${18 + ((i * 23) % 44)}" cy="${21 + ((i * 7) % 7)}" rx="1.3" ry=".8" fill="#fff4c8"/>`).join('')}
      <path class="ot" d="M10 40 H70" stroke="#ffd23f" stroke-width="3" fill="none" stroke-dasharray="3 4" stroke-linecap="round"/>
      <path class="ot" d="M12 47 H68" stroke="#33e0d0" stroke-width="2.4" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>
      <path class="sh" d="M12 32 q1 12 6 18" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>`),

    // Platillo mexicano: enchiladas en plato de talavera.
    platillo: make('0 0 86 54', (k) => `
      <ellipse class="sd" cx="43" cy="50" rx="38" ry="4"/>
      ${plate(k, 43, 40, 40)}
      ${[[26, 36, -6], [43, 33, 0], [60, 36, 6]].map(([x, y, r]) => `
        <g transform="translate(${x} ${y}) rotate(${r})"><rect class="o" x="-16" y="-8" width="32" height="14" rx="7" fill="${k.g('#ffe39a', '#e5b25a')}"/>
        <path d="M-14 -6 H14 Q16 -3 12 0 H-12 Q-16 -3 -14 -6Z" fill="${k.g('#ff6a4a', '#b0172e')}"/>
        <circle cx="-8" cy="-3" r="1.4" fill="#fff"/><circle cx="0" cy="-2" r="1.4" fill="#fff"/><circle cx="8" cy="-3" r="1.4" fill="#fff"/></g>`).join('')}
      <path class="ot" d="M18 28 q3 -8 7 -2 M34 24 q4 -7 8 -1 M54 26 q4 -7 8 -1" fill="none" stroke="#2f8f3a" stroke-width="2.6"/>
      <circle class="ot" cx="43" cy="28" r="3.4" fill="#fff"/><circle class="ot" cx="30" cy="30" r="3" fill="#ff4f9a"/><circle class="ot" cx="57" cy="30" r="3" fill="#ff4f9a"/>`),

    // Comida favorita: pozole con un corazón.
    comidaFavorita: make('0 0 76 60', (k) => `
      ${steam(26, 18, 0, 0.9)}${steam(38, 16, -1.1, 0.9)}${steam(50, 18, -2, 0.9)}
      <path class="o" d="M6 24 C6 52 20 58 38 58 C56 58 70 52 70 24Z" fill="${k.g('#ff6ab8', '#c2185b', 'h')}"/>
      <ellipse class="o" cx="38" cy="24" rx="32" ry="8" fill="${k.g('#ffffff', '#e7d9ff')}"/>
      <ellipse cx="38" cy="24.6" rx="27" ry="5.6" fill="${k.r('#ff7a5a', '#c01a2a')}"/>
      ${[[24, 23], [32, 26], [42, 23], [50, 25], [36, 22], [28, 25]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff3d0" stroke="#e0b878" stroke-width=".6"/>`).join('')}
      <path class="ot" d="M20 24 q4 -5 8 0 M44 22 q4 -5 9 0" fill="none" stroke="#5bd16a" stroke-width="2.4"/>
      <circle class="ot" cx="47" cy="26" r="2.2" fill="#ff4f9a"/><circle class="ot" cx="30" cy="22" r="2" fill="#ff4f9a"/>
      <path class="o" d="M38 50 C26 42 28 34 33 34 C36 34 38 36 38 38 C38 36 40 34 43 34 C48 34 50 42 38 50Z" fill="${k.g('#ffe27a', '#ff8a00')}"/>
      <path class="sh" d="M16 32 q1 12 5 18" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>`),

    // Calabaza en dulce con canela.
    calabaza: make('0 0 80 58', (k) => `
      <path class="o" d="M6 28 C6 52 22 56 40 56 C58 56 74 52 74 28Z" fill="${k.g('#33e0d0', '#0b8f9a', 'h')}"/>
      <ellipse class="o" cx="40" cy="28" rx="35" ry="8.6" fill="${k.g('#ffffff', '#d7e9ff')}"/>
      ${[[22, 26, -20], [38, 22, 4], [54, 25, 22]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">
        <path class="o" d="M-12 4 C-12 -10 12 -10 12 4 Q0 12 -12 4Z" fill="${k.g('#ffb347', '#e8650a')}"/>
        <path class="ln" d="M-7 0 Q0 -6 7 0" stroke-width="1.4" opacity=".6"/><path class="sh" d="M-8 -2 q4 -5 9 -4" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/></g>`).join('')}
      <path d="M14 30 Q40 40 66 30 L66 32 Q40 44 14 32Z" fill="#ffb347" opacity=".6"/>
      <path class="o" d="M34 14 L54 6" stroke="#8a4a22" stroke-width="5"/><path d="M34 14 L54 6" stroke="#c8793a" stroke-width="2.4" stroke-linecap="round"/>
      <path class="o" d="M30 10 L50 3" stroke="#8a4a22" stroke-width="5"/><path d="M30 10 L50 3" stroke="#c8793a" stroke-width="2.4" stroke-linecap="round"/>
      <path class="ot" d="M10 42 H70" stroke="#ffd23f" stroke-width="3" fill="none" stroke-dasharray="3 4" stroke-linecap="round"/>`),

    // Dulces tradicionales: alegrías, cocadas, camote y cacahuates.
    dulces: make('0 0 90 54', (k) => `
      <ellipse class="sd" cx="45" cy="50" rx="40" ry="4"/>
      ${plate(k, 45, 42, 42, '#ff6ab8', '#c2185b')}
      <ellipse class="o" cx="22" cy="34" rx="11" ry="6" fill="${k.g('#f6d88a', '#c8933a')}"/>
      ${[[17, 33], [24, 32], [27, 36], [19, 37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#8a5a1a"/>`).join('')}
      <path class="o" d="M36 40 C36 22 56 22 56 40Z" fill="${k.g('#ffffff', '#f2e3c8')}"/>
      <circle class="o" cx="46" cy="25" r="3.2" fill="#e8262b"/>
      <path class="sh" d="M40 36 q2 -9 8 -10" fill="none" stroke="#fff" stroke-width="2.2"/>
      <path class="o" d="M60 40 L66 26 L82 30 L80 42Z" fill="${k.g('#b05bff', '#6a22b8')}"/>
      <path class="o" d="M64 30 L78 33" stroke="#ffb347" stroke-width="3"/>
      <circle class="o" cx="30" cy="22" r="4.2" fill="${k.r('#ff9a6a', '#d83a1a')}"/><circle class="o" cx="60" cy="21" r="4.2" fill="${k.r('#ffe066', '#e8a010')}"/>
      ${sparkle(76, 16, 4, '#fff6b0', 0.4)}`),

    /* ------------------------------------------------------------------ frutas */
    frutaCanasta: make('0 0 96 70', (k) => `
      <path class="ot" transform="translate(54 24) rotate(-10)" d="M0 0 C10 -8 20 -4 22 6 C14 10 6 8 0 0Z" fill="${k.g('#7bd36a', '#23853a')}"/>
      ${[[56, 24], [62, 30]].map(([x, y]) => `<circle class="o" cx="${x}" cy="${y}" r="5.8" fill="${k.r('#c58bff', '#5a1aa8')}"/>`).join('')}
      ${[[50, 30], [58, 36], [66, 24], [70, 36], [54, 22]].map(([x, y]) => `<circle class="o" cx="${x + 4}" cy="${y}" r="5.6" fill="${k.r('#c58bff', '#5a1aa8')}"/>`).join('')}
      ${banana(70, 12, 90, 20, 80, 44)}
      ${round(k, 22, 30, 14, '#ffb347', '#e8650a')}
      ${round(k, 40, 22, 14, '#ff6a6a', '#b0102f', { apple: true })}
      ${round(k, 32, 40, 13, '#ffe066', '#e8a010')}
      <path class="o" d="M8 38 H88 L80 66 Q48 72 16 66Z" fill="${k.g('#e0a463', '#8a4d1c')}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path class="ot" d="M${14 + i * 10} 40 L${14 + i * 10.4} 68" fill="none" stroke="#6b3512" stroke-width="1.2"/>`).join('')}
      <path class="ot" d="M12 50 H84 M14 59 H82" fill="none" stroke="#6b3512" stroke-width="1.6"/>
      <rect class="o" x="6" y="34" width="84" height="8" rx="4" fill="${k.g('#f0b873', '#a55a2a')}"/>`),

    mandarinas: make('0 0 76 50', (k) => `
      <ellipse class="sd" cx="38" cy="46" rx="32" ry="3.6"/>
      ${round(k, 20, 32, 14, '#ffb347', '#f06a0a', { sy: 0.82, sx: 1.05 })}
      ${round(k, 54, 32, 14, '#ffb347', '#f06a0a', { sy: 0.82, sx: 1.05 })}
      ${round(k, 37, 22, 15, '#ffc25a', '#f06a0a', { sy: 0.84, sx: 1.05 })}
      ${sparkle(66, 10, 4, '#fff6b0', 0.3)}`),

    naranjas: make('0 0 76 56', (k) => `
      <ellipse class="sd" cx="38" cy="52" rx="32" ry="3.6"/>
      ${round(k, 20, 38, 16, '#ffa83a', '#e45a00')}
      ${round(k, 56, 38, 16, '#ffa83a', '#e45a00')}
      ${round(k, 38, 24, 17, '#ffb84a', '#e8650a')}
      ${[[16, 40], [52, 42], [34, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#c0480a" opacity=".6"/><circle cx="${x + 5}" cy="${y + 4}" r=".8" fill="#c0480a" opacity=".6"/>`).join('')}`),

    platanos: make('0 0 76 56', (k) => `
      <ellipse class="sd" cx="38" cy="52" rx="30" ry="3"/>
      ${banana(16, 18, 6, 44, 38, 50)}
      ${banana(24, 14, 22, 46, 48, 48)}
      ${banana(34, 12, 42, 40, 62, 40)}
      ${banana(44, 12, 62, 28, 68, 26)}
      <path class="o" d="M16 8 H46 L44 18 H18Z" fill="${k.g('#8a9a3a', '#4a5a1a')}"/>`),

    manzanas: make('0 0 76 56', (k) => `
      <ellipse class="sd" cx="38" cy="52" rx="32" ry="3.6"/>
      ${round(k, 20, 38, 16, '#ff6a6a', '#b0102f', { apple: true })}
      ${round(k, 56, 38, 16, '#ff8a4a', '#c01a1a', { apple: true })}
      ${round(k, 38, 24, 17, '#9be24a', '#3a9a1f', { apple: true })}`),

    /* ----------------------------------------------------------------- bebidas */
    cafe: make('0 0 62 66', (k) => mug(k, '#33e0d0', '#0b8f9a', k.r('#6b3a1a', '#2a1006'),
      `<path d="M26 20.4 C22 18 22 22 26 24.6 C30 22 30 18 26 20.4Z" fill="#fff0d8" opacity=".9"/>`)),

    chocolate: make('0 0 62 66', (k) => mug(k, '#ff7ad1', '#c2185b', k.r('#a8602e', '#3a1a0a'),
      `<ellipse cx="26" cy="21.8" rx="9" ry="2" fill="#fff0e0" opacity=".9"/><path class="o" d="M30 14 L44 10" stroke="#8a4a22" stroke-width="4"/><path d="M30 14 L44 10" stroke="#c8793a" stroke-width="2" stroke-linecap="round"/>`)),

    atole: make('0 0 62 66', (k) => mug(k, '#ffd23f', '#e8892b', k.r('#fff8e6', '#e9d2a2'),
      `<path class="o" d="M30 15 L45 9" stroke="#8a4a22" stroke-width="4"/><path d="M30 15 L45 9" stroke="#c8793a" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="22" r="1" fill="#c8793a"/><circle cx="28" cy="23" r="1" fill="#c8793a"/>`)),

    refrescoCola: make('0 0 30 72', (k) => bottle(k, { nw: 3.6, bw: 8, neck: 18, glass1: '#7a3a22', glass2: '#4a1f10', liq1: '#6a2a14', liq2: '#2a0f08', ly: 34, lh: 18, lab1: '#ff5a5a', lab2: '#c01a2a', dot: '#fff', cap1: '#ffd23f', cap2: '#d98f1a' })),
    refrescoNaranja: make('0 0 30 72', (k) => bottle(k, { nw: 3.6, bw: 8, neck: 18, glass1: '#ffc861', glass2: '#ff8a1c', liq1: '#ffa83a', liq2: '#e45a00', ly: 34, lh: 18, lab1: '#33e0d0', lab2: '#0b8f9a', dot: '#fff', cap1: '#ff7ad1', cap2: '#c2185b' })),

    // Agua fresca de jamaica en vitrolero con limones y cucharón.
    aguaFresca: make('0 0 64 78', (k) => `
      <path class="o" d="M8 22 H56 L52 68 Q32 74 12 68Z" fill="${k.g('#d6f1ff', '#8fd0f0', 'h')}" opacity=".95"/>
      <path d="M9.6 30 H54.4 L51.4 66 Q32 71 12.6 66Z" fill="${k.g('#ff4f7a', '#a01040')}"/>
      <ellipse cx="32" cy="30" rx="22.4" ry="3.6" fill="#ff8aa8"/>
      <circle class="ot" cx="20" cy="40" r="6" fill="${k.r('#e9ff9a', '#7fc02a')}"/><circle cx="20" cy="40" r="3" fill="none" stroke="#fff" stroke-width="1"/>
      <circle class="ot" cx="40" cy="52" r="6" fill="${k.r('#e9ff9a', '#7fc02a')}"/><circle cx="40" cy="52" r="3" fill="none" stroke="#fff" stroke-width="1"/>
      <rect class="o" x="6" y="12" width="52" height="12" rx="3" fill="${k.g('#ffd23f', '#e8892b')}"/>
      <rect class="o" x="22" y="4" width="20" height="10" rx="5" fill="${k.g('#ff7ad1', '#c2185b')}"/>
      <path class="ln" d="M52 6 L44 36" stroke-width="3.4"/><circle class="o" cx="42" cy="38" r="4.6" fill="#e9eef7"/>
      <path class="sh" d="M13 30 q0 20 3 34" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`),

    // Pulque en jarro de barro con espuma.
    pulque: make('0 0 60 62', (k) => `
      <path class="o" d="M10 18 Q-2 18 4 30 Q8 36 14 34 M50 18 Q62 18 56 30 Q52 36 46 34" fill="none" stroke-width="5"/>
      <path class="o" d="M12 16 H48 C58 30 54 54 40 58 H20 C6 54 2 30 12 16Z" fill="${k.g('#e2793a', '#8a3a14', 'h')}"/>
      <ellipse class="o" cx="30" cy="16" rx="18" ry="5" fill="${k.g('#ffffff', '#f1e6d4')}"/>
      ${[[22, 13], [30, 11], [38, 13], [26, 15], [34, 15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" stroke="#e8d8c0" stroke-width=".8"/>`).join('')}
      <path class="ot" d="M10 34 H50" stroke="#ffd23f" stroke-width="3" fill="none" stroke-dasharray="3 4" stroke-linecap="round"/>
      <path class="ot" d="M14 44 Q30 50 46 44" fill="none" stroke="#33e0d0" stroke-width="3"/>
      <path class="sh" d="M14 24 q-2 14 4 24" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>`),

    // Botellas decorativas (solo adorno de ofrenda).
    tequila: make('0 0 30 72', (k) => bottle(k, { nw: 3.2, bw: 8.4, neck: 20, glass1: '#fff1c2', glass2: '#e8b94a', liq1: '#ffe9a0', liq2: '#e0a020', ly: 36, lh: 18, lab1: '#4fd16a', lab2: '#1f8a43', dot: '#ffd23f', cap1: '#3a2a4a', cap2: '#1a0f26' })),
    mezcal: make('0 0 30 72', (k) => bottle(k, { nw: 3.6, bw: 8.6, neck: 18, glass1: '#e9a96a', glass2: '#9a5a2a', liq1: '#f4d9a0', liq2: '#c8892a', ly: 32, lh: 22, lab1: '#ffd23f', lab2: '#e8892b', dot: '#e8262b', cap1: '#c2501a', cap2: '#6a2a0e' })),
    cerveza: make('0 0 30 74', (k) => bottle(k, { nw: 2.8, bw: 7.4, neck: 26, glass1: '#e8a23a', glass2: '#9a5a0a', liq1: '#ffc23a', liq2: '#d98a0a', ly: 40, lh: 16, lab1: '#ff7ad1', lab2: '#c2185b', dot: '#fff', cap1: '#33e0d0', cap2: '#0b8f9a' })),

    /* --------------------------------------------------------- agua y limpieza */
    vasoAgua: make('0 0 44 64', (k) => `
      <path class="o" d="M6 8 H38 L34 58 Q22 62 10 58Z" fill="${k.g('#e6f6ff', '#b8e2fa', 'h')}" opacity=".95"/>
      <path d="M8 20 H36 L33.4 56 Q22 59.6 10.6 56Z" fill="${k.g('#7fd4ff', '#2a8ae0')}"/>
      <path d="M8 20 Q15 16 22 20 T36 20" fill="#c5ecff" stroke="${OUT}" stroke-width="1.2"/>
      ${[[16, 36, 2.4], [26, 44, 1.8], [22, 28, 1.6], [28, 32, 1.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".8"/>`).join('')}
      <path class="sh" d="M11 12 q-1 20 2 38" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
      <ellipse class="ot" cx="22" cy="8" rx="16" ry="3" fill="#f2fbff"/>
      ${sparkle(36, 14, 4, '#fff', 0.5)}`),

    jarraAgua: make('0 0 70 74', (k) => `
      <path class="o" d="M48 24 Q68 22 64 42 Q62 56 46 56" fill="none" stroke-width="6"/>
      <path d="M48 24 Q68 22 64 42 Q62 56 46 56" fill="none" stroke="#2a8ae0" stroke-width="2.6"/>
      <path class="o" d="M10 10 L4 4 H16 L16 10 H46 L48 20 C52 34 50 62 44 68 Q28 72 12 68 C6 62 4 34 10 10Z" fill="${k.g('#e6f6ff', '#b8e2fa', 'h')}" opacity=".95"/>
      <path d="M8.4 32 H48 C49 46 47 62 43 66 Q28 70 14 66 C10 62 8 46 8.4 32Z" fill="${k.g('#7fd4ff', '#2a8ae0')}"/>
      <path d="M8.4 32 Q18 27 28 32 T48 32" fill="#c5ecff" stroke="${OUT}" stroke-width="1.2"/>
      <path class="ot" d="M10 50 H46" stroke="#fff" stroke-width="2.6" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>
      <path class="sh" d="M13 16 q-3 20 0 40" fill="none" stroke="#fff" stroke-width="3.4" opacity=".8"/>
      <ellipse class="ot" cx="31" cy="10" rx="15" ry="3" fill="#f2fbff"/>`),

    espejo: make('0 0 60 82', (k) => `
      <path class="o" d="M22 78 L30 66 L38 78Z" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <rect class="o" x="18" y="74" width="24" height="6" rx="3" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <ellipse class="o" cx="30" cy="36" rx="26" ry="32" fill="${k.g('#ffe27a', '#c2761a')}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = (i * Math.PI * 2) / 10; return `<circle class="ot" cx="${(30 + Math.cos(a) * 25).toFixed(1)}" cy="${(36 + Math.sin(a) * 31).toFixed(1)}" r="3.4" fill="${i % 2 ? '#ff4f9a' : '#33e0d0'}"/>`; }).join('')}
      <ellipse class="ot" cx="30" cy="36" rx="20" ry="26" fill="${k.g('#c9f0ff', '#7fb6f0', 'd')}"/>
      <path d="M14 22 Q26 10 36 14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      <path d="M18 50 L40 22" stroke="#fff" stroke-width="3" opacity=".5"/><path d="M26 54 L44 32" stroke="#fff" stroke-width="2" opacity=".4"/>
      ${sparkle(40, 20, 5, '#fff', 0.3)}`),

    jabon: make('0 0 64 46', (k) => `
      <ellipse class="sd" cx="32" cy="42" rx="26" ry="3.6"/>
      <path class="o" d="M6 16 L14 8 H58 L58 34 L50 42 H6Z" fill="${k.g('#ff9ad8', '#d63a8c')}"/>
      <path class="o" d="M6 16 L14 8 H58 L50 16Z" fill="${k.g('#ffd0ea', '#ff9ad8')}"/>
      <path class="o" d="M50 16 L58 8 V34 L50 42Z" fill="${k.g('#e0509f', '#a01a66')}"/>
      <path class="o" d="M26 30 C16 24 20 18 25 18 C28 18 29 20 29 22 C29 20 31 18 34 18 C39 18 42 24 26 30Z" transform="translate(5 1)" fill="${k.g('#fff0f8', '#ffb3de')}"/>
      <circle class="o" cx="52" cy="10" r="6" fill="#e9fbff" opacity=".9"/><circle class="o" cx="42" cy="4" r="3.6" fill="#e9fbff" opacity=".9"/>
      <circle class="o" cx="60" cy="22" r="2.6" fill="#e9fbff" opacity=".9"/>
      ${sparkle(14, 16, 4, '#fff', 0.2)}`),

    toalla: make('0 0 74 48', (k) => `
      <ellipse class="sd" cx="37" cy="44" rx="32" ry="3.6"/>
      <path class="o" d="M6 28 H68 V42 H6Z" fill="${k.g('#33e0d0', '#0b8f9a')}"/>
      <path class="o" d="M10 16 H64 V30 H10Z" fill="${k.g('#ffd23f', '#e8892b')}"/>
      <path class="o" d="M14 6 H60 V18 H14Z" fill="${k.g('#ff7ad1', '#c2185b')}"/>
      <path class="ot" d="M6 33 H68 M10 22 H64 M14 11 H60" stroke="#fff" stroke-width="2.2" fill="none" stroke-dasharray="2 4" stroke-linecap="round"/>
      ${Array.from({ length: 12 }, (_, i) => `<path class="ot" d="M${7 + i * 5.1} 42 V46" stroke="#0b8f9a" stroke-width="1.6"/>`).join('')}
      <path class="sh" d="M18 8 H40" stroke="#fff" stroke-width="2.4" opacity=".5"/>`),
  });
})(window.AltarPlaceholders);
