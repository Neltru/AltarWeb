/* =========================================================================
 * ILUSTRACIONES · Religiosos, retratos, aromas y papel picado de mesa
 * ========================================================================= */
(function (PH) {
  const { make, petals, bloom, sparkle } = PH;

  // Datos del difunto (nombre y foto). Los modifica el botón "Mi ser querido"
  // de js/editor.js; los retratos del altar se redibujan al cambiarlos.
  PH.deceased = { name: '', photo: '' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const FONT = 'Georgia,\'Times New Roman\',serif';

  // Marco con arco superior para santos, virgen y ánimas (70 × 94).
  const ARCH = 'M10 86 V33 Q10 10 35 10 Q60 10 60 33 V86 Z';
  const archFrame = (k, bg1, bg2, inner, id) => `
    <path class="o" d="M4 90 V32 Q4 3 35 3 Q66 3 66 32 V90 Z" fill="${k.g('#ffe27a', '#d9801a')}"/>
    <path class="ot" d="${ARCH}" fill="${k.g(bg1, bg2)}"/>
    <clipPath id="${id}"><path d="${ARCH}"/></clipPath>
    <g clip-path="url(#${id})">${inner}</g>
    <path class="ln" d="${ARCH}"/>
    <circle class="ot" cx="35" cy="5" r="3.2" fill="#ff4f9a"/>
    <circle class="ot" cx="8" cy="88" r="3" fill="#ff8a00"/><circle class="ot" cx="62" cy="88" r="3" fill="#ff8a00"/>`;

  // Rayos que salen de un punto.
  const rays = (cx, cy, n, len, fill, op = 0.5) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n;
      const b = a + Math.PI / n;
      const p = (ang, r) => `${(cx + Math.cos(ang) * r).toFixed(1)} ${(cy + Math.sin(ang) * r).toFixed(1)}`;
      return `<path d="M${cx} ${cy} L${p(a, len)} L${p(b, len)}Z" fill="${fill}" opacity="${op}"/>`;
    }).join('');

  // Marco rectangular de fotografía (60 × 76) con interior personalizable.
  const photoFrame = (k, c1, c2, inner, id) => `
    <rect class="o" x="3" y="3" width="54" height="68" rx="6" fill="${k.g(c1, c2)}"/>
    <rect class="ot" x="9" y="9" width="42" height="56" rx="3" fill="${k.g('#fff4cf', '#f0c987')}"/>
    <clipPath id="${id}"><rect x="9" y="9" width="42" height="56" rx="3"/></clipPath>
    <g clip-path="url(#${id})">${inner}</g>
    <rect class="ln" x="9" y="9" width="42" height="56" rx="3"/>
    <path class="sh" d="M7 8 H30 L7 30Z" opacity=".25"/>`;

  // Fotografía del difunto: la foto real si el usuario la cargó, o una silueta.
  const portraitInner = (k, x, y, w, h) => PH.deceased.photo
    ? `<image href="${PH.deceased.photo}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.g('#9fe3ff', '#7a5cd6')}"/>
       <g transform="translate(${x} ${y + h * 0.05}) scale(${(w / 60).toFixed(3)} ${((h * 0.95) / 70).toFixed(3)})">${PH.person(k, '#ff4f9a', '#b3166b')}</g>`;

  // Tablero con una cruz hecha de material (sal, ceniza o flores) — 60 × 80.
  const crossBoard = (k, wood1, wood2, mat, kind) => {
    const cross = 'M25 6 H35 V20 H50 V30 H35 V62 H25 V30 H10 V20 H25Z';
    let body = `
      <path class="o" d="M8 74 H52 L48 66 H12Z" fill="${k.g('#a55a2a', '#5b2a12')}"/>
      <rect class="o" x="4" y="2" width="52" height="66" rx="7" fill="${k.g(wood1, wood2)}"/>
      <rect class="ot" x="8" y="6" width="44" height="58" rx="4" fill="${k.g(wood2, wood1)}" opacity=".55"/>`;
    if (kind === 'flores') {
      const pts = [[30, 11], [30, 22], [30, 33], [30, 44], [30, 55], [15, 25], [22, 25], [38, 25], [45, 25]];
      body += `<path d="${cross}" fill="#2f8f3a" opacity=".7"/>` +
        pts.map(([x, y], i) => bloom(k, x, y, 7, i % 2 ? '#ffd23f' : '#ffb000', '#ff7a00', '#b84a00')).join('');
    } else {
      body += `<path class="o" d="${cross}" fill="${mat}"/>
        <path class="sh" d="M27 8 H31 V60 H27Z"/>` +
        Array.from({ length: 30 }, (_, i) => {
          const rnd = (s) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
          const vertical = i % 2 === 0;
          const x = vertical ? 26.5 + rnd(1) * 7 : 11.5 + rnd(2) * 37;
          const y = vertical ? 8 + rnd(3) * 52 : 21.5 + rnd(4) * 7;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.7 + rnd(5) * 0.7).toFixed(1)}" fill="${kind === 'sal' ? '#dfe9ff' : '#6d6d7a'}" opacity=".85"/>`;
        }).join('') + (kind === 'sal' ? sparkle(14, 12, 4, '#fff', 0) + sparkle(47, 52, 3.5, '#cfeaff', 0.8) : '');
    }
    return body;
  };

  // Papel picado de mesa: panel con calados sostenido por dos varas (90 × 74).
  const panelPicado = (k, base1, base2, holes, id) => {
    const n = 7;
    const step = 70 / n;
    const d = `M10 10 H80 V54 ` + Array.from({ length: n }, (_, i) => `Q${(80 - step * (i + 0.5)).toFixed(1)} 64 ${(80 - step * (i + 1)).toFixed(1)} 54`).join(' ') + ' Z';
    return `
      <rect class="o" x="3" y="3" width="4" height="70" rx="2" fill="${k.g('#c98a4b', '#7a4318')}"/>
      <rect class="o" x="83" y="3" width="4" height="70" rx="2" fill="${k.g('#c98a4b', '#7a4318')}"/>
      <rect class="o" x="2" y="6" width="86" height="4" rx="2" fill="${k.g('#e0a463', '#8a4d1c')}"/>
      <g class="ph-sway" style="animation-duration:4.5s">
        <mask id="${id}"><rect width="90" height="74" fill="#fff"/>${holes}</mask>
        <path class="o" d="${d}" fill="${k.g(base1, base2)}" mask="url(#${id})"/>
        <path class="ln" d="${d}" mask="url(#${id})" opacity=".5"/>
      </g>`;
  };

  const flowerHole = (cx, cy, r) =>
    Array.from({ length: 8 }, (_, i) => `<ellipse cx="${cx}" cy="${cy - r * 0.62}" rx="${r * 0.3}" ry="${r * 0.45}" fill="#000" transform="rotate(${i * 45} ${cx} ${cy})"/>`).join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.25}" fill="#fff"/>`;

  Object.assign(PH, {
    /* ------------------------------------------------------------ retratos */
    // Imagen principal del difunto (marco dorado con placa de nombre).
    retrato: make('0 0 70 94', (k) => {
      const name = esc((PH.deceased.name || (window.I18N ? window.I18N.t('lovedDefault') : 'Mi ser querido')).slice(0, 26));
      const fs = name.length > 16 ? 6 : name.length > 11 ? 7.4 : 9;
      return `
        <rect class="o" x="3" y="3" width="64" height="72" rx="12" fill="${k.g('#ffe27a', '#d9801a')}"/>
        <rect class="ot" x="8" y="8" width="54" height="62" rx="8" fill="${k.g('#c5601a', '#ffd24a')}"/>
        <clipPath id="clipRet"><ellipse cx="35" cy="39" rx="21" ry="26"/></clipPath>
        <g clip-path="url(#clipRet)">${portraitInner(k, 14, 13, 42, 52)}</g>
        <ellipse class="ln" cx="35" cy="39" rx="21" ry="26"/>
        ${bloom(k, 9, 12, 8, '#ffd23f', '#ff8a00', '#b84a00')}${bloom(k, 61, 12, 8, '#ffd23f', '#ff8a00', '#b84a00')}
        ${bloom(k, 9, 68, 8, '#ff7ad1', '#d41f86', '#7a0a4b')}${bloom(k, 61, 68, 8, '#ff7ad1', '#d41f86', '#7a0a4b')}
        <rect class="o" x="6" y="77" width="58" height="15" rx="5" fill="${k.g('#fff8dc', '#f6d58e')}"/>
        <text x="35" y="${77 + 10.2}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-style="italic" font-size="${fs}" fill="#5b1a5d">${name}</text>
        ${sparkle(35, 4, 4, '#fff', 0.3)}`;
    }),

    // Fotografía adicional del difunto (marco turquesa y moño negro).
    fotoDifunto: make('0 0 60 76', (k) => `
      ${photoFrame(k, '#33e0d0', '#0b8f9a', portraitInner(k, 9, 9, 42, 56), 'clipFD')}
      <path class="o" d="M46 62 L58 72 L52 58Z M46 62 L52 74 L58 66Z" fill="#241333"/>
      <circle class="o" cx="50" cy="63" r="3" fill="#3b2352"/>`),

    // Fotografía grande del difunto: misma foto y datos que la fotografía normal,
    // con marco dorado y flores de cempasúchil (su tamaño se define en config.js).
    fotoGrande: make('0 0 60 76', (k) => `
      ${photoFrame(k, '#ffd23f', '#d9801a', portraitInner(k, 9, 9, 42, 56), 'clipFG')}
      ${bloom(k, 6, 70, 7, '#ffd23f', '#ff8a00', '#b84a00')}${bloom(k, 54, 70, 7, '#ffb000', '#ff6a00', '#a23c00')}
      <path class="o" d="M46 62 L58 72 L52 58Z M46 62 L52 74 L58 66Z" fill="#241333"/>
      <circle class="o" cx="50" cy="63" r="3" fill="#3b2352"/>`),

    // Fotografía familiar (silueta de dos personas, marco rosa).
    fotoFamilia: make('0 0 60 76', (k) => photoFrame(k, '#ff6fb5', '#c2185b', `
      <rect x="9" y="9" width="42" height="56" fill="${k.g('#ffe9a8', '#ffb86b')}"/>
      <g transform="translate(5 14) scale(.62)">${PH.person(k, '#2fb7a5', '#157a74')}</g>
      <g transform="translate(26 20) scale(.55)">${PH.person(k, '#8e44d6', '#512a94', '#e8b48a')}</g>`, 'clipFF')),

    /* --------------------------------------------------------- devocionales */
    santo: make('0 0 70 94', (k) => archFrame(k, '#bfeaff', '#ffe9a8', `
      ${rays(35, 38, 14, 60, '#ffd54a', 0.45)}
      <path class="o" d="M17 90 C17 60 25 48 35 48 C45 48 53 60 53 90Z" fill="${k.g('#9a5a2c', '#5a2f14')}"/>
      <path class="o" d="M26 52 C30 70 28 80 22 90 H48 C42 80 40 70 44 52 C40 56 30 56 26 52Z" fill="${k.g('#4fb66a', '#1f7a43')}"/>
      <circle class="o" cx="35" cy="38" r="14" fill="${k.g('#fff3a8', '#ffc83a')}"/>
      <circle class="o" cx="35" cy="40" r="8.5" fill="#f1c39a"/>
      <path class="o" d="M26 38 C26 28 44 28 44 38 C41 33 29 33 26 38Z" fill="#6b3f22"/>
      <circle cx="32" cy="41" r="1.1" fill="#3a0d4a"/><circle cx="38" cy="41" r="1.1" fill="#3a0d4a"/>
      <path class="lt" d="M32.5 45 Q35 47 37.5 45"/>
      <ellipse class="o" cx="35" cy="66" rx="5" ry="3.6" fill="#f1c39a"/>
      <path class="o" d="M52 56 V80" /><circle class="o" cx="52" cy="54" r="3" fill="#ff7ad1"/>`, 'clipSanto'),
    'santo'),

    virgen: make('0 0 70 94', (k) => {
      const star = Array.from({ length: 32 }, (_, i) => {
        const a = (i * Math.PI) / 16;
        const r = i % 2 ? 29 : 37;
        return `${(35 + Math.cos(a) * r).toFixed(1)},${(54 + Math.sin(a) * r).toFixed(1)}`;
      }).join(' ');
      const stars = [[25, 52], [45, 56], [22, 70], [48, 72], [30, 82], [41, 84], [35, 44]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#ffe27a"/>`).join('');
      return archFrame(k, '#ff9fd0', '#7a3fcf', `
        <polygon class="ot" points="${star}" fill="${k.g('#fff3a0', '#ffb300')}"/>
        <path class="o" d="M35 27 C19 30 15 58 12 92 H58 C55 58 51 30 35 27Z" fill="${k.g('#38c8b0', '#136e8c')}"/>
        ${stars}
        <path class="o" d="M35 45 C28 52 26 72 23 92 H47 C44 72 42 52 35 45Z" fill="${k.g('#ffb3d6', '#e0508f')}"/>
        <circle class="o" cx="35" cy="37" r="8" fill="#f1c39a"/>
        <path class="o" d="M27 36 C27 26 43 26 43 36 C40 31 30 31 27 36Z" fill="#4a2a1c"/>
        <path class="o" d="M29 26 L32 21 L35 25 L38 21 L41 26Z" fill="#ffd23f"/>
        <path class="lt" d="M32.5 40.5 Q35 42.5 37.5 40.5"/>
        <ellipse class="o" cx="35" cy="58" rx="3.2" ry="4.4" fill="#f1c39a"/>
        <path class="o" d="M23 90 Q35 80 47 90Z" fill="${k.g('#ffe27a', '#d9801a')}"/>`, 'clipVirgen');
    }),

    animas: make('0 0 70 94', (k) => archFrame(k, '#ffe9a8', '#ff7a1a', `
      ${rays(35, 8, 11, 90, '#fff7c2', 0.65)}
      <path class="o" d="M10 90 C14 70 18 66 20 56 C24 64 26 62 28 50 C32 60 34 58 35 44 C38 58 42 58 44 50 C46 62 48 64 50 56 C52 66 56 70 60 90Z" fill="${k.g('#ffd23f', '#e8262b')}"/>
      <path class="ot" d="M18 90 C22 76 26 72 28 64 C31 72 33 70 35 58 C37 70 40 72 42 64 C44 72 48 76 52 90Z" fill="${k.g('#fff3a8', '#ff8a00')}"/>
      <g>
        <circle class="o" cx="26" cy="66" r="5.6" fill="#fff0e0"/><circle cx="24.3" cy="66" r="1" fill="#3a0d4a"/><circle cx="27.7" cy="66" r="1" fill="#3a0d4a"/>
        <path class="o" d="M23 78 L26 71 L29 78Z" fill="#fff0e0"/>
        <circle class="o" cx="44" cy="62" r="5.6" fill="#fff0e0"/><circle cx="42.3" cy="62" r="1" fill="#3a0d4a"/><circle cx="45.7" cy="62" r="1" fill="#3a0d4a"/>
        <path class="o" d="M41 74 L44 67 L47 74Z" fill="#fff0e0"/>
        <path class="o" d="M22 71 L20 58 M30 71 L33 58 M40 67 L37 56 M48 67 L51 54" fill="none"/>
      </g>
      <path class="o" d="M31 14 H39 V22 H46 V28 H39 V40 H31 V28 H24 V22 H31Z" fill="${k.g('#ffffff', '#ffe27a')}"/>`, 'clipAnimas'),
    'animas'),

    // Crucifijo de madera con rayos.
    crucifijo: make('0 0 50 80', (k) => `
      <circle class="sh" cx="25" cy="30" r="24" opacity=".25"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M25 28 L${25 + Math.cos(i * 0.5236) * 25} ${28 + Math.sin(i * 0.5236) * 25} L${25 + Math.cos(i * 0.5236 + 0.2) * 25} ${28 + Math.sin(i * 0.5236 + 0.2) * 25}Z" fill="#ffd54a" opacity=".8"/>`).join('')}
      <path class="o" d="M20 4 H30 V20 H44 V30 H30 V66 H20 V30 H6 V20 H20Z" fill="${k.g('#c98a4b', '#6b3512')}"/>
      <path class="sh" d="M22 6 H25 V64 H22Z M8 22 H42 V24 H8Z" opacity=".35"/>
      <circle class="o" cx="25" cy="25" r="4" fill="#ffd23f"/>
      <path class="o" d="M10 76 H40 L36 66 H14Z" fill="${k.g('#a55a2a', '#5b2a12')}"/>`),

    cruzSal: make('0 0 60 80', (k) => crossBoard(k, '#8e5bd0', '#4a2a8c', '#ffffff', 'sal')),
    cruzCeniza: make('0 0 60 80', (k) => crossBoard(k, '#7a8fa8', '#3b4a63', '#c9ccd6', 'ceniza')),
    cruzFlores: make('0 0 60 80', (k) => crossBoard(k, '#2fae8f', '#127a68', '', 'flores')),

    /* ------------------------------------------------------- arco de flores */
    arcoFlores: make('0 0 100 100', (k) => {
      const cols = [['#ffd23f', '#ff8a00', '#b84a00'], ['#ffb000', '#ff6a00', '#a23c00'], ['#ffe066', '#ffa000', '#b86200']];
      let out = `<path class="o" d="M9 98 V50 A41 41 0 0 1 91 50 V98" fill="none" stroke="#2f8f3a" stroke-width="14"/>
        <path d="M9 98 V50 A41 41 0 0 1 91 50 V98" fill="none" stroke="#7bd36a" stroke-width="5" opacity=".6"/>`;
      const blooms = [];
      for (let i = 0; i <= 12; i++) {
        const a = Math.PI - (i * Math.PI) / 12;
        blooms.push([50 + Math.cos(a) * 41, 50 - Math.sin(a) * 41]);
      }
      for (let y = 56; y <= 94; y += 9) { blooms.push([9, y]); blooms.push([91, y]); }
      blooms.forEach(([x, y], i) => {
        const c = cols[i % 3];
        out += bloom(k, x.toFixed(1), y.toFixed(1), 8.2, c[0], c[1], c[2]);
      });
      out += bloom(k, 50, 9, 9, '#ff7ad1', '#d41f86', '#7a0a4b');
      return out + sparkle(50, 40, 5, '#fff6b0', 0.2) + sparkle(30, 62, 4, '#fff6b0', 1);
    }),

    /* ------------------------------------------------------ aromas y sal */
    copal: make('0 0 60 82', (k) => `
      <path class="ph-smoke" fill="#ffffff" opacity=".7" d="M26 30 C16 22 32 18 26 8 C36 14 24 22 34 30Z"/>
      <path class="ph-smoke" style="animation-delay:-1.4s" fill="#ffffff" opacity=".6" d="M36 28 C28 20 42 16 36 6 C44 12 34 20 42 28Z"/>
      <path class="o" d="M10 36 Q30 52 50 36 Q48 70 30 70 Q12 70 10 36Z" fill="${k.g('#e2793a', '#8a3a14')}"/>
      <ellipse class="o" cx="30" cy="36" rx="20" ry="7" fill="${k.g('#ff9a3c', '#c2501a')}"/>
      <ellipse cx="30" cy="35" rx="15" ry="4.8" fill="#2a1424"/>
      <circle class="ph-glow" cx="24" cy="35" r="3" fill="#ff5a1f"/><circle class="ph-glow" style="animation-delay:-.7s" cx="33" cy="34" r="3.4" fill="#ffb300"/><circle class="ph-glow" style="animation-delay:-1.2s" cx="38" cy="36" r="2.4" fill="#ff5a1f"/>
      <path class="ot" d="M14 48 Q30 58 46 48" fill="none" stroke="#ffd23f" stroke-width="2.4"/>
      ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${17 + i * 6.6}" cy="${53 + (i % 2 ? 0 : 1.6)}" r="1.6" fill="#ffe9a8"/>`).join('')}
      <path class="o" d="M20 70 L16 80 H44 L40 70Z" fill="${k.g('#c2501a', '#6a2a0e')}"/>`),

    incienso: make('0 0 50 82', (k) => `
      <path class="ph-smoke" fill="#fff" opacity=".7" d="M19 28 C10 20 26 16 18 6 C28 12 17 20 25 28Z"/>
      <path class="ph-smoke" style="animation-delay:-1.2s" fill="#fff" opacity=".6" d="M30 26 C23 18 36 14 29 5 C37 11 27 19 35 26Z"/>
      <path class="o" d="M10 70 L9 82 H41 L40 70Z" fill="${k.g('#33e0d0', '#0b8f9a')}"/>
      <path class="o" d="M7 62 H43 L40 74 H10Z" fill="${k.g('#ffd23f', '#e8892b')}"/>
      <ellipse class="o" cx="25" cy="62" rx="18" ry="5" fill="${k.g('#f6e0b8', '#d9b887')}"/>
      <path class="ln" d="M17 61 L12 34 M25 61 L24 30 M33 61 L38 34" stroke="#8a4d1c" stroke-width="2.6"/>
      <circle class="ph-glow" cx="12" cy="34" r="2.2" fill="#ff5a1f"/><circle class="ph-glow" style="animation-delay:-.6s" cx="24" cy="30" r="2.2" fill="#ff5a1f"/><circle class="ph-glow" style="animation-delay:-1s" cx="38" cy="34" r="2.2" fill="#ff5a1f"/>
      <path class="ot" d="M12 70 H38" stroke="#ff4f9a" stroke-width="2.4" fill="none"/>`),

    sal: make('0 0 66 56', (k) => `
      <ellipse class="o" cx="33" cy="48" rx="30" ry="7" fill="${k.g('#4aa8ff', '#1b4fa3')}"/>
      <ellipse class="ot" cx="33" cy="46" rx="24" ry="4.6" fill="#f5fbff"/>
      <path class="o" d="M10 46 Q20 18 33 12 Q46 18 56 46Z" fill="${k.g('#ffffff', '#cfe3f2')}"/>
      <path class="sh" d="M24 38 Q29 24 33 18" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>
      ${sparkle(18, 22, 5, '#ffffff', 0.1)}${sparkle(50, 28, 4, '#bfe6ff', 0.9)}${sparkle(33, 8, 3.5, '#fff', 1.5)}
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${14 + i * 6.4}" cy="48" r="1.5" fill="#fff"/>`).join('')}`),

    /* ------------------------------------------------ papel picado de mesa */
    papelFlores: make('0 0 90 74', (k) => panelPicado(k, '#ff6ab8', '#d41f86',
      flowerHole(45, 30, 15) + flowerHole(20, 22, 7) + flowerHole(70, 22, 7) +
      Array.from({ length: 6 }, (_, i) => `<circle cx="${18 + i * 11}" cy="47" r="2.4" fill="#000"/>`).join(''), 'mkPF')),

    papelCalavera: make('0 0 90 74', (k) => panelPicado(k, '#ffa11a', '#e0560a',
      `<ellipse cx="45" cy="27" rx="14" ry="15" fill="#000"/><rect x="38" y="36" width="14" height="12" rx="3" fill="#000"/>
       <circle cx="39.5" cy="27" r="4" fill="#fff"/><circle cx="50.5" cy="27" r="4" fill="#fff"/><path d="M45 32 L47 36 L43 36Z" fill="#fff"/>
       <rect x="41" y="42" width="2" height="5" fill="#fff"/><rect x="47" y="42" width="2" height="5" fill="#fff"/>
       ${[16, 74].map((x) => `<path d="M${x} 16 l3 6 -3 6 -3 -6Z" fill="#000"/>`).join('')}
       ${Array.from({ length: 7 }, (_, i) => `<circle cx="${14 + i * 10.3}" cy="50" r="1.8" fill="#000"/>`).join('')}`, 'mkPC')),

    papelEstrellas: make('0 0 90 74', (k) => {
      const star = (cx, cy, r) => `<polygon fill="#000" points="${Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const rr = i % 2 ? r * 0.45 : r;
        return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
      }).join(' ')}"/>`;
      return panelPicado(k, '#27d3d6', '#0a8d9c', star(45, 28, 15) + star(20, 24, 7) + star(70, 24, 7) +
        Array.from({ length: 5 }, (_, i) => `<path d="M${16 + i * 14.5} 44 l4 6 -4 6 -4 -6Z" fill="#000"/>`).join(''), 'mkPE');
    }),

    papelOndas: make('0 0 90 74', (k) => panelPicado(k, '#a8e63d', '#3aa335',
      [18, 30, 42].map((y) => `<path d="M12 ${y} q6.5 -8 13 0 t13 0 t13 0 t13 0 t13 0" fill="none" stroke="#000" stroke-width="3.2"/>`).join('') +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${14 + i * 10.3}" cy="51" r="2.2" fill="#000"/>`).join(''), 'mkPO')),
  });
})(window.AltarPlaceholders);
