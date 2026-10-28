/* =========================================================================
 * IDIOMAS (español por defecto · inglés opcional)
 * -------------------------------------------------------------------------
 * - El español sigue viviendo en js/config.js y en los HTML; este archivo
 *   agrega las traducciones al inglés y sabe cambiar entre ambos.
 * - `I18N.t('clave', { variable })` devuelve un texto de la interfaz.
 * - `I18N.localizeConfig(CFG)` hace que nombres, descripciones, niveles,
 *   categorías, manteles y papel picado cambien solos según el idioma.
 * - Para agregar un idioma nuevo: añade su código a `LANGS` y una columna más
 *   en `UI`, `ITEMS`, `FLOORS`, etc.
 * ========================================================================= */
window.I18N = (function () {
  const KEY = 'altar-digital:lang';
  const LANGS = ['es', 'en'];
  let lang = 'es';
  try {
    const saved = localStorage.getItem(KEY);
    if (LANGS.includes(saved)) lang = saved;
  } catch { /* sin almacenamiento */ }

  /* ---------------------------------------------------- textos de interfaz */
  const UI = {
    // ----- Página de inicio -----
    pageTitleHome: { es: 'Altar de Muertos digital', en: 'Digital Day of the Dead Altar' },
    pageDescHome: { es: 'Arma y comparte tu altar de muertos en línea.', en: 'Build and share your Day of the Dead altar online.' },
    brandHome: { es: 'Altar de Muertos digital', en: 'Digital Day of the Dead Altar' },
    logosAria: { es: 'Instituciones participantes', en: 'Participating institutions' },
    heroEyebrow: { es: 'Día de Muertos', en: 'Day of the Dead' },
    heroTitle: { es: 'Altar de Muertos digital', en: 'Digital Day of the Dead Altar' },
    heroText: {
      es: 'Arma una ofrenda de siete niveles para recordar a quienes ya no están. Arrastra flores, velas, pan de muerto, fotos y recuerdos; consulta la guía de cada nivel, descarga tu altar como imagen o compártelo con tu familia.',
      en: 'Build a seven-level ofrenda to remember those who are no longer with us. Drag flowers, candles, pan de muerto, photos and keepsakes; read the guide for each level, download your altar as an image or share it with your family.',
    },
    heroCta: { es: 'Crear mi altar', en: 'Create my altar' },
    previewAria: { es: 'Vista previa del altar', en: 'Altar preview' },
    previewCaption: { es: 'Así puede quedar tu ofrenda de siete niveles', en: 'This is how your seven-level ofrenda could look' },
    footer: { es: 'Altar de Muertos digital · Hecho con cariño para recordar a quienes ya no están.', en: 'Digital Day of the Dead Altar · Made with love to remember those who are no longer with us.' },

    // ----- Selector de idioma -----
    langLabel: { es: 'Idioma', en: 'Language' },
    langEs: { es: 'Español', en: 'Spanish' },
    langEn: { es: 'Inglés', en: 'English' },

    // ----- Editor: barra superior -----
    pageTitleEditor: { es: 'Mi altar de Día de Muertos · Editor', en: 'My Day of the Dead altar · Editor' },
    brand: { es: 'Altar de Muertos', en: 'Day of the Dead Altar' },
    backHome: { es: 'Volver al inicio', en: 'Back to home' },
    actions: { es: 'Acciones', en: 'Actions' },
    guide: { es: 'Guía de niveles', en: 'Level guide' },
    loved: { es: 'Mi ser querido', en: 'My loved one' },
    lovedTitleBtn: { es: 'Personalizar nombre y foto del difunto', en: 'Customize the name and photo of your loved one' },
    undo: { es: 'Deshacer', en: 'Undo' },
    undoTip: { es: 'Deshacer (Ctrl+Z)', en: 'Undo (Ctrl+Z)' },
    redo: { es: 'Rehacer', en: 'Redo' },
    redoTip: { es: 'Rehacer (Ctrl+Y)', en: 'Redo (Ctrl+Y)' },
    clear: { es: 'Reiniciar', en: 'Reset' },
    clearTip: { es: 'Reiniciar altar', en: 'Reset altar' },
    save: { es: 'Guardar', en: 'Save' },
    download: { es: 'Descargar imagen', en: 'Download image' },
    share: { es: 'Compartir', en: 'Share' },

    // ----- Editor: inventario -----
    inventory: { es: 'Inventario', en: 'Inventory' },
    inventoryAria: { es: 'Inventario de objetos', en: 'Object inventory' },
    handleAria: { es: 'Mostrar u ocultar el inventario', en: 'Show or hide the inventory' },
    searchLabel: { es: 'Buscar objeto por nombre', en: 'Search objects by name' },
    searchPlaceholder: { es: 'Buscar objeto…', en: 'Search objects…' },
    filters: { es: 'Filtros', en: 'Filters' },
    all: { es: 'Todos', en: 'All' },
    paletteHint: {
      es: 'Arrastra un objeto al altar, o tócalo y luego toca el nivel donde quieres ponerlo. Para devolverlo, arrástralo de vuelta aquí.',
      en: 'Drag an object onto the altar, or tap it and then tap the level where you want it. To return it, drag it back here.',
    },
    noResults: { es: 'No encontramos objetos con ese nombre.', en: 'We couldn’t find any objects with that name.' },
    canvasAria: { es: 'Altar', en: 'Altar' },
    canvasEmpty: { es: 'Arrastra un objeto del inventario hasta un nivel del altar', en: 'Drag an object from the inventory onto a level of the altar' },
    armedText: { es: '{name}: toca el nivel donde quieres ponerlo', en: '{name}: tap the level where you want to place it' },
    armedAuto: { es: 'Nivel sugerido', en: 'Suggested level' },
    cancel: { es: 'Cancelar', en: 'Cancel' },
    close: { es: 'Cerrar', en: 'Close' },
    garlandTile: { es: 'Papel picado {name}', en: '{name} papel picado' },
    garlandTip: { es: 'Papel picado colgante: {name}', en: 'Hanging papel picado: {name}' },
    garlandTipDesc: { es: 'Arrástralo a uno de los tres lugares para colgarlo sobre el altar.', en: 'Drag it to one of the three spots to hang it above the altar.' },
    outOfStock: { es: 'Ya alcanzaste el máximo de este objeto', en: 'You have reached the maximum for this object' },

    // ----- Editor: niveles, manteles -----
    floorFull: { es: 'Lleno', en: 'Full' },
    floorTip: { es: '{level}: clic para ver qué va aquí', en: '{level}: click to see what goes here' },
    floorWhat: { es: 'Qué colocar aquí', en: 'What to place here' },
    cloth: { es: 'Mantel', en: 'Tablecloth' },
    clothOf: { es: 'Mantel de {level}', en: 'Tablecloth of {level}' },
    clothNone: { es: 'Sin mantel', en: 'No tablecloth' },
    clothPlain: { es: 'Color liso', en: 'Solid color' },
    clothBack: { es: '← Manteles', en: '← Tablecloths' },
    clothAll: { es: 'Usar el mantel de este nivel en todos', en: 'Use this level’s tablecloth on all levels' },
    clothAllDone: { es: 'Mantel aplicado a todos los pisos', en: 'Tablecloth applied to all levels' },
    clothAllNone: { es: 'Manteles quitados de todos los pisos', en: 'Tablecloths removed from all levels' },
    removeItem: { es: 'Eliminar {name}', en: 'Remove {name}' },
    removeGarland: { es: 'Quitar papel picado ({name})', en: 'Remove papel picado ({name})' },
    garlandAlready: { es: 'Ya hay papel picado en todos los lugares: arrástralo a uno para reemplazarlo', en: 'Every spot already has papel picado: drag it onto one to replace it' },

    // ----- Editor: avisos -----
    mustGo: { es: '"{name}" debe ir en {where}', en: '“{name}” must go on {where}' },
    whereOne: { es: 'el nivel {n}', en: 'level {n}' },
    whereMany: { es: 'los niveles {n}', en: 'levels {n}' },
    or: { es: ' o ', en: ' or ' },
    levelFull: { es: '{level} está lleno', en: '{level} is full' },
    maxItem: { es: 'Máximo de "{name}" alcanzado ({n})', en: 'Maximum of “{name}” reached ({n})' },
    maxCategory: { es: 'Máximo de {name} alcanzado ({n})', en: 'Maximum of {name} reached ({n})' },
    maxTotal: { es: 'Máximo total de elementos alcanzado ({n})', en: 'Maximum number of items reached ({n})' },
    altarFull: { es: 'El altar está lleno', en: 'The altar is full' },
    returned: { es: 'Devuelto al inventario', en: 'Returned to the inventory' },
    altarReset: { es: 'Altar reiniciado', en: 'Altar reset' },
    saved: { es: 'Altar guardado en este navegador', en: 'Altar saved in this browser' },
    saveFail: { es: 'No se pudo guardar en este navegador', en: 'Could not save in this browser' },
    downloaded: { es: 'Imagen descargada', en: 'Image downloaded' },
    downloadedSvg: { es: 'Se descargó como imagen SVG', en: 'Downloaded as an SVG image' },
    linkCopied: { es: 'Enlace copiado al portapapeles', en: 'Link copied to the clipboard' },
    shareTitle: { es: 'Mi altar de muertos', en: 'My Day of the Dead altar' },
    sharePrompt: { es: 'Copia este enlace para compartir tu altar:', en: 'Copy this link to share your altar:' },
    placedIn: { es: '{name} colocado en el Nivel {n}', en: '{name} placed on Level {n}' },
    memoryOf: { es: 'En memoria de {name}', en: 'In memory of {name}' },

    // ----- Editor: ventanas -----
    resetTitle: { es: '¿Reiniciar el altar?', en: 'Reset the altar?' },
    resetText: {
      es: 'Se quitarán todos los objetos, manteles y papel picado colgante. Podrás deshacerlo con “Deshacer”.',
      en: 'All objects, tablecloths and hanging papel picado will be removed. You can bring them back with “Undo”.',
    },
    resetYes: { es: 'Sí, reiniciar', en: 'Yes, reset' },
    lovedModalTitle: { es: 'Mi ser querido', en: 'My loved one' },
    lovedModalText: {
      es: 'Escribe el nombre y elige una foto. Aparecerán en la imagen del difunto y en las fotografías del altar.',
      en: 'Type their name and choose a photo. They will appear on the portrait and the photographs of the altar.',
    },
    lovedName: { es: 'Nombre', en: 'Name' },
    lovedNamePh: { es: 'Ej. Abuela Lupita', en: 'E.g. Grandma Lupita' },
    lovedPhoto: { es: 'Fotografía', en: 'Photo' },
    lovedChoose: { es: 'Elegir foto', en: 'Choose photo' },
    lovedRemove: { es: 'Quitar foto', en: 'Remove photo' },
    lovedNote: { es: 'La foto se queda solo en tu navegador.', en: 'The photo stays only in your browser.' },
    lovedSave: { es: 'Guardar', en: 'Save' },
    lovedDefault: { es: 'Mi ser querido', en: 'My loved one' },
    lovedDone: { es: 'Altar dedicado a {name}', en: 'Altar dedicated to {name}' },
    lovedUpdated: { es: 'Datos actualizados', en: 'Details updated' },
    lovedTooBig: { es: 'La foto es muy grande para guardarla en este navegador', en: 'The photo is too large to store in this browser' },
    imageReadFail: { es: 'No se pudo leer esa imagen', en: 'That image could not be read' },
    familyUpdated: { es: 'Fotografía familiar actualizada', en: 'Family photo updated' },
    familySaveFail: { es: 'La foto está lista, pero no se pudo guardar en este navegador', en: 'The photo is ready, but it could not be stored in this browser' },
    toastClose: { es: 'Cerrar aviso', en: 'Dismiss message' },

    // ----- Editor: guía de niveles -----
    guideTitle: { es: 'Guía de niveles', en: 'Level guide' },
    guideSub: { es: 'Los siete niveles del altar, de arriba hacia abajo.', en: 'The seven levels of the altar, from top to bottom.' },
    guideClose: { es: 'Cerrar la guía', en: 'Close the guide' },
    levelWord: { es: 'Nivel', en: 'Level' },
    miniAria: { es: 'Nivel {n} de 7 contando desde arriba', en: 'Level {n} of 7 counting from the top' },
    whereLabel: { es: 'Dónde va:', en: 'Where it goes:' },
    whereTop: { es: 'en el nivel más alto del altar', en: 'on the highest level of the altar' },
    whereBase: { es: 'en la base, el nivel más ancho', en: 'on the base, the widest level' },
    whereMid: { es: 'en el {n}.º nivel contando desde arriba', en: 'on level {n} counting from the top' },
    showOnAltar: { es: 'Ver en el altar', en: 'Show on the altar' },
    recommended: { es: 'Objetos recomendados', en: 'Recommended objects' },
    recommendedHint: { es: '(toca uno para ver su significado)', en: '(tap one to see its meaning)' },
    placeOn: { es: 'Colocar en el Nivel {n}', en: 'Place on Level {n}' },
  };

  /* ------------------------------------------------------ catálogo (inglés) */
  // id: [nombre, significado]
  const ITEMS = {
    retrato: ['Portrait of your loved one', 'The heart of the ofrenda: the person being remembered. Their face invites them to come back home. You can add their name and photo with the “My loved one” button.'],
    santo: ['Image of a saint', 'It represents the family’s devotion. Saints are asked to protect and accompany the souls on their journey.'],
    virgen: ['Image of the Virgin', 'The Virgin is placed at the very top as protector of the ofrenda and of those who prepare it.'],
    crucifijo: ['Crucifix', 'A symbol of the Christian faith. It is placed high up to bless the ofrenda.'],
    cruzSal: ['Salt cross', 'Made of salt, it purifies the spirit and helps the soul find rest.'],
    cruzCeniza: ['Ash cross', 'Lime or ash remind us that we are dust; they also help the souls say goodbye in peace.'],
    cruzFlores: ['Flower cross', 'The cross made of marigolds joins faith with the beauty of the flowers of the dead.'],
    arcoFlores: ['Flower arch', 'It is the doorway the souls walk through. Its flowers mark the entrance to the world of the living.'],
    copal: ['Copal', 'An aromatic resin burned in a censer. Its smoke purifies the place and rises to the sky like a prayer.'],
    incienso: ['Incense', 'Its scent perfumes and cleanses the air, and its smoke helps guide the souls to the ofrenda.'],
    sal: ['Salt', 'It symbolizes purification and keeps the body from decaying during the soul’s long journey.'],
    papelFlores: ['Papel picado with flowers', 'Papel picado represents the wind and the fragility of life. Pink celebrates joy.'],
    papelCalavera: ['Papel picado with skull', 'The skull reminds us that death is part of life. Orange evokes fire and the sun.'],
    papelEstrellas: ['Papel picado with stars', 'Stars symbolize the light that guides the souls. Turquoise evokes water.'],
    papelOndas: ['Papel picado with waves', 'The waves imitate the wind that sways the paper. Green stands for earth and life.'],
    vela: ['Candle', 'Each candle is a light for a soul. Its flame lights the way back home.'],
    velaColores: ['Colored candles', 'In some regions the candle colors stand for the cardinal directions or for different departed loved ones.'],
    veladora: ['Votive candle', 'The votive candle in a glass jar keeps its light burning for hours, like a constant prayer.'],
    cirio: ['Pillar candle', 'A large, thick candle offered with devotion; its light lasts all night.'],
    candelabro: ['Candelabrum', 'Several lights together welcome the souls; the number of candles can match the number of loved ones remembered.'],
    farol: ['Lantern', 'A pierced-tin lantern guides travelers and casts stars of light.'],
    farolito: ['Paper lantern', 'A festive decoration that gives soft light and color to the ofrenda.'],
    corona: ['Flower wreath', 'Offered in honor of the departed, like the wreaths taken to the cemetery.'],
    alebrije: ['Alebrije', 'A fantastical, brightly colored figure of Mexican folk art. It accompanies and cheers up the ofrenda.'],
    cempasuchil: ['Marigold bouquet', 'The flower of twenty petals. Its golden color and intense scent guide the souls, like rays of sun.'],
    canastaFlores: ['Marigold basket', 'An abundance of flowers welcomes the souls with generosity.'],
    petalos: ['Marigold petals', 'Scattered over the ofrenda to perfume and decorate it.'],
    caminoPetalos: ['Petal path', 'A trail of petals from the door to the altar shows the souls the way to arrive.'],
    macetaCempasuchil: ['Potted marigolds', 'The living flower symbolizes life that goes on; it can be kept after the celebration.'],
    macetaMixta: ['Potted flowers', 'Flowers of other colors complete the ofrenda and celebrate the variety of life.'],
    terciopelo: ['Velvet flower (cockscomb)', 'The deep red cockscomb represents blood and the love felt for the departed.'],
    nube: ['Baby’s breath', 'Its tiny white flowers symbolize purity and are often offered to children.'],
    ramoMixto: ['Mixed flower bouquet', 'A multicolored bouquet to beautify the ofrenda.'],
    vasoAgua: ['Glass of water', 'It quenches the souls’ thirst after the long journey.'],
    jarraAgua: ['Water pitcher', 'Plenty of water: it represents purity and life.'],
    espejo: ['Mirror', 'It lets the souls freshen up before eating. In some regions it lets them see themselves reflected with love.'],
    jabon: ['Soap', 'So the souls can wash up after walking so far.'],
    toalla: ['Towel', 'To dry their hands and face after washing, before the meal.'],
    panClasico: ['Classic pan de muerto', 'Its dome shape represents the grave; the bone-shaped strips, the departed; and the little ball, the skull or the heart.'],
    panAzucar: ['Pan de muerto with sugar', 'The pink sugar coating makes it more festive; it is one of the most popular variations.'],
    panYema: ['Pan de yema', 'Golden egg-yolk bread with sesame seeds, typical of Oaxaca and other regions.'],
    panAnima: ['Pan de ánima', 'Bread shaped like a person; it represents the soul visiting the ofrenda.'],
    tamales: ['Tamales', 'Corn dough wrapped in leaves; one of the most beloved dishes on ofrendas.'],
    mole: ['Mole', 'A festive dish prepared with care. It is offered to welcome the souls properly.'],
    platillo: ['Mexican dish', 'Traditional Mexican antojitos accompany the rest of the food.'],
    comidaFavorita: ['Favorite food', 'The departed’s favorite dish: the most loving way of saying “we remember you”.'],
    calabaza: ['Candied pumpkin', 'A seasonal sweet cooked with piloncillo and cinnamon.'],
    dulces: ['Traditional sweets', 'Alegrías, cocadas, camotes and other treats sweeten the visit; they are children’s favorites.'],
    frutaCanasta: ['Assorted fruit', 'Seasonal fruits represent the harvest and abundance.'],
    mandarinas: ['Mandarins', 'Seasonal fruit; its colors and scents brighten the ofrenda.'],
    naranjas: ['Oranges', 'A sweet fruit of the season; its color evokes the sun and the marigold.'],
    platanos: ['Bananas', 'A nutritious tropical fruit, common on ofrendas in many regions.'],
    manzanas: ['Apples', 'An autumn fruit that represents the sweetness of memories.'],
    cafe: ['Coffee', 'For those who loved a good cup of coffee in the morning.'],
    chocolate: ['Hot chocolate', 'A traditional Mexican drink, thick and frothy, made with cacao.'],
    atole: ['Atole', 'A hot corn drink; comforting and one of the oldest in Mexico.'],
    refrescoCola: ['Cola soda', 'Many people’s favorite drink; it is offered the way the departed used to enjoy it.'],
    refrescoNaranja: ['Orange soda', 'A sweet, fizzy drink, much loved by little ones.'],
    aguaFresca: ['Hibiscus agua fresca', 'A traditional Mexican drink that refreshes during the celebration.'],
    pulque: ['Pulque', 'An ancestral agave drink, part of the tradition since pre-Hispanic times.'],
    tequila: ['Bottle of tequila', 'Shown as a decoration for those who enjoyed a toast; it is not meant to be drunk.'],
    mezcal: ['Bottle of mezcal', 'A traditional spirit that, if the departed appreciated it, is offered as an ornament of the ofrenda.'],
    cerveza: ['Bottle of beer', 'A symbolic toast for those who enjoyed sharing a beer.'],
    fotoDifunto: ['Photo of your loved one', 'More photos of your loved one at different stages of life. It uses the photo you uploaded in “My loved one”.'],
    fotoGrande: ['Large photo of your loved one', 'A larger photograph of your loved one, to preside over the ofrenda. It uses the name and photo you uploaded in “My loved one”.'],
    fotoFamilia: ['Family photo', 'A family photo is a reminder that the departed is still part of the family.'],
    calavera: ['Decorated skull', 'The skull with flowers celebrates death with joy; it is a symbol of the Day of the Dead.'],
    calaveritaRosa: ['Pink sugar skull', 'Sugar skulls carry the name of the person being remembered.'],
    calaveritaTurquesa: ['Turquoise sugar skull', 'Sweet and cheerful: a reminder that life and death go hand in hand.'],
    calaveritaAmarilla: ['Yellow sugar skull', 'Its golden color evokes the marigold.'],
    xolo: ['Xoloitzcuintle dog', 'According to tradition, the xoloitzcuintle accompanies the souls across the river to Mictlán.'],
    guitarra: ['Guitar', 'For those who filled the house with music. Songs are memories too.'],
    violin: ['Violin', 'A musical instrument to remember someone who loved to play.'],
    trompeta: ['Trumpet', 'For a band or mariachi musician; may their music keep on playing.'],
    maracas: ['Maracas', 'A festive instrument that recalls the parties shared together.'],
    sombrero: ['Hat', 'A cherished piece of clothing of the departed; it evokes their presence and style.'],
    reloj: ['Pocket watch', 'It recalls the time shared and that, for one night, time stands still for the reunion.'],
    libros: ['Books', 'For those who loved to read or learn; their favorite reads.'],
    osito: ['Teddy bear', 'A toy for departed children (the “angelitos”), who arrive first.'],
    trompo: ['Spinning top', 'A traditional Mexican toy; it is offered to remembered children.'],
    camisa: ['Shirt', 'Clothes the departed used to wear: it makes them feel closer.'],
    vestido: ['Dress', 'A garment of the person remembered, in the colors they liked.'],
    rebozo: ['Rebozo', 'A traditional shawl that warms and embraces; it recalls a grandmother, mother or aunt.'],
    balon: ['Ball', 'For those who loved sports; a hobby offered with affection.'],
    herramientas: ['Work tools', 'They represent the person’s work and trade.'],
    paletaPintor: ['Painter’s palette', 'For those who painted or loved art.'],
    loteria: ['Lotería', 'A family game as old as time; it recalls afternoons of laughter and cards.'],
  };

  /* ------------------------------------------------------- niveles (inglés) */
  // Índice 0 = nivel de abajo (Nivel 7) … 6 = nivel de arriba (Nivel 1).
  const FLOORS = [
    { title: 'Base and keepsakes', short: 'What the person loved and what remembers them',
      description: 'The base holds everything else. Here go personal belongings, additional photographs, skulls and toys: what the departed used, wanted and enjoyed in life.' },
    { title: 'Food and drinks', short: 'The banquet to welcome the souls',
      description: 'The journey back makes them hungry and thirsty. Pan de muerto, fruit, dishes and the departed’s favorite drinks are offered so the souls regain their strength.' },
    { title: 'Flowers and offerings', short: 'Color and scent that guide the way',
      description: 'Marigolds, their petals and papel picado adorn the ofrenda. The color and scent of the flowers guide the souls from the cemetery to their home.' },
    { title: 'Light and path', short: 'The light that shows the way back',
      description: 'Candles, votives and pillar candles light the souls’ path; copal and incense perfume and purify the air so they arrive without getting lost.' },
    { title: 'Purification', short: 'Salt, water and cleansing for the soul',
      description: 'Salt purifies and keeps the body from decaying; water quenches the thirst of the journey; the mirror, soap and towel let them freshen up before eating.' },
    { title: 'Religious symbols', short: 'The souls in purgatory and faith',
      description: 'Dedicated to the souls in purgatory, the ones nobody remembers, and to other religious symbols such as crosses of salt, ash or flowers.' },
    { title: 'The summit', short: 'The image of the loved one and the divine',
      description: 'The highest point of the ofrenda. Here go the portrait of the departed and, according to the family’s tradition, religious images such as a saint, the Virgin or a crucifix.' },
  ];

  const CATEGORIES = {
    religiosos: 'Religious', iluminacion: 'Lighting', flores: 'Flowers', purificacion: 'Water & cleansing',
    alimentos: 'Food', bebidas: 'Drinks', recuerdos: 'Keepsakes', 'papel-picado': 'Papel picado',
  };

  const CLOTHS = {
    liso: 'Pink', lisoAzul: 'Blue', lisoVerde: 'Green', lisoAmarillo: 'Yellow', lisoMorado: 'Purple',
    lisoRojo: 'Red', lisoNegro: 'Black', rayas: 'Stripes', ondas: 'Scallops', picado: 'Papel picado',
    bordado: 'Embroidery', sarape: 'Sarape',
  };

  const GARLANDS = { clasico: 'Classic', banderines: 'Pennants', ondas: 'Waves', calado: 'Stars' };
  const SPOTS = { izquierda: 'Left', centro: 'Center', derecha: 'Right' };

  /* --------------------------------------------------------------- núcleo */
  const t = (key, vars) => {
    const e = UI[key];
    let s = e ? (e[lang] ?? e.es) : key;
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
    return s;
  };

  // Reemplaza una propiedad de texto por un getter que depende del idioma.
  function localize(obj, prop, enValue) {
    const es = obj[prop];
    Object.defineProperty(obj, prop, {
      configurable: true, enumerable: true,
      get: () => (lang !== 'es' && enValue != null ? enValue : es),
    });
  }

  function localizeConfig(CFG) {
    CFG.catalog.forEach((e) => {
      const tr = ITEMS[e.id];
      localize(e, 'name', tr && tr[0]);
      localize(e, 'info', tr && tr[1]);
    });
    CFG.floors.forEach((f, i) => {
      const tr = FLOORS[i];
      const esLabel = f.label;
      Object.defineProperty(f, 'label', { configurable: true, enumerable: true, get: () => (lang === 'es' ? esLabel : esLabel.replace('Nivel', t('levelWord'))) });
      localize(f, 'title', tr.title);
      localize(f, 'short', tr.short);
      localize(f, 'description', tr.description);
      // Objetos sugeridos: salen del catálogo (ya traducido).
      const nivel = 7 - i;
      Object.defineProperty(f, 'suggested', {
        configurable: true, enumerable: true,
        get: () => CFG.catalog.filter((e) => e.niveles[0] === nivel).slice(0, 6).map((e) => e.name),
      });
    });
    CFG.categories.forEach((c) => localize(c, 'name', CATEGORIES[c.id]));
    CFG.tablecloths.forEach((c) => localize(c, 'name', CLOTHS[c.id]));
    CFG.garlands.forEach((g) => localize(g, 'name', GARLANDS[g.id]));
    CFG.garlandSpots.forEach((s) => localize(s, 'name', SPOTS[s.id]));
  }

  /* ------------------------------------------- textos fijos de los HTML */
  // data-i18n="clave"                       → textContent
  // data-i18n-attr="atributo:clave;..."     → atributos (placeholder, title, aria-label…)
  function applyStatic(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.setAttribute('aria-pressed', on);
      b.classList.toggle('is-on', on);
    });
    const titleKey = document.body && document.body.dataset.titleKey;
    if (titleKey) document.title = t(titleKey);
    const desc = document.querySelector('meta[name="description"]');
    if (desc && document.body.dataset.descKey) desc.setAttribute('content', t(document.body.dataset.descKey));
  }

  /* ---------------------------------------------------------- cambio de idioma */
  const listeners = [];
  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch { /* sin almacenamiento */ }
    applyStatic();
    listeners.forEach((fn) => fn(lang));
  }
  const onChange = (fn) => listeners.push(fn);

  // Los botones .lang-switch funcionan solos en cualquier página.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.lang-switch [data-lang]');
    if (b) setLang(b.dataset.lang);
  });

  return { t, get lang() { return lang; }, setLang, onChange, applyStatic, localizeConfig, LANGS };
})();
