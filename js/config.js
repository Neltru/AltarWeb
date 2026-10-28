/* =========================================================================
 * CONFIGURACIÓN CENTRAL DEL ALTAR
 * -------------------------------------------------------------------------
 * Todo lo que se puede ajustar está en este archivo:
 *   1. Tamaño del lienzo
 *   2. Los 7 niveles (tamaño, posición, colores y texto de la guía)
 *   3. Límites de elementos
 *   4. Espacios de cada nivel
 *   5. Categorías (filtros) del inventario
 *   6. Catálogo de objetos (con su significado y nivel recomendado)
 *   7. Manteles
 *   8. Papel picado colgante
 *
 * La lógica (altar-core.js, altar-stage.js, editor.js) lee estos valores y no
 * hace falta modificarla para agregar objetos o cambiar textos.
 * ========================================================================= */
window.ALTAR_CONFIG = (function (PH) {

  /* -----------------------------------------------------------------------
   * 1. LIENZO (unidades lógicas; en pantalla se escala solo)
   * --------------------------------------------------------------------- */
  const stage = { width: 1000, height: 880 };

  /* -----------------------------------------------------------------------
   * 2. LOS 7 NIVELES
   * Índice 0 = nivel de ABAJO (Nivel 7) … índice 6 = nivel de ARRIBA (Nivel 1).
   *   width/height/bottom → geometría del escalón
   *   pal   → colores del nivel (a: arriba, b: abajo, trim y trim2: adornos)
   *   label → "Nivel N"            title → nombre del nivel
   *   short → frase breve          description → qué representa y por qué
   * La lista de objetos recomendados sale de `niveles` en el catálogo (sección 6).
   * --------------------------------------------------------------------- */
  const H = 90;
  const floors = [
    { width: 960, height: H, bottom: 28 + 0 * H, label: 'Nivel 7', title: 'Base y recuerdos',
      short: 'Lo que la persona amó y lo que la recuerda',
      description: 'La base del altar sostiene todo lo demás. Aquí van los objetos personales, las fotografías adicionales, las calaveras y los juguetes: lo que el difunto usó, quiso y disfrutó en vida.',
      pal: { a: '#5b8cff', b: '#2646b8', trim: '#ffd23f', trim2: '#ff7ad1' } },
    { width: 850, height: H, bottom: 28 + 1 * H, label: 'Nivel 6', title: 'Alimentos y bebidas',
      short: 'El banquete para recibir a las almas',
      description: 'El viaje de regreso da hambre y sed. Se ofrecen el pan de muerto, la fruta, los platillos y las bebidas favoritas del difunto para que las almas recuperen fuerzas.',
      pal: { a: '#5fdc72', b: '#1d8f45', trim: '#ffe066', trim2: '#ff7a1a' } },
    { width: 740, height: H, bottom: 28 + 2 * H, label: 'Nivel 5', title: 'Flores y ofrendas',
      short: 'Color y aroma que guían el camino',
      description: 'El cempasúchil, sus pétalos y el papel picado adornan la ofrenda. El color y el aroma de las flores guían a las almas desde el cementerio hasta su casa.',
      pal: { a: '#ff5fb0', b: '#c2105f', trim: '#ffd23f', trim2: '#2fe0d0' } },
    { width: 630, height: H, bottom: 28 + 3 * H, label: 'Nivel 4', title: 'Luz y camino',
      short: 'La luz que alumbra el regreso',
      description: 'Velas, veladoras y cirios iluminan el camino de las almas; el copal y el incienso perfuman y purifican el ambiente para que lleguen sin perderse.',
      pal: { a: '#ffa83a', b: '#e8560a', trim: '#fff0a0', trim2: '#a56bff' } },
    { width: 520, height: H, bottom: 28 + 4 * H, label: 'Nivel 3', title: 'Purificación',
      short: 'Sal, agua y limpieza para el alma',
      description: 'La sal purifica y evita que el cuerpo se corrompa; el agua calma la sed del viaje; el espejo, el jabón y la toalla permiten asearse antes de comer.',
      pal: { a: '#3fe6e0', b: '#0b8f9a', trim: '#ffe066', trim2: '#ff4f9a' } },
    { width: 410, height: H, bottom: 28 + 5 * H, label: 'Nivel 2', title: 'Símbolos religiosos',
      short: 'Las ánimas del purgatorio y la fe',
      description: 'Se dedica a las ánimas del purgatorio, las almas que nadie recuerda, y a otros símbolos religiosos como cruces de sal, ceniza o flores.',
      pal: { a: '#b27bff', b: '#5b22b8', trim: '#ffd23f', trim2: '#2fe0d0' } },
    { width: 300, height: H, bottom: 28 + 6 * H, label: 'Nivel 1', title: 'Cúspide',
      short: 'La imagen del ser querido y lo divino',
      description: 'El punto más alto de la ofrenda. Aquí se coloca la imagen del difunto y, según la tradición de la familia, imágenes religiosas como un santo, la Virgen o un crucifijo.',
      pal: { a: '#ffe066', b: '#f5a300', trim: '#ff4f9a', trim2: '#a56bff' } },
  ];

  /* -----------------------------------------------------------------------
   * 3. LÍMITES (null o sin clave = sin límite)
   * --------------------------------------------------------------------- */
  const limits = {
    // También es el NÚMERO DE ESPACIOS de cada nivel (abajo → arriba).
    perFloor: [9, 8, 7, 6, 5, 4, 3],
    perCategory: {},
    perItem: { retrato: 1 },
    total: null,
  };

  /* -----------------------------------------------------------------------
   * 4. ESPACIOS DE CADA NIVEL
   * --------------------------------------------------------------------- */
  const layout = {
    padding: 16,
    slotGap: 6,
    flagHeight: 56,  // alto de cada banderita del papel picado colgante
    flagWidth: 0.8,
  };

  /* -----------------------------------------------------------------------
   * 5. CATEGORÍAS (filtros del inventario)
   * --------------------------------------------------------------------- */
  const categories = [
    { id: 'religiosos',   name: 'Religiosos' },
    { id: 'iluminacion',  name: 'Iluminación' },
    { id: 'flores',       name: 'Flores' },
    { id: 'purificacion', name: 'Agua y limpieza' },
    { id: 'alimentos',    name: 'Alimentos' },
    { id: 'bebidas',      name: 'Bebidas' },
    { id: 'recuerdos',    name: 'Recuerdos' },
    // `source: 'garlands'` → muestra los tipos de papel picado colgante (sección 8).
    { id: 'papel-picado', name: 'Papel picado', source: 'garlands' },
  ];

  /* -----------------------------------------------------------------------
   * 6. CATÁLOGO DE OBJETOS
   * I(id, nombre, categoría, dibujo, alto, niveles, significado)
   *   alto     → alto en el lienzo (el ancho sale de la proporción del dibujo)
   *   niveles  → niveles recomendados (1 = arriba … 7 = base)
   * Para usar una imagen propia: agrega { image: 'ruta.png', width, height }
   * en lugar de `render`.
   * --------------------------------------------------------------------- */
  const ratio = (fn) => {
    const m = /viewBox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(fn({}));
    return m ? m[3] / m[4] : 1;
  };
  const I = (id, name, category, render, h, niveles, info, extra = {}) =>
    ({ id, name, category, render, height: h, width: Math.round(h * ratio(render)), niveles, info, ...extra });

  const catalog = [
    /* ---- Religiosos y tradicionales ---- */
    I('retrato', 'Imagen del difunto', 'religiosos', PH.retrato, 92, [1],
      'Es el centro de la ofrenda: la persona a quien se recuerda. Su rostro la invita a regresar a casa. Puedes poner su nombre y su foto con el botón “Mi ser querido”.', { dynamic: true }),
    I('santo', 'Imagen de un santo', 'religiosos', PH.santo, 86, [1, 2],
      'Representa la devoción de la familia. Se pide a los santos que protejan y acompañen el viaje de las almas.'),
    I('virgen', 'Imagen de la Virgen', 'religiosos', PH.virgen, 86, [1],
      'La Virgen se coloca en lo más alto como protectora de la ofrenda y de quienes la preparan.'),
    I('crucifijo', 'Crucifijo', 'religiosos', PH.crucifijo, 80, [1, 2],
      'Símbolo de la fe cristiana. Se coloca en lo alto para bendecir la ofrenda.'),
    I('cruzSal', 'Cruz de sal', 'religiosos', PH.cruzSal, 78, [3, 2],
      'Hecha con sal, purifica el espíritu y ayuda a que el alma encuentre descanso.'),
    I('cruzCeniza', 'Cruz de ceniza', 'religiosos', PH.cruzCeniza, 78, [3, 2],
      'La cal o la ceniza recuerdan que somos polvo; también ayudan a que las ánimas se despidan en paz.'),
    I('cruzFlores', 'Cruz de flores', 'religiosos', PH.cruzFlores, 78, [2, 5],
      'La cruz hecha con cempasúchil une la fe con la belleza de las flores de muertos.'),
    I('arcoFlores', 'Arco de flores', 'religiosos', PH.arcoFlores, 96, [5, 7],
      'Es la puerta por la que cruzan las almas. Sus flores marcan la entrada al mundo de los vivos.'),
    I('copal', 'Copal', 'religiosos', PH.copal, 74, [4],
      'Resina aromática que se quema en un sahumerio. Su humo purifica el lugar y sube hasta el cielo como una oración.'),
    I('incienso', 'Incienso', 'religiosos', PH.incienso, 76, [4],
      'Su aroma perfuma y limpia el ambiente, y su humo ayuda a guiar a las almas hasta la ofrenda.'),
    I('sal', 'Sal', 'religiosos', PH.sal, 50, [3],
      'Simboliza la purificación y evita que el cuerpo se corrompa en el largo viaje del alma.'),
    I('papelFlores', 'Papel picado de flores', 'religiosos', PH.papelFlores, 78, [5],
      'El papel picado representa el aire y la fragilidad de la vida. El rosa celebra la alegría.'),
    I('papelCalavera', 'Papel picado de calavera', 'religiosos', PH.papelCalavera, 78, [5],
      'La calavera recuerda que la muerte forma parte de la vida. El naranja evoca el fuego y el sol.'),
    I('papelEstrellas', 'Papel picado de estrellas', 'religiosos', PH.papelEstrellas, 78, [5],
      'Las estrellas simbolizan la luz que guía a las almas. El turquesa evoca el agua.'),
    I('papelOndas', 'Papel picado de ondas', 'religiosos', PH.papelOndas, 78, [5],
      'Las ondas imitan el movimiento del viento que mece el papel. El verde representa la tierra y la vida.'),

    /* ---- Iluminación y decoración ---- */
    I('vela', 'Vela', 'iluminacion', PH.vela, 76, [4],
      'Cada vela es una luz para un alma. Su llama alumbra el camino de regreso a casa.'),
    I('velaColores', 'Velas de colores', 'iluminacion', PH.velaColores, 76, [4],
      'En algunas regiones los colores de las velas representan los puntos cardinales o a distintos difuntos.'),
    I('veladora', 'Veladora', 'iluminacion', PH.veladora, 66, [4],
      'La veladora en vaso de vidrio mantiene la luz encendida durante horas, como una oración constante.'),
    I('cirio', 'Cirio', 'iluminacion', PH.cirio, 92, [4, 1],
      'Es la vela grande y gruesa que se ofrece con devoción; su luz dura toda la noche.'),
    I('candelabro', 'Candelabro', 'iluminacion', PH.candelabro, 82, [4],
      'Varias luces juntas dan la bienvenida a las almas; el número de velas puede ser el de los difuntos recordados.'),
    I('farol', 'Farol', 'iluminacion', PH.farol, 86, [4],
      'Un farol de hojalata con calados guía a los viajeros y proyecta estrellas de luz.'),
    I('farolito', 'Farolito de papel', 'iluminacion', PH.farolito, 86, [4, 5],
      'Adorno festivo que da luz suave y color a la ofrenda.'),
    I('corona', 'Corona de flores', 'iluminacion', PH.corona, 72, [5],
      'Se ofrece en honor del difunto, como las coronas que se llevan al panteón.'),
    I('alebrije', 'Alebrije', 'iluminacion', PH.alebrije, 62, [5, 7],
      'Figura fantástica de colores del arte popular mexicano. Acompaña y alegra la ofrenda.'),

    /* ---- Flores ---- */
    I('cempasuchil', 'Ramo de cempasúchil', 'flores', PH.cempasuchil, 86, [5],
      'La flor de veinte pétalos. Su color dorado y su aroma intenso guían a las almas, como si fueran rayos de sol.'),
    I('canastaFlores', 'Canasta de cempasúchil', 'flores', PH.canastaFlores, 68, [5, 7],
      'La abundancia de flores da la bienvenida con generosidad.'),
    I('petalos', 'Pétalos de cempasúchil', 'flores', PH.petalos, 46, [5],
      'Se esparcen sobre la ofrenda para perfumarla y adornarla.'),
    I('caminoPetalos', 'Camino de pétalos', 'flores', PH.caminoPetalos, 44, [5, 7],
      'Un sendero de pétalos desde la puerta hasta el altar muestra a las almas por dónde llegar.'),
    I('macetaCempasuchil', 'Maceta con cempasúchil', 'flores', PH.macetaCempasuchil, 84, [5],
      'La flor viva simboliza la vida que continúa; se puede conservar después de la fiesta.'),
    I('macetaMixta', 'Maceta con flores', 'flores', PH.macetaMixta, 84, [5],
      'Flores de otros colores completan la ofrenda y celebran la variedad de la vida.'),
    I('terciopelo', 'Flor de terciopelo', 'flores', PH.terciopelo, 86, [5],
      'La cresta de gallo, de rojo profundo, representa la sangre y el cariño por el difunto.'),
    I('nube', 'Flor de nube', 'flores', PH.nube, 86, [5],
      'Sus florecitas blancas simbolizan la pureza y suelen ofrecerse a los niños.'),
    I('ramoMixto', 'Ramo de flores mixtas', 'flores', PH.ramoMixto, 86, [5],
      'Un ramo de varios colores para embellecer la ofrenda.'),

    /* ---- Agua y limpieza ---- */
    I('vasoAgua', 'Vaso de agua', 'purificacion', PH.vasoAgua, 62, [3, 6],
      'Calma la sed de las almas después del largo viaje.'),
    I('jarraAgua', 'Jarra de agua', 'purificacion', PH.jarraAgua, 70, [3, 6],
      'Agua abundante: representa la pureza y la vida.'),
    I('espejo', 'Espejo', 'purificacion', PH.espejo, 82, [3],
      'Permite a las almas arreglarse antes de comer. En algunas regiones sirve para que se vean reflejadas con cariño.'),
    I('jabon', 'Jabón', 'purificacion', PH.jabon, 46, [3],
      'Para que las almas se aseen después de caminar tanto.'),
    I('toalla', 'Toalla', 'purificacion', PH.toalla, 48, [3],
      'Para secarse tras lavarse las manos y el rostro antes de la comida.'),

    /* ---- Alimentos ---- */
    I('panClasico', 'Pan de muerto clásico', 'alimentos', PH.panClasico, 54, [6],
      'Su forma de domo representa la tumba; los huesitos, a los difuntos; y la bolita, el cráneo o el corazón.'),
    I('panAzucar', 'Pan de muerto con azúcar', 'alimentos', PH.panAzucar, 54, [6],
      'La capa de azúcar rosa lo vuelve más festivo; es una de las variantes más populares.'),
    I('panYema', 'Pan de yema', 'alimentos', PH.panYema, 54, [6],
      'Pan de masa dorada con ajonjolí, típico de Oaxaca y otras regiones.'),
    I('panAnima', 'Pan de ánima', 'alimentos', PH.panAnima, 70, [6],
      'Pan con forma de persona; representa al alma que visita la ofrenda.'),
    I('tamales', 'Tamales', 'alimentos', PH.tamales, 56, [6],
      'Alimento de maíz envuelto en hoja; es de los platillos más queridos de las ofrendas.'),
    I('mole', 'Mole', 'alimentos', PH.mole, 58, [6],
      'Platillo de fiesta, preparado con esmero. Se ofrece para recibir bien a las almas.'),
    I('platillo', 'Platillo mexicano', 'alimentos', PH.platillo, 54, [6],
      'Los antojitos tradicionales mexicanos acompañan al resto de la comida.'),
    I('comidaFavorita', 'Comida favorita', 'alimentos', PH.comidaFavorita, 60, [6],
      'El platillo preferido del difunto: es la forma más cariñosa de decirle “te recordamos”.'),
    I('calabaza', 'Calabaza en dulce', 'alimentos', PH.calabaza, 56, [6],
      'Dulce de temporada cocido con piloncillo y canela.'),
    I('dulces', 'Dulces tradicionales', 'alimentos', PH.dulces, 54, [6],
      'Alegrías, cocadas, camotes y otros dulces endulzan la visita; son los favoritos de los niños.'),
    I('frutaCanasta', 'Frutas variadas', 'alimentos', PH.frutaCanasta, 72, [6],
      'Las frutas de temporada representan la cosecha y la abundancia.'),
    I('mandarinas', 'Mandarinas', 'alimentos', PH.mandarinas, 52, [6],
      'Frutas de temporada; sus colores y aromas alegran la ofrenda.'),
    I('naranjas', 'Naranjas', 'alimentos', PH.naranjas, 58, [6],
      'Fruta dulce de la época; su color evoca el sol y el cempasúchil.'),
    I('platanos', 'Plátanos', 'alimentos', PH.platanos, 56, [6],
      'Fruta tropical y nutritiva, común en las ofrendas de distintas regiones.'),
    I('manzanas', 'Manzanas', 'alimentos', PH.manzanas, 56, [6],
      'Fruta de otoño que representa la dulzura de los recuerdos.'),

    /* ---- Bebidas ---- */
    I('cafe', 'Café', 'bebidas', PH.cafe, 64, [6],
      'Para quien disfrutaba de un buen café por la mañana.'),
    I('chocolate', 'Chocolate caliente', 'bebidas', PH.chocolate, 64, [6],
      'Bebida tradicional mexicana, espesa y espumosa, hecha con cacao.'),
    I('atole', 'Atole', 'bebidas', PH.atole, 64, [6],
      'Bebida caliente de maíz; reconforta y es de las más antiguas de México.'),
    I('refrescoCola', 'Refresco de cola', 'bebidas', PH.refrescoCola, 72, [6],
      'La bebida favorita de muchos; se ofrece como la tomaba el difunto.'),
    I('refrescoNaranja', 'Refresco de naranja', 'bebidas', PH.refrescoNaranja, 72, [6],
      'Una bebida dulce y burbujeante, muy querida por los pequeños.'),
    I('aguaFresca', 'Agua fresca de jamaica', 'bebidas', PH.aguaFresca, 76, [6],
      'Bebida tradicional mexicana que refresca durante la fiesta.'),
    I('pulque', 'Pulque', 'bebidas', PH.pulque, 62, [6],
      'Bebida ancestral de maguey, parte de la tradición desde la época prehispánica.'),
    I('tequila', 'Botella de tequila', 'bebidas', PH.tequila, 74, [6],
      'Se representa de forma decorativa para quien disfrutaba un brindis; no es para consumirse.'),
    I('mezcal', 'Botella de mezcal', 'bebidas', PH.mezcal, 74, [6],
      'Bebida tradicional que, si el difunto la apreciaba, se ofrece como adorno de la ofrenda.'),
    I('cerveza', 'Botella de cerveza', 'bebidas', PH.cerveza, 76, [6],
      'Un brindis simbólico por quien disfrutaba compartir una cerveza.'),

    /* ---- Recuerdos y objetos personales ---- */
    I('fotoDifunto', 'Fotografía del difunto', 'recuerdos', PH.fotoDifunto, 76, [7, 1],
      'Más fotos del ser querido en distintas etapas de su vida. Usa la foto que cargaste en “Mi ser querido”.', { dynamic: true }),
    I('fotoGrande', 'Fotografía grande del difunto', 'recuerdos', PH.fotoGrande, 118, [7, 1],
      'Una fotografía de mayor tamaño del ser querido, para que presida la ofrenda. Usa el nombre y la foto que cargaste en “Mi ser querido”.', { dynamic: true }),
    I('fotoFamilia', 'Fotografía familiar', 'recuerdos', PH.fotoFamilia, 76, [7],
      'Una foto familiar recuerda que el difunto sigue formando parte de la familia.', { dynamic: true }),
    I('calavera', 'Calavera decorada', 'recuerdos', PH.calavera, 72, [7],
      'La calavera con flores celebra la muerte con alegría; es un símbolo del Día de Muertos.'),
    I('calaveritaRosa', 'Calaverita de azúcar rosa', 'recuerdos', PH.calaveritaRosa, 64, [7],
      'Las calaveritas de azúcar llevan el nombre de la persona recordada.'),
    I('calaveritaTurquesa', 'Calaverita de azúcar turquesa', 'recuerdos', PH.calaveritaTurquesa, 64, [7],
      'Dulce y alegre: recuerda que la vida y la muerte van de la mano.'),
    I('calaveritaAmarilla', 'Calaverita de azúcar amarilla', 'recuerdos', PH.calaveritaAmarilla, 64, [7],
      'Su color dorado evoca el cempasúchil.'),
    I('xolo', 'Perrito xoloitzcuintle', 'recuerdos', PH.xolo, 68, [7],
      'Según la tradición, el xoloitzcuintle acompaña a las almas para cruzar el río hacia el Mictlán.'),
    I('guitarra', 'Guitarra', 'recuerdos', PH.guitarra, 88, [7],
      'Para quien llenaba la casa de música. Las canciones también son un recuerdo.'),
    I('violin', 'Violín', 'recuerdos', PH.violin, 88, [7],
      'Un instrumento musical para recordar a quien amaba tocar.'),
    I('trompeta', 'Trompeta', 'recuerdos', PH.trompeta, 52, [7],
      'Para un músico de banda o de mariachi; que su música siga sonando.'),
    I('maracas', 'Maracas', 'recuerdos', PH.maracas, 72, [7],
      'Instrumento festivo que recuerda las fiestas compartidas.'),
    I('sombrero', 'Sombrero', 'recuerdos', PH.sombrero, 54, [7],
      'Prenda querida del difunto; evoca su presencia y su estilo.'),
    I('reloj', 'Reloj de bolsillo', 'recuerdos', PH.reloj, 78, [7],
      'Recuerda el tiempo compartido y que, por una noche, el tiempo se detiene para el reencuentro.'),
    I('libros', 'Libros', 'recuerdos', PH.libros, 62, [7],
      'Para quien amaba leer o aprender; sus lecturas favoritas.'),
    I('osito', 'Osito de peluche', 'recuerdos', PH.osito, 68, [7],
      'Un juguete para los niños difuntos (los “angelitos”), que llegan primero.'),
    I('trompo', 'Trompo', 'recuerdos', PH.trompo, 72, [7],
      'Juguete tradicional mexicano; se ofrece a los niños que se recuerdan.'),
    I('camisa', 'Camisa', 'recuerdos', PH.camisa, 68, [7],
      'Ropa que el difunto solía usar: así se siente más cerca.'),
    I('vestido', 'Vestido', 'recuerdos', PH.vestido, 80, [7],
      'Una prenda de la persona recordada, con los colores que le gustaban.'),
    I('rebozo', 'Rebozo', 'recuerdos', PH.rebozo, 54, [7],
      'Prenda tradicional que abriga y abraza; recuerda a la abuela, la madre o la tía.'),
    I('balon', 'Balón', 'recuerdos', PH.balon, 60, [7],
      'Para quien amaba el deporte; es una afición que se ofrenda con cariño.'),
    I('herramientas', 'Herramientas de trabajo', 'recuerdos', PH.herramientas, 68, [7],
      'Representan el trabajo y el oficio de la persona.'),
    I('paletaPintor', 'Paleta de pintor', 'recuerdos', PH.paletaPintor, 60, [7],
      'Para quien pintaba o amaba el arte.'),
    I('loteria', 'Lotería', 'recuerdos', PH.loteria, 70, [7],
      'Juego familiar de siempre; recuerda las tardes de risas y cartas.'),
  ];

  /* -----------------------------------------------------------------------
   * 7. MANTELES (el botón de mantel de cada nivel abre este selector)
   * --------------------------------------------------------------------- */
  const plainCloth = (color) => (w, h) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="ph"><rect class="o" x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="${color}"/><rect x="5" y="${h - 12}" width="${w - 10}" height="4" rx="2" fill="#fff" opacity=".45"/></svg>`;

  const tablecloths = [
    { id: 'liso',       name: 'Rosa',      render: PH.clothPlain },
    { id: 'lisoAzul',   name: 'Azul',      render: plainCloth('#398bd4') },
    { id: 'lisoVerde',  name: 'Verde',     render: plainCloth('#35a866') },
    { id: 'lisoAmarillo', name: 'Amarillo', render: plainCloth('#f2c230') },
    { id: 'lisoMorado', name: 'Morado',    render: plainCloth('#8050bb') },
    { id: 'lisoRojo',   name: 'Rojo',      render: plainCloth('#d94a4a') },
    { id: 'lisoNegro',  name: 'Negro',     render: plainCloth('#25212a') },
    { id: 'rayas',   name: 'Franjas',      render: PH.clothStripes },
    { id: 'ondas',   name: 'Ondas',        render: PH.clothScallop },
    { id: 'picado',  name: 'Papel picado', render: PH.clothPicado },
    { id: 'bordado', name: 'Bordado',      render: PH.clothBordado },
    { id: 'sarape',  name: 'Sarape',       render: PH.clothSarape },
  ];

  /* -----------------------------------------------------------------------
   * 8. PAPEL PICADO COLGANTE (no ocupa espacios de los niveles)
   * --------------------------------------------------------------------- */
  const garlands = [
    { id: 'clasico',    name: 'Clásico',    flag: PH.flagClassic },
    { id: 'banderines', name: 'Banderines', flag: PH.flagTriangle },
    { id: 'ondas',      name: 'Ondas',      flag: PH.flagScallop },
    { id: 'calado',     name: 'Estrellas',  flag: PH.flagCalado },
  ];

  const garlandSpots = [
    { id: 'izquierda', name: 'Izquierda', from: [4, 215],   to: [336, 64],  sag: 26, flags: 6 },
    { id: 'centro',    name: 'Centro',    from: [352, 30],  to: [648, 30],  sag: 26, flags: 5 },
    { id: 'derecha',   name: 'Derecha',   from: [664, 64],  to: [996, 215], sag: 26, flags: 6 },
  ];

  /* ---- Textos que se derivan del catálogo (no editar) ---- */
  floors.forEach((f, i) => {
    const nivel = 7 - i;
    f.suggested = catalog.filter((e) => e.niveles[0] === nivel).slice(0, 6).map((e) => e.name);
  });

  const CFG = { stage, floors, limits, layout, categories, catalog, tablecloths, garlands, garlandSpots };
  // Nombres, textos y niveles cambian solos según el idioma (js/i18n.js).
  if (window.I18N) window.I18N.localizeConfig(CFG);
  return CFG;
})(window.AltarPlaceholders);
