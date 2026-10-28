/* =========================================================================
 * ILUSTRACIONES DEL ALTAR (base)
 * -------------------------------------------------------------------------
 * Aquí viven los estilos, las animaciones y las utilidades para dibujar las
 * ilustraciones vectoriales (SVG) con apariencia de caricatura: contorno
 * oscuro, degradados y brillos. Los dibujos de cada grupo de objetos están en:
 *   js/art-religion.js   · religiosos, fotos, papel picado de mesa
 *   js/art-luz-flores.js · velas, faroles y flores
 *   js/art-comida.js     · alimentos, bebidas y agua
 *   js/art-recuerdos.js  · calaveras y objetos personales
 *   js/art-escenario.js  · niveles, manteles, fondo y papel picado colgante
 *
 * Cada función recibe la entrada del catálogo y devuelve un string <svg> SIN
 * width/height (el lienzo lo escala). Para usar una imagen propia en lugar de
 * un dibujo, en js/config.js cambia `render: PH.x` por `image: 'ruta.png'`.
 * ========================================================================= */
window.AltarPlaceholders = (function () {
  const NS = 'xmlns="http://www.w3.org/2000/svg"';
  const OUT = '#3a0d4a'; // color del contorno de todas las ilustraciones

  // Estilos compartidos (también se incluyen en la imagen descargada).
  const CSS = `
    .ph{overflow:visible}
    .o{stroke:${OUT};stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
    .ot{stroke:${OUT};stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
    .ln{fill:none;stroke:${OUT};stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
    .lt{fill:none;stroke:${OUT};stroke-width:1.3;stroke-linejoin:round;stroke-linecap:round}
    .sh{fill:#fff;opacity:.5;stroke:none}
    .sd{fill:#000;opacity:.14;stroke:none}
    .ph-flame{transform-box:fill-box;transform-origin:50% 100%;animation:ph-flicker 1.1s ease-in-out infinite alternate}
    .ph-flame2{animation-delay:-.5s;animation-duration:.8s}
    .ph-sway{transform-box:fill-box;transform-origin:50% 0;animation:ph-sway 3.2s ease-in-out infinite alternate}
    .ph-bob{transform-box:fill-box;transform-origin:50% 100%;animation:ph-bob 2.6s ease-in-out infinite alternate}
    .ph-glow{animation:ph-glow 1.8s ease-in-out infinite alternate}
    .ph-twinkle{transform-box:fill-box;transform-origin:50% 50%;animation:ph-twinkle 2s ease-in-out infinite}
    .ph-smoke{transform-box:fill-box;transform-origin:50% 100%;animation:ph-smoke 3.4s ease-in-out infinite}
    .ph-spin{transform-box:fill-box;transform-origin:50% 50%;animation:ph-spin 14s linear infinite}
    @keyframes ph-flicker{
      0%{transform:scale(1,1) rotate(-3deg)}
      50%{transform:scale(.9,1.1) rotate(2deg)}
      100%{transform:scale(1.05,.95) rotate(-1deg)}}
    @keyframes ph-sway{0%{transform:rotate(-5deg)}100%{transform:rotate(5deg)}}
    @keyframes ph-bob{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-2.5px) scale(1.02)}}
    @keyframes ph-glow{0%{opacity:.35}100%{opacity:.85}}
    @keyframes ph-twinkle{0%,100%{opacity:.25;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
    @keyframes ph-smoke{0%{opacity:0;transform:translateY(4px) scale(.7)}30%{opacity:.8}100%{opacity:0;transform:translateY(-14px) scale(1.25)}}
    @keyframes ph-spin{to{transform:rotate(360deg)}}
    @media (prefers-reduced-motion:reduce){.ph-flame,.ph-sway,.ph-bob,.ph-glow,.ph-twinkle,.ph-smoke,.ph-spin{animation:none}}
  `;

  // Ya no se usan variables CSS dentro de los dibujos (lo exige la exportación).
  const VARS = [];

  /* ------------------------------------------------------------ utilidades */

  // Fábrica de degradados: devuelve `url(#id)` y recuerda la definición.
  // Los colores deben ser hexadecimales de 6 dígitos (#rrggbb).
  function kit() {
    const D = [];
    const seen = {};
    const add = (id, def) => { if (!seen[id]) { seen[id] = 1; D.push(def); } };
    const stops = (a, b) => `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>`;
    return {
      D,
      // dir: 'v' arriba→abajo, 'h' izquierda→derecha, 'd' diagonal
      g(a, b, dir = 'v') {
        const id = `g${a.slice(1)}${b.slice(1)}${dir}`;
        const [x2, y2] = dir === 'v' ? [0, 1] : dir === 'h' ? [1, 0] : [1, 1];
        add(id, `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(a, b)}</linearGradient>`);
        return `url(#${id})`;
      },
      // Degradado radial con la luz arriba a la izquierda (volumen).
      r(a, b) {
        const id = `r${a.slice(1)}${b.slice(1)}`;
        add(id, `<radialGradient id="${id}" cx=".35" cy=".3" r=".8">${stops(a, b)}</radialGradient>`);
        return `url(#${id})`;
      },
    };
  }

  // Crea una función de dibujo: make('0 0 60 80', (k, entry) => `...`)
  const make = (viewBox, fn) => (entry) => {
    const k = kit();
    const body = fn(k, entry || {});
    const defs = k.D.length ? `<defs>${k.D.join('')}</defs>` : '';
    return `<svg ${NS} viewBox="${viewBox}" preserveAspectRatio="xMidYMax meet" class="ph">${defs}${body}</svg>`;
  };

  // Anillo de pétalos alrededor de (cx, cy).
  const petals = (cx, cy, n, rx, ry, dist, fill, rot = 0) =>
    Array.from({ length: n }, (_, i) =>
      `<ellipse class="ot" style="stroke-width:${Math.max(0.45, Math.min(1.3, rx * 0.3)).toFixed(2)}px" cx="${cx}" cy="${cy - dist}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${(rot + (i * 360) / n).toFixed(1)} ${cx} ${cy})"/>`).join('');

  // Flor de capas (cempasúchil y similares): anillos de pétalos y centro.
  const bloom = (k, cx, cy, r, c1, c2, center) =>
    petals(cx, cy, 11, r * 0.27, r * 0.4, r * 0.6, k.g(c1, c2), 0) +
    petals(cx, cy, 11, r * 0.25, r * 0.36, r * 0.4, k.g(c2, c1), 16) +
    petals(cx, cy, 8, r * 0.18, r * 0.24, r * 0.2, k.g(c1, c2), 8) +
    `<circle class="ot" style="stroke-width:${Math.max(0.45, Math.min(1.3, r * 0.04)).toFixed(2)}px" cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="${center}"/>`;

  // Destello de cuatro puntas.
  const sparkle = (x, y, s, fill = '#fff6b0', delay = 0) =>
    `<path class="ph-twinkle" style="animation-delay:${delay}s" fill="${fill}" d="M${x} ${y - s} Q${x + s * 0.15} ${y - s * 0.15} ${x + s} ${y} Q${x + s * 0.15} ${y + s * 0.15} ${x} ${y + s} Q${x - s * 0.15} ${y + s * 0.15} ${x - s} ${y} Q${x - s * 0.15} ${y - s * 0.15} ${x} ${y - s}Z"/>`;

  // Llama animada con su resplandor; (x, y) es la base de la llama.
  const flame = (k, x, y, h = 16, delay = 0) => {
    const w = h * 0.42;
    return `<g class="ph-glow" style="animation-delay:${delay}s"><circle cx="${x}" cy="${y - h * 0.5}" r="${h * 0.95}" fill="#ffb300" opacity=".28"/></g>
      <path class="o ph-flame" style="animation-delay:${delay}s" fill="${k.g('#fff3a8', '#ff6a00')}" d="M${x} ${y - h} C${x + w * 1.1} ${y - h * 0.55} ${x + w * 1.1} ${y - h * 0.15} ${x} ${y} C${x - w * 1.1} ${y - h * 0.15} ${x - w * 1.1} ${y - h * 0.55} ${x} ${y - h}Z"/>
      <path class="ph-flame ph-flame2" fill="#fff" opacity=".85" d="M${x} ${y - h * 0.5} C${x + w * 0.4} ${y - h * 0.3} ${x + w * 0.35} ${y - h * 0.08} ${x} ${y - h * 0.04} C${x - w * 0.35} ${y - h * 0.08} ${x - w * 0.4} ${y - h * 0.3} ${x} ${y - h * 0.5}Z"/>`;
  };

  // Silueta de persona (retratos): cabeza y hombros en un recuadro de 60 × 70.
  const person = (k, c1, c2, skin = '#f3c9a0') =>
    `<path class="o" d="M8 70 C8 50 18 42 30 42 C42 42 52 50 52 70Z" fill="${k.g(c1, c2)}"/>
     <circle class="o" cx="30" cy="27" r="11" fill="${skin}"/>
     <path class="o" d="M19 25 C19 13 41 13 41 25 C37 19 24 19 19 25Z" fill="#3b2a35"/>`;

  // Se completa con js/art-*.js mediante Object.assign.
  return { CSS, VARS, OUT, kit, make, petals, bloom, sparkle, flame, person };
})();

// Inyecta los estilos de las ilustraciones en la página.
(function () {
  const style = document.createElement('style');
  style.textContent = window.AltarPlaceholders.CSS;
  document.head.appendChild(style);
})();
