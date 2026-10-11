/*
 * Línea de tiempo del animatic v1: fuente única de tiempos y textos.
 *
 * La leen animatic.html (reproducción y render) y generar.mjs (subtítulos,
 * guion de locución, tabla de tiempos, hoja de audio y control de calidad).
 * Para cambiar un tiempo o un texto se edita aquí y se vuelve a ejecutar
 * `node generar.mjs`. La versión v0 está congelada en v0/linea-de-tiempo-v0.js.
 *
 * Tiempos en segundos. Los ganchos A y B ocupan 0–4,7 s; desde 4,7 s ambas
 * versiones usan exactamente las mismas escenas y la misma locución.
 *
 * El formulario de E4–E5 usa solo recortes de las capturas reales
 * (capturas/recortes/, generados por capturas/preparar.py). Las cajas de los
 * anillos están en píxeles de cada recorte original, antes de ampliarlo.
 */
(function (raiz) {
  const LINEA = {
    titulo: 'Propiedad Conecta · Reel «Publica tu búsqueda»',
    version: 'v1',
    duracion: 23.5,
    fps: 30,
    ancho: 1080,
    alto: 1920,
    // Zona segura de Reels (cubre Stories): sin texto ni logo fuera de ella.
    zonaSegura: { arriba: 270, abajo: 672, lados: 65 },
    // Sílabas por segundo: hasta «natural» suena tranquilo; hasta «agil», aceptable.
    ritmo: { natural: 5.8, agil: 6.3 },
    comunDesde: 4.7,

    musica: [
      { t: 0, que: 'Filtrada y casi inaudible (mundo problema)' },
      { t: 4.7, que: 'Se abre el filtro y entra el beat, con el barrido' },
      { t: 17.6, que: 'Pequeña subida al pasar al cierre' },
      { t: 22.0, que: 'Resolución; cola hasta el final' },
    ],

    ganchos: {
      A: {
        nombre: 'A · Dolor',
        escenas: [
          {
            id: 'E1', nombre: 'Gancho', inicio: 0, fin: 2.4, mundo: 'noche',
            fuente: 'Clip C01 (primera parte)',
            plano: 'Noche. Daniela, recostada en el sofá, lee el celular con cansancio.',
            camara: 'Dolly-in muy lento hacia su rostro.',
            salida: { tipo: 'continua', texto: 'Sigue el mismo plano' },
            sonido: [
              { t: 0, que: 'Ambiente nocturno de interior' },
              { t: 0.2, que: 'Pop de mensaje (sonido genérico)' },
              { t: 1.25, que: 'Pop de mensaje' },
            ],
            elementos: [
              { tipo: 'titular', texto: '¿Otra vez?', tam: 132, inicio: 0, fin: 2.4 },
              { tipo: 'burbuja', texto: 'Ya se arrendó.', x: 430, y: 690, inicio: 0.2, fin: 3.1, sale: { inicio: 2.4, fin: 3.1 } },
              { tipo: 'burbuja', texto: 'Ese ya se vendió.', x: 360, y: 830, inicio: 1.25, fin: 3.1, sale: { inicio: 2.4, fin: 3.1 } },
            ],
          },
          {
            id: 'E2', nombre: 'Agitación', inicio: 2.4, fin: 4.7, mundo: 'noche',
            fuente: 'Clip C01 (continúa)',
            plano: 'Baja el celular al pecho, apoya la cabeza en el sofá y exhala.',
            camara: 'El push-in termina y se asienta.',
            salida: { tipo: 'chevron', texto: 'Barrido chevrón; entra el beat' },
            sonido: [
              { t: 2.4, que: 'Whooshes suaves del scroll de anuncios' },
              { t: 2.6, que: 'Suspiro (del clip)' },
              { t: 4.55, que: 'Whoosh del barrido' },
            ],
            elementos: [
              { tipo: 'anuncios', inicio: 2.4, fin: 4.7 },
              { tipo: 'titular', texto: 'Deja de perseguir anuncios.', resaltar: 'perseguir anuncios', inicio: 2.5, fin: 4.7 },
            ],
          },
        ],
        locucion: [
          {
            id: 'L1', inicio: 0.10, fin: 2.30, texto: '¿Otra vez «ya se arrendó»? ¿«Ya se vendió»?',
            mostrar: 'Titular «¿Otra vez?» + burbujas',
            direccion: 'Empática, con media ironía, como quien ya lo vivió. Pausa breve entre las dos preguntas.',
            bloques: [
              { texto: '¿Otra vez “ya se arrendó”?', inicio: 0.10, fin: 1.20 },
              { texto: '¿“Ya se vendió”?', inicio: 1.20, fin: 2.30 },
            ],
          },
          {
            id: 'L2', inicio: 2.55, fin: 4.25, texto: 'Deja de perseguir anuncios.',
            mostrar: 'Titular',
            direccion: 'Firme, sin regañar. Peso en «perseguir».',
            bloques: [{ texto: 'Deja de perseguir anuncios.', inicio: 2.55, fin: 4.25 }],
          },
        ],
      },

      B: {
        nombre: 'B · Inversión',
        escenas: [
          {
            id: 'B1', nombre: 'Gancho B', inicio: 0, fin: 2.4, mundo: 'fachada',
            fuente: 'Clip C07 + cartel compuesto en edición + captura real',
            plano: 'Ventana de un edificio residencial del norte de Quito con un cartel en blanco (el cartel se compone en edición).',
            camara: 'Trípode, push-in muy lento.',
            salida: { tipo: 'corte', texto: 'Corte directo' },
            sonido: [
              { t: 0, que: 'Ambiente de calle, tráfico lejano' },
              { t: 0.5, que: 'Cartulina que gira + whoosh' },
            ],
            elementos: [
              { tipo: 'titular', texto: 'Esta vez, el anuncio lo pones tú.', resaltar: 'tú', inicio: 0, fin: 2.4 },
              { tipo: 'cartel', inicio: 0, fin: 2.4, giro: 0.5, dorso: { img: 'que-lleno', w: 358, h: 96 } },
            ],
          },
          {
            id: 'B2', nombre: 'Pregunta', inicio: 2.4, fin: 4.7, mundo: 'calle',
            fuente: 'Clip C08',
            plano: 'Daniela camina por una calle arbolada del norte de Quito mirando su celular; levanta la vista, pensativa.',
            camara: 'Gimbal retrocediendo frente a ella.',
            salida: { tipo: 'chevron', texto: 'Barrido chevrón; entra el beat' },
            sonido: [
              { t: 2.4, que: 'Pasos y ambiente de calle' },
              { t: 4.55, que: 'Whoosh del barrido' },
            ],
            elementos: [],
          },
        ],
        locucion: [
          {
            id: 'LB1', inicio: 0.10, fin: 2.30, texto: 'Esta vez, el anuncio lo pones tú.',
            mostrar: 'Titular',
            direccion: 'Segura, con complicidad. Peso en «tú».',
            bloques: [{ texto: 'Esta vez, el anuncio lo pones tú.', inicio: 0.10, fin: 2.30 }],
          },
          {
            id: 'LB2', inicio: 2.50, fin: 4.50, texto: '¿Vas a comprar o alquilar en Quito?',
            mostrar: 'Subtítulo', quemar: true,
            direccion: 'Pregunta directa y cercana.',
            bloques: [
              { texto: '¿Vas a comprar o alquilar', inicio: 2.50, fin: 3.70 },
              { texto: 'en Quito?', inicio: 3.70, fin: 4.50 },
            ],
          },
        ],
      },
    },

    comun: {
      escenas: [
        {
          id: 'E3', nombre: 'Giro', inicio: 4.7, fin: 6.4, mundo: 'dia',
          fuente: 'Clip C02',
          plano: 'A la mañana siguiente, junto a la ventana, abre Propiedad Conecta en su celular.',
          camara: 'Push-in lento con un arco leve.',
          salida: { tipo: 'zoom', texto: 'Zoom hacia el celular; entra el formulario' },
          sonido: [{ t: 4.7, que: 'Entra el beat; ambiente diurno sutil' }],
          elementos: [{ tipo: 'titular', texto: 'Publica lo que buscas.', inicio: 4.85, fin: 6.4 }],
        },
        {
          id: 'E4', nombre: 'El formulario real', inicio: 6.4, fin: 11.9, mundo: 'dia-suave',
          fuente: 'Capturas reales del formulario + clip C03 desenfocado',
          plano: 'Fondo: manos escribiendo en el celular, muy desenfocado.',
          camara: 'Fondo con deriva lenta; el formulario se desplaza como al llenarlo.',
          salida: { tipo: 'continua', texto: 'El formulario sigue en E5' },
          sonido: [
            { t: 6.4, que: 'Whoosh suave: entra el formulario' },
            { t: 6.85, que: 'Tic suave de foco' },
            { t: 7.15, que: 'Clic: se marca «Comprar una propiedad»' },
            { t: 9.0, que: 'Tic de foco' },
            { t: 9.75, que: 'Tic de foco' },
            { t: 10.45, que: 'Tic de foco' },
            { t: 10.6, que: 'Clic: se marcan las casillas' },
          ],
          elementos: [
            {
              tipo: 'formulario', inicio: 6.4, fin: 17.6,
              ancho: 950, focoY: 450, inicialY: 330, separacion: 24,
              tarjetas: [
                { id: 'cabecera', img: 'cabecera', w: 640, h: 86 },
                { id: 'que', img: 'que-vacio', lleno: 'que-lleno', llenoEn: 7.15, w: 358, h: 96 },
                { id: 'ubicacion', img: 'ubicacion-vacio', lleno: 'ubicacion-lleno', llenoEn: 9.1, w: 358, h: 102 },
                { id: 'presupuesto', img: 'presupuesto-vacio', lleno: 'presupuesto-lleno', llenoEn: 9.85, w: 358, h: 93 },
                { id: 'caracteristicas', img: 'caracteristicas-vacio', lleno: 'caracteristicas-lleno', llenoEn: 10.6, w: 358, h: 280 },
                { id: 'contacto', img: 'contacto', w: 358, h: 142 },
                { id: 'publicar', img: 'publicar', w: 358, h: 37 },
              ],
              focos: [
                { t: 6.85, id: 'que' },
                { t: 9.0, id: 'ubicacion' },
                { t: 9.75, id: 'presupuesto' },
                { t: 10.45, id: 'caracteristicas' },
                { t: 11.9, id: 'contacto' },
                { t: 17.0, id: 'publicar' },
              ],
              anillos: [
                { id: 'que', caja: [8, 36, 124, 84], inicio: 6.85, fin: 7.9 },
                { id: 'que', caja: [180, 36, 349, 80], inicio: 7.9, fin: 9.0 },
                { id: 'ubicacion', caja: [8, 36, 349, 84], inicio: 9.05, fin: 9.75 },
                { id: 'presupuesto', caja: [8, 38, 349, 82], inicio: 9.8, fin: 10.45 },
                { id: 'caracteristicas', caja: [8, 38, 352, 128], inicio: 10.5, fin: 11.1 },
                { id: 'caracteristicas', caja: [8, 190, 236, 210], inicio: 11.1, fin: 11.9 },
                { id: 'contacto', caja: [178, 36, 348, 128], inicio: 12.1, fin: 15.4 },
                { id: 'publicar', caja: [2, 2, 356, 35], inicio: 17.0, fin: 17.6 },
              ],
              lupa: { img: 'agentes', w: 170, h: 19, ancho: 760, y: 860, inicio: 15.45, fin: 17.0 },
              toque: { id: 'publicar', t: 17.25 },
            },
          ],
        },
        {
          id: 'E5', nombre: 'Tus datos y tu control', inicio: 11.9, fin: 17.6, mundo: 'dia-suave',
          fuente: 'Capturas reales: datos de contacto, opciones de agentes y botón',
          plano: 'Fondo: Daniela, desenfocada, revisa el formulario antes de publicar.',
          camara: 'Fondo casi fijo.',
          salida: { tipo: 'corte', texto: 'Corte en el beat' },
          sonido: [
            { t: 11.9, que: 'Tic de foco' },
            { t: 15.45, que: 'Zoom suave (lupa sobre las opciones)' },
            { t: 17.25, que: 'Clic: «Publicar solicitud»' },
          ],
          elementos: [],
        },
        {
          id: 'E6', nombre: 'Alivio + CTA', inicio: 17.6, fin: 20.0, mundo: 'terraza',
          fuente: 'Clip C06 (o stock real de Quito)',
          plano: 'Daniela deja el celular sobre la mesa y sale tranquila a la terraza con su café; Quito y el Pichincha de fondo.',
          camara: 'Pull-back lento con ligera subida.',
          salida: { tipo: 'chevron', texto: 'Barrido chevrón al cierre' },
          sonido: [
            { t: 17.6, que: 'Subida musical; ambiente exterior suave' },
            { t: 19.85, que: 'Whoosh del barrido' },
          ],
          elementos: [
            { tipo: 'titular', texto: 'Publica gratis tu búsqueda', resaltar: 'gratis', inicio: 17.8, fin: 20.0 },
          ],
        },
        {
          id: 'E7', nombre: 'Cierre', inicio: 20.0, fin: 23.5, mundo: 'marfil',
          fuente: 'Edición: logo original + botón',
          plano: null,
          camara: null,
          salida: { tipo: 'ninguno', texto: 'El último frame sirve de frame de loop' },
          sonido: [
            { t: 20.15, que: 'Firma sonora opcional de dos notas' },
            { t: 22.0, que: 'Resolución de la música' },
          ],
          elementos: [
            { tipo: 'logo', inicio: 20.15, fin: 23.5 },
            { tipo: 'boton', texto: 'Publica gratis tu búsqueda', inicio: 20.7, fin: 23.5, pulso: 21.8 },
          ],
        },
      ],
      locucion: [
        {
          id: 'L3', inicio: 4.90, fin: 6.20, texto: 'Publica lo que buscas.',
          mostrar: 'Titular',
          direccion: 'Sonrisa en la voz; es la solución.',
          bloques: [{ texto: 'Publica lo que buscas.', inicio: 4.90, fin: 6.20 }],
        },
        {
          id: 'L4', inicio: 6.80, fin: 11.70, texto: 'Comprar o alquilar, tipo de propiedad, sector, presupuesto… y lo que no puede faltar.',
          mostrar: 'Capturas reales del formulario, con anillos',
          direccion: 'Lista con ritmo; micro-pausa entre datos, cada uno cuando aparece su tarjeta.',
          bloques: [
            { texto: 'Comprar o alquilar,', inicio: 6.80, fin: 7.90 },
            { texto: 'tipo de propiedad,', inicio: 7.90, fin: 9.00 },
            { texto: 'sector, presupuesto…', inicio: 9.00, fin: 10.45 },
            { texto: 'y lo que no puede faltar.', inicio: 10.45, fin: 11.70 },
          ],
        },
        {
          id: 'L5', inicio: 12.10, fin: 15.30, texto: 'Si un agente tiene algo para ti, puede contactarte.',
          mostrar: 'Subtítulo', quemar: true,
          direccion: 'Clara y tranquila. Es una posibilidad, no una promesa: sin énfasis de venta.',
          bloques: [
            { texto: 'Si un agente tiene algo para ti,', inicio: 12.10, fin: 13.90 },
            { texto: 'puede contactarte.', inicio: 13.90, fin: 15.30 },
          ],
        },
        {
          id: 'L6', inicio: 15.55, fin: 16.95, texto: 'Tú eliges hasta cuántos.',
          mostrar: 'Subtítulo', quemar: true,
          direccion: 'Cercana; peso en «tú».',
          bloques: [{ texto: 'Tú eliges hasta cuántos.', inicio: 15.55, fin: 16.95 }],
        },
        {
          id: 'L7a', inicio: 17.85, fin: 19.45, texto: 'Publica gratis tu búsqueda…',
          mostrar: 'Titular',
          direccion: 'Directa y cálida. «Gratis» con peso.',
          bloques: [{ texto: 'Publica gratis tu búsqueda', inicio: 17.85, fin: 19.45 }],
        },
        {
          id: 'L7b', inicio: 20.15, fin: 21.45, texto: 'en Propiedad Conecta.',
          mostrar: 'Logo',
          direccion: 'Marca bien clara; coincide con la aparición del logo.',
          bloques: [{ texto: 'en Propiedad Conecta.', inicio: 20.15, fin: 21.45 }],
        },
      ],
    },
  };

  /** Escenas y locución completas de una versión ('A' o 'B'). */
  LINEA.armar = function (version) {
    const g = LINEA.ganchos[version];
    return {
      version,
      nombre: g.nombre,
      escenas: g.escenas.concat(LINEA.comun.escenas),
      locucion: g.locucion.concat(LINEA.comun.locucion),
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = LINEA;
  else raiz.LINEA = LINEA;
})(typeof window !== 'undefined' ? window : globalThis);
