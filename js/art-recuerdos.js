/* =========================================================================
 * ILUSTRACIONES · Calaveras, recuerdos y objetos personales
 * ========================================================================= */
(function (PH) {
  const { make, petals, bloom, sparkle } = PH;
  const OUT = PH.OUT;

  // Calavera de azúcar (60 × 72). `o` controla colores y adornos.
  const skull = (k, o) => {
    const eye = (cx) => `
      ${petals(cx, 29, 8, 2.8, 4.2, 9.4, k.g(o.p1, o.p2), 0)}
      <circle class="o" cx="${cx}" cy="29" r="8" fill="${o.ring}"/>
      <circle cx="${cx}" cy="29" r="5.6" fill="#241333"/>
      <circle cx="${cx - 1.8}" cy="27" r="1.7" fill="#fff" opacity=".85"/>`;
    return `
      <ellipse class="sd" cx="30" cy="68" rx="18" ry="3"/>
      <path class="o" d="M6 30 C6 6 54 6 54 30 C54 38 48 42 46 46 V58 Q30 66 14 58 V46 C12 42 6 38 6 30Z" fill="${k.r(o.bg1, o.bg2)}"/>
      <path class="sh" d="M12 22 C14 12 24 8 32 8" fill="none" stroke="#fff" stroke-width="3.4" opacity=".6"/>
      ${eye(20)}${eye(40)}
      <path class="o" d="M30 36 L35 44 Q30 46 25 44Z" fill="#241333"/>
      <path class="ot" d="M30 38 C26 34 24 40 30 43 C36 40 34 34 30 38Z" fill="${o.heart}"/>
      <path class="lt" d="M17 50 Q30 56 43 50"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path class="lt" d="M${21 + i * 4.5} 51 V58"/>`).join('')}
      ${o.crown ? [0, 1, 2, 3, 4].map((i) => bloom(k, 12 + i * 9, 9 - Math.sin((i / 4) * Math.PI) * 3, 6.4, o.c1[i % 2], o.c2[i % 2], '#7a2a00')).join('') : bloom(k, 30, 11, 7, o.c1[0], o.c2[0], '#7a2a00')}
      <circle cx="10" cy="40" r="2.4" fill="${o.p1}"/><circle cx="50" cy="40" r="2.4" fill="${o.p1}"/>
      <path class="ot" d="M10 44 q4 6 8 2 M50 44 q-4 6 -8 2" fill="none" stroke="${o.p2}" stroke-width="2"/>
      ${sparkle(52, 14, 4, '#fff6b0', 0.4)}`;
  };

  const Y = ['#ffd23f', '#ffb000'];
  const O = ['#ff8a00', '#ff6a00'];

  Object.assign(PH, {
    /* ---------------------------------------------------------------- calaveras */
    // Calavera decorada grande, con corona de flores.
    calavera: make('0 0 60 72', (k) => skull(k, { bg1: '#ffffff', bg2: '#e4d7ff', ring: '#ff4f9a', p1: '#ffd23f', p2: '#ff7a00', heart: '#e8262b', crown: true, c1: Y, c2: O })),
    calaveritaRosa: make('0 0 60 72', (k) => skull(k, { bg1: '#ffd9ee', bg2: '#ff8fcb', ring: '#7a2bd6', p1: '#33e0d0', p2: '#0b8f9a', heart: '#7a2bd6', crown: false, c1: Y, c2: O })),
    calaveritaTurquesa: make('0 0 60 72', (k) => skull(k, { bg1: '#d6fbf6', bg2: '#5ee6e0', ring: '#ff7a00', p1: '#ff7ad1', p2: '#c2185b', heart: '#c2185b', crown: false, c1: ['#ff7ad1', '#ffb000'], c2: ['#c2185b', '#ff6a00'] })),
    calaveritaAmarilla: make('0 0 60 72', (k) => skull(k, { bg1: '#fff6c4', bg2: '#ffd23f', ring: '#2fb7a5', p1: '#ff4f9a', p2: '#8e3ccf', heart: '#8e3ccf', crown: false, c1: ['#ff7ad1', '#c58bff'], c2: ['#c2185b', '#6a2bc4'] })),

    // Perrito xoloitzcuintle con collar de cempasúchil: guía a las almas.
    xolo: make('0 0 66 74', (k) => `
      <ellipse class="sd" cx="33" cy="70" rx="22" ry="3"/>
      <path class="o" d="M52 62 C64 62 66 46 58 40" fill="none" stroke-width="6"/><path d="M52 62 C64 62 66 46 58 40" fill="none" stroke="#7d8196" stroke-width="2.8" stroke-linecap="round"/>
      <path class="o" d="M16 68 C10 50 14 36 22 34 H44 C54 38 56 54 50 68Z" fill="${k.g('#9a9eb2', '#5f6378')}"/>
      <path class="o" d="M16 68 V54 M26 68 V52 M40 68 V52 M50 68 V54" fill="none" stroke-width="7"/>
      <path d="M16 68 V54 M26 68 V52 M40 68 V52 M50 68 V54" fill="none" stroke="#868a9f" stroke-width="3.4" stroke-linecap="round"/>
      <path class="o" d="M13 20 L7 2 L24 12Z M53 20 L59 2 L42 12Z" fill="${k.g('#9a9eb2', '#5f6378')}"/>
      <path d="M13 17 L10 7 L19 12Z M53 17 L56 7 L47 12Z" fill="#f2a0b8"/>
      <ellipse class="o" cx="33" cy="26" rx="19" ry="17" fill="${k.g('#a5a9bd', '#6c7088')}"/>
      <ellipse class="o" cx="33" cy="34" rx="9" ry="7" fill="${k.g('#c4c7d6', '#8a8ea4')}"/>
      <ellipse cx="33" cy="30" rx="4" ry="3" fill="#2a1a33"/>
      <circle cx="24" cy="22" r="3.2" fill="#fff" stroke="${OUT}" stroke-width="1.4"/><circle cx="42" cy="22" r="3.2" fill="#fff" stroke="${OUT}" stroke-width="1.4"/>
      <circle cx="24.6" cy="22.4" r="1.7" fill="${OUT}"/><circle cx="42.6" cy="22.4" r="1.7" fill="${OUT}"/>
      <path class="lt" d="M29 36 Q33 39 37 36"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => bloom(k, 16 + i * 6.8, 42 + Math.sin((i / 5) * Math.PI) * 5, 5.4, i % 2 ? '#ffd23f' : '#ffb000', '#ff7a00', '#a23c00')).join('')}
      ${sparkle(58, 14, 4, '#fff6b0', 0.2)}`),

    /* ------------------------------------------------------------- música */
    guitarra: make('0 0 56 86', (k) => `
      <rect class="o" x="24.4" y="4" width="7.2" height="42" fill="${k.g('#6b3512', '#3a1a08', 'h')}"/>
      <path class="o" d="M21 2 H35 L33 14 H23Z" fill="${k.g('#4a2410', '#2a1006')}"/>
      ${[[20, 5], [20, 10], [36, 5], [36, 10]].map(([x, y]) => `<circle class="ot" cx="${x}" cy="${y}" r="2" fill="#ffd23f"/>`).join('')}
      <path class="o" d="M28 38 C12 38 6 52 14 62 C6 68 6 84 28 84 C50 84 50 68 42 62 C50 52 44 38 28 38Z" fill="${k.g('#ffb347', '#d9610a', 'd')}"/>
      <path class="ot" d="M28 42 C16 42 12 52 18 60 C12 66 12 80 28 80 C44 80 44 66 38 60 C44 52 40 42 28 42Z" fill="none" stroke="#ffe9a8" stroke-width="2"/>
      <circle class="o" cx="28" cy="62" r="8" fill="#241333"/>
      <circle class="ot" cx="28" cy="62" r="10.4" fill="none" stroke="#ff4f9a" stroke-width="2.4"/>
      <circle class="ot" cx="28" cy="62" r="12.6" fill="none" stroke="#33e0d0" stroke-width="1.6" stroke-dasharray="2 2.4"/>
      <rect class="o" x="19" y="73" width="18" height="4.4" rx="2" fill="${k.g('#6b3512', '#3a1a08')}"/>
      <path class="ln" d="M26 12 V74 M28 12 V74 M30 12 V74" stroke-width=".9" stroke="#fff" opacity=".85"/>
      <path class="sh" d="M16 46 q-3 8 0 14" fill="none" stroke="#fff" stroke-width="2.6" opacity=".7"/>`),

    violin: make('0 0 52 86', (k) => `
      <rect class="o" x="23" y="6" width="6" height="34" fill="${k.g('#3a1a08', '#1a0a04', 'h')}"/>
      <path class="o" d="M19 4 Q26 -2 33 4 Q35 10 31 12 H21 Q17 10 19 4Z" fill="${k.g('#c2501a', '#6a2a0e')}"/>
      <circle class="ot" cx="21" cy="9" r="2" fill="#ffd23f"/><circle class="ot" cx="31" cy="9" r="2" fill="#ffd23f"/>
      <path class="o" d="M26 36 C10 34 4 48 14 58 C8 62 4 70 10 78 C16 86 36 86 42 78 C48 70 44 62 38 58 C48 48 42 34 26 36Z" fill="${k.g('#e2793a', '#8a3a14', 'd')}"/>
      <path class="ot" d="M26 40 C14 38 10 48 17 56 C12 60 10 68 14 74 C19 80 33 80 38 74 C42 68 40 60 35 56 C42 48 38 38 26 40Z" fill="none" stroke="#ffd9a0" stroke-width="1.6"/>
      <path class="o" d="M17 54 q2 -3 3 0 q0 7 -2 9 q-3 -4 -1 -9Z M35 54 q-2 -3 -3 0 q0 7 2 9 q3 -4 1 -9Z" fill="#241333"/>
      <rect class="o" x="17" y="70" width="18" height="4" rx="2" fill="${k.g('#3a1a08', '#1a0a04')}"/>
      <path class="ln" d="M24.4 8 V70 M26 8 V70 M27.6 8 V70" stroke="#fff" stroke-width=".9" opacity=".85"/>
      <path class="sh" d="M13 50 q-2 6 0 10" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/>
      <path class="ln" d="M44 20 L50 80" stroke="#8a4a22" stroke-width="2.4"/><path class="ln" d="M44 20 L50 80" stroke="#f0d49a" stroke-width="1" opacity=".9"/>`),

    trompeta: make('0 0 90 54', (k) => `
      <path d="M14 34 H52 C72 34 72 14 54 14 H30 C18 14 18 26 30 26 H58" fill="none" stroke="${OUT}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 34 H52 C72 34 72 14 54 14 H30 C18 14 18 26 30 26 H58" fill="none" stroke="${k.g('#ffe27a', '#d9a020', 'v')}" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="o" d="M58 26 L84 8 Q90 26 84 44 L58 34Z" fill="${k.g('#ffe27a', '#c2761a', 'h')}"/>
      <ellipse class="o" cx="86" cy="26" rx="4" ry="18" fill="${k.g('#fff3a0', '#d9a020')}"/>
      <rect class="o" x="4" y="31" width="12" height="6" rx="3" fill="${k.g('#ffe27a', '#b9791a')}"/>
      ${[30, 38, 46].map((x) => `<rect class="o" x="${x}" y="6" width="5" height="12" rx="2" fill="${k.g('#33e0d0', '#0b8f9a')}"/><rect class="o" x="${x - 1}" y="3" width="7" height="4" rx="2" fill="#e9eef7"/>`).join('')}
      <path class="sh" d="M16 32 H50" stroke="#fff" stroke-width="1.8" opacity=".6"/>
      ${sparkle(76, 8, 4, '#fff6b0', 0.3)}`),

    maracas: make('0 0 70 74', (k) => `
      ${[[22, 24, -18, '#ff4f9a', '#c2185b', '#ffd23f'], [48, 24, 18, '#33e0d0', '#0b8f9a', '#ff7a00']].map(([x, y, r, c1, c2, c3]) => `
        <g transform="translate(${x} ${y}) rotate(${r})">
          <rect class="o" x="-3.4" y="14" width="6.8" height="40" rx="3" fill="${k.g('#c98a4b', '#7a4318')}"/>
          <circle class="o" cx="0" cy="54" r="5" fill="${c3}"/>
          <ellipse class="o" cx="0" cy="0" rx="17" ry="20" fill="${k.r(c1, c2)}"/>
          <path class="ot" d="M-14 -4 Q0 6 14 -4 M-15 6 Q0 16 15 6" fill="none" stroke="${c3}" stroke-width="3" stroke-dasharray="3 3.4"/>
          ${[[-6, -12], [4, -13], [0, 12]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.2" fill="#fff"/>`).join('')}
          <path class="sh" d="M-11 -10 q2 -6 8 -8" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/></g>`).join('')}`),

    /* ------------------------------------------------------ prendas y accesorios */
    sombrero: make('0 0 90 54', (k) => `
      <ellipse class="sd" cx="45" cy="50" rx="40" ry="3.6"/>
      <path class="o" d="M3 36 C3 28 20 32 30 33 H60 C70 32 87 28 87 36 C87 46 66 50 45 50 C24 50 3 46 3 36Z" fill="${k.g('#f0b873', '#a55a2a')}"/>
      <path class="o" d="M26 34 C26 6 64 6 64 34Z" fill="${k.g('#f6c98a', '#b9691f')}"/>
      <path class="o" d="M26 30 H64 V37 Q45 41 26 37Z" fill="${k.g('#ff4f9a', '#a01066')}"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle class="ot" cx="${30 + i * 5}" cy="${34.4 + Math.sin(i * 0.6) * 0.8}" r="1.9" fill="#ffd23f"/>`).join('')}
      <path class="ot" d="M8 38 Q45 52 82 38" fill="none" stroke="#ffd23f" stroke-width="3"/>
      <path class="ot" d="M12 41 Q45 55 78 41" fill="none" stroke="#33e0d0" stroke-width="2" stroke-dasharray="2 3"/>
      <path class="sh" d="M32 14 Q40 8 50 10" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>`),

    reloj: make('0 0 56 78', (k) => `
      <path class="ln" d="M28 12 Q44 -2 48 14 Q50 30 40 34" stroke-width="2.4" stroke="#b9791a"/>
      <rect class="o" x="23" y="6" width="10" height="9" rx="3" fill="${k.g('#ffe27a', '#b9791a')}"/>
      <circle class="o" cx="28" cy="44" r="26" fill="${k.g('#ffe27a', '#b9791a', 'd')}"/>
      <circle class="ot" cx="28" cy="44" r="21" fill="${k.g('#fffaf0', '#f0e2c0', 'd')}"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; const r1 = 17; const r2 = i % 3 === 0 ? 13 : 15; return `<path class="lt" d="M${(28 + Math.sin(a) * r1).toFixed(1)} ${(44 - Math.cos(a) * r1).toFixed(1)} L${(28 + Math.sin(a) * r2).toFixed(1)} ${(44 - Math.cos(a) * r2).toFixed(1)}" stroke-width="${i % 3 === 0 ? 2 : 1}"/>`; }).join('')}
      <path class="ln" d="M28 44 L28 32" stroke-width="2.6"/>
      <g style="transform-box:view-box;transform-origin:28px 44px;animation:ph-spin 40s linear infinite"><path class="ln" d="M28 44 L38 40" stroke-width="1.8" stroke="#e8262b"/></g>
      <circle class="o" cx="28" cy="44" r="2.4" fill="#ff4f9a"/>
      <path class="sh" d="M12 34 q4 -10 14 -12" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
      <path class="o" d="M14 70 H42 L38 76 H18Z" fill="${k.g('#c98a4b', '#7a4318')}"/>`),

    libros: make('0 0 76 62', (k) => `
      <ellipse class="sd" cx="38" cy="58" rx="32" ry="3.4"/>
      <rect class="o" x="6" y="40" width="64" height="16" rx="2" fill="${k.g('#ff6ab8', '#c2185b', 'h')}"/>
      <rect x="10" y="44" width="52" height="8" fill="#fff6dc" stroke="${OUT}" stroke-width="1.2"/>
      <rect class="ot" x="6" y="44" width="4" height="8" fill="#ffd23f"/>
      <rect class="o" x="12" y="24" width="58" height="16" rx="2" fill="${k.g('#33e0d0', '#0b8f9a', 'h')}"/>
      <rect x="16" y="28" width="48" height="8" fill="#fff6dc" stroke="${OUT}" stroke-width="1.2"/>
      <rect class="ot" x="12" y="28" width="4" height="8" fill="#ffd23f"/>
      <g transform="rotate(-6 36 14)"><rect class="o" x="8" y="8" width="56" height="16" rx="2" fill="${k.g('#ffd23f', '#e8892b', 'h')}"/>
      <rect x="12" y="12" width="46" height="8" fill="#fff6dc" stroke="${OUT}" stroke-width="1.2"/>
      <rect class="ot" x="8" y="12" width="4" height="8" fill="#ff4f9a"/>
      <path class="o" d="M52 24 V34 L55 31 L58 34 V24" fill="#e8262b"/></g>
      <rect class="o" x="14" y="44" width="1" height="1" opacity="0"/>`),

    // Camisa guayabera.
    camisa: make('0 0 70 70', (k) => `
      <ellipse class="sd" cx="35" cy="67" rx="26" ry="3"/>
      <path class="o" d="M20 8 L4 20 L12 36 L20 30 V66 H50 V30 L58 36 L66 20 L50 8 L42 12 H28Z" fill="${k.g('#ffffff', '#d7e9ff', 'h')}"/>
      <path class="o" d="M28 12 L35 26 L42 12 L38 8 H32Z" fill="${k.g('#33e0d0', '#0b8f9a')}"/>
      <path class="ot" d="M24 32 V64 M28 32 V64 M42 32 V64 M46 32 V64" stroke="#b6d3f2" stroke-width="1.4" fill="none"/>
      ${[34, 42, 50, 58].map((y) => `<circle class="ot" cx="35" cy="${y}" r="1.7" fill="#ffd23f"/>`).join('')}
      <rect class="o" x="38" y="34" width="9" height="9" rx="1.4" fill="${k.g('#ffe9a8', '#ffd23f')}"/>
      <path class="ot" d="M6 24 L13 34 M64 24 L57 34" stroke="#ff4f9a" stroke-width="2.4" fill="none"/>
      <path class="sh" d="M22 14 L10 22" stroke="#fff" stroke-width="3" opacity=".8"/>`),

    // Vestido con flores bordadas.
    vestido: make('0 0 66 80', (k) => `
      <ellipse class="sd" cx="33" cy="77" rx="26" ry="3"/>
      <path class="o" d="M22 4 L26 18 H40 L44 4 L38 4 Q33 12 28 4Z" fill="${k.g('#ff6ab8', '#c2185b')}"/>
      <path class="o" d="M26 18 H40 L42 34 L24 34Z" fill="${k.g('#ff9ad8', '#d63a8c', 'h')}"/>
      <path class="o" d="M24 34 H42 L62 76 Q33 82 4 76Z" fill="${k.g('#ffd23f', '#ff8a1c', 'h')}"/>
      <path class="o" d="M24 32 H42 V37 H24Z" fill="#7a2bd6"/>
      ${[[22, 62, '#ff4f9a'], [34, 68, '#33e0d0'], [46, 62, '#7a2bd6'], [28, 52, '#ff4f9a'], [40, 52, '#33e0d0'], [34, 44, '#7a2bd6']].map(([x, y, c]) => `${petals(x, y, 6, 2.2, 3.2, 4.4, c)}<circle class="ot" cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}
      <path class="ot" d="M8 74 Q33 80 58 74" fill="none" stroke="#ff4f9a" stroke-width="3" stroke-dasharray="3 3"/>
      <path class="sh" d="M28 22 q-1 6 0 10" stroke="#fff" stroke-width="2.4" opacity=".6" fill="none"/>`),

    // Rebozo doblado con fleco.
    rebozo: make('0 0 80 54', (k) => `
      <ellipse class="sd" cx="40" cy="50" rx="34" ry="3.4"/>
      <path class="o" d="M6 18 Q40 4 74 18 L72 42 Q40 54 8 42Z" fill="${k.g('#33e0d0', '#0b8f9a', 'h')}"/>
      <path class="ot" d="M8 28 Q40 16 72 28 M9 34 Q40 22 71 34" fill="none" stroke="#ff4f9a" stroke-width="4"/>
      <path class="ot" d="M8 23 Q40 11 72 23" fill="none" stroke="#ffd23f" stroke-width="2.4" stroke-dasharray="3 3"/>
      <path class="ot" d="M9 39 Q40 28 71 39" fill="none" stroke="#7a2bd6" stroke-width="2.4"/>
      ${Array.from({ length: 16 }, (_, i) => `<path class="ot" d="M${10 + i * 4} ${43 + Math.sin(i * 0.4) * 1} V${50 + Math.sin(i * 0.4)}" stroke="${i % 2 ? '#ff4f9a' : '#ffd23f'}" stroke-width="2"/>`).join('')}
      <path class="sh" d="M14 18 Q28 12 42 12" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>`),

    /* ------------------------------------------------------------- juguetes */
    osito: make('0 0 60 70', (k) => `
      <ellipse class="sd" cx="30" cy="67" rx="20" ry="3"/>
      <path class="o" d="M16 62 C8 62 8 50 14 46 M44 62 C52 62 52 50 46 46" fill="none" stroke-width="12"/>
      <path d="M16 62 C8 62 8 50 14 46 M44 62 C52 62 52 50 46 46" fill="none" stroke="#c98a4b" stroke-width="8.4" stroke-linecap="round"/>
      <ellipse class="o" cx="30" cy="48" rx="17" ry="18" fill="${k.r('#e0a463', '#a5612a')}"/>
      <ellipse cx="30" cy="52" rx="9" ry="11" fill="#f6d9a8"/>
      <circle class="o" cx="14" cy="14" r="7" fill="${k.g('#e0a463', '#a5612a')}"/><circle cx="14" cy="14" r="3.4" fill="#f2a0b8"/>
      <circle class="o" cx="46" cy="14" r="7" fill="${k.g('#e0a463', '#a5612a')}"/><circle cx="46" cy="14" r="3.4" fill="#f2a0b8"/>
      <circle class="o" cx="30" cy="24" r="17" fill="${k.r('#f0b873', '#b86f2f')}"/>
      <ellipse class="o" cx="30" cy="30" rx="8" ry="6" fill="#f6d9a8"/>
      <ellipse cx="30" cy="27.6" rx="3" ry="2.2" fill="#2a1a33"/>
      <path class="lt" d="M26 33 Q30 36 34 33"/>
      <circle cx="23" cy="21" r="2.4" fill="#2a1a33"/><circle cx="37" cy="21" r="2.4" fill="#2a1a33"/>
      <circle cx="23.7" cy="20.2" r=".8" fill="#fff"/><circle cx="37.7" cy="20.2" r=".8" fill="#fff"/>
      <path class="o" d="M30 40 l-9 -5 v10Z M30 40 l9 -5 v10Z" fill="${k.g('#ff6ab8', '#c2185b')}"/>
      <circle class="o" cx="30" cy="40" r="3" fill="#ffd23f"/>`),

    trompo: make('0 0 56 74', (k) => `
      <ellipse class="sd" cx="28" cy="71" rx="16" ry="2.6"/>
      <path class="ln" d="M28 4 Q8 8 6 24" stroke="#e8262b" stroke-width="2.4"/>
      <rect class="o" x="24" y="4" width="8" height="8" rx="3" fill="${k.g('#ffd23f', '#e8892b')}"/>
      <path class="o" d="M6 22 C6 12 50 12 50 22 C50 40 36 58 28 70 C20 58 6 40 6 22Z" fill="${k.g('#ff4f9a', '#a01066', 'h')}"/>
      <path class="o" d="M7 24 C14 30 42 30 49 24 C47 32 44 38 40 44 C34 48 22 48 16 44 C12 38 9 32 7 24Z" fill="${k.g('#ffd23f', '#e8892b', 'h')}"/>
      <path class="o" d="M16 44 C22 50 34 50 40 44 C37 50 33 56 28 62 C24 56 20 50 16 44Z" fill="${k.g('#33e0d0', '#0b8f9a', 'h')}"/>
      <path class="ot" d="M8 22 C14 28 42 28 48 22" fill="none" stroke="#7a2bd6" stroke-width="3" stroke-dasharray="3 3"/>
      <circle class="o" cx="28" cy="70" r="2.4" fill="#c0c4d2"/>
      <path class="sh" d="M12 22 q0 10 6 18" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`),

    /* ---------------------------------------------------------- aficiones */
    balon: make('0 0 60 60', (k) => `
      <ellipse class="sd" cx="30" cy="57" rx="18" ry="2.8"/>
      <clipPath id="clipBalon"><circle cx="30" cy="30" r="25"/></clipPath>
      <circle class="o" cx="30" cy="30" r="25" fill="${k.r('#ffffff', '#cdd3e6')}"/>
      <g clip-path="url(#clipBalon)">
        <polygon class="ot" points="30,18 41,26 37,39 23,39 19,26" fill="#2a1a43"/>
        ${[0, 1, 2, 3, 4].map((i) => { const a = (i * 2 * Math.PI) / 5 - Math.PI / 2; const x = 30 + Math.cos(a) * 26; const y = 30 + Math.sin(a) * 26; return `<polygon class="ot" points="${[0, 1, 2, 3, 4].map((j) => { const b = (j * 2 * Math.PI) / 5 + a; return `${(x + Math.cos(b) * 9).toFixed(1)},${(y + Math.sin(b) * 9).toFixed(1)}`; }).join(' ')}" fill="#2a1a43"/><path class="lt" d="M30 30 L${(30 + Math.cos(a) * 14).toFixed(1)} ${(30 + Math.sin(a) * 14).toFixed(1)}"/>`; }).join('')}
      </g>
      <circle class="ln" cx="30" cy="30" r="25"/>
      <path class="sh" d="M14 16 q6 -8 16 -9" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/>`),

    herramientas: make('0 0 70 70', (k) => `
      <g transform="rotate(35 35 35)">
        <rect class="o" x="31.4" y="8" width="7.2" height="56" rx="3" fill="${k.g('#c98a4b', '#7a4318', 'h')}"/>
        <rect class="o" x="16" y="6" width="38" height="14" rx="3" fill="${k.g('#c0c4d2', '#6c7088')}"/>
        <rect class="ot" x="16" y="6" width="9" height="14" fill="#ff4f9a"/>
      </g>
      <g transform="rotate(-35 35 35)">
        <rect class="o" x="31" y="18" width="8" height="46" rx="3.6" fill="${k.g('#c0c4d2', '#6c7088', 'h')}"/>
        <path class="o" d="M26 20 C24 6 32 2 35 2 C38 2 46 6 44 20 L39 20 V12 H31 V20Z" fill="${k.g('#d6dae6', '#7d8196', 'h')}"/>
        <circle class="ot" cx="35" cy="56" r="2.2" fill="#ffd23f"/>
      </g>
      <circle class="o" cx="35" cy="35" r="4.2" fill="#ffd23f"/>`),

    paletaPintor: make('0 0 74 62', (k) => `
      <path class="o" d="M14 40 C-2 28 8 6 34 6 C62 6 76 22 66 40 C60 50 48 44 44 52 C40 62 22 60 14 40Z" fill="${k.g('#f0b873', '#a55a2a', 'd')}"/>
      <circle class="o" cx="30" cy="36" r="4.4" fill="#fff6dc"/>
      ${[[18, 22, '#ff4f9a'], [32, 14, '#ffd23f'], [48, 16, '#33e0d0'], [58, 28, '#7a2bd6'], [44, 32, '#e8262b'], [22, 36, '#4fd16a']].map(([x, y, c]) => `<ellipse class="o" cx="${x}" cy="${y}" rx="6" ry="4.6" fill="${k.g('#ffffff', c)}"/>`).join('')}
      <path class="ln" d="M52 54 L70 22" stroke="#7a4318" stroke-width="3.4"/><path class="o" d="M70 22 L74 12 L66 16Z" fill="#ff4f9a"/>
      ${sparkle(10, 10, 4, '#fff6b0', 0.3)}`),

    loteria: make('0 0 76 70', (k) => `
      <g transform="rotate(-14 38 62)"><rect class="o" x="12" y="8" width="34" height="52" rx="4" fill="${k.g('#fff6dc', '#f0d9a0')}"/><rect class="ot" x="16" y="12" width="26" height="44" rx="2" fill="#ff7ad1"/>
      <circle class="o" cx="29" cy="30" r="8" fill="${k.g('#ffe27a', '#ff8a00')}"/>${Array.from({ length: 8 }, (_, i) => `<path class="ot" d="M29 30 L${(29 + Math.cos(i * 0.785) * 13).toFixed(1)} ${(30 + Math.sin(i * 0.785) * 13).toFixed(1)}" stroke="#ffd23f" stroke-width="2"/>`).join('')}<circle class="o" cx="29" cy="30" r="7" fill="${k.g('#ffe27a', '#ff8a00')}"/><circle cx="27" cy="29" r="1" fill="${OUT}"/><circle cx="31" cy="29" r="1" fill="${OUT}"/><path class="lt" d="M26 33 Q29 35 32 33"/>
      <text x="29" y="52" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="7" fill="#fff">EL SOL</text></g>
      <g transform="rotate(10 38 62)"><rect class="o" x="30" y="6" width="34" height="52" rx="4" fill="${k.g('#fff6dc', '#f0d9a0')}"/><rect class="ot" x="34" y="10" width="26" height="44" rx="2" fill="#33e0d0"/>
      <path class="o" d="M47 22 C38 24 38 40 48 42 C42 36 42 28 47 22Z" fill="${k.g('#fff6b0', '#ffd23f')}"/>
      <text x="47" y="50" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="7" fill="#fff">LA LUNA</text></g>`),
  });
})(window.AltarPlaceholders);
