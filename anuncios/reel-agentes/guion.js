// GUION del anuncio para agentes: la fuente única. La película (pelicula.js), la partitura
// (partitura.mjs), la voz, los subtítulos, el guion técnico y los controles del motor salen de aquí.
// Los tiempos de los eventos están en beats; la película los convierte a segundos con la cuadrícula
// MEDIDA en beats.json. Concepto aprobado el 12/10/2026: CONCEPTO.md.

export const TITULO = 'Propiedad Conecta · «Paga solo por clientes interesados» · agentes';
export const ETIQUETA = 'agentes';                 // rótulo de la capa de revisión
export const ARCHIVO = 'propiedad-conecta-agentes'; // nombre de los videos: <ARCHIVO>-A.mp4, <ARCHIVO>-B.mp4

export const BPM = 120;          // 1 beat = 0,5 s · 1 compás = 2 s
export const BEATS = 36;
export const DURACION = 18;      // s

// Lo confirmado por el cliente el 12/10/2026 (ver CONCEPTO.md). Los precios no se dicen: van a cambiar.
export const PENDIENTE = {
  gratis: 'confirmado',          // el registro de agentes es gratis
  capturas: 'recibidas',         // cuatro capturas de lo que ve el agente (1440 × 900), recortadas
  voz: 'pendiente',              // se graba con el guion aprobado: la música ya deja los huecos
};

export const CTA = { conGratis: 'Regístrate gratis', sinGratis: 'Regístrate' };
export const ctaTexto = () => (PENDIENTE.gratis === 'no' ? CTA.sinGratis : CTA.conGratis);

// ---------- escenas ----------
// A y B solo difieren en la apertura (beats 0–6). Desde el beat 6 (3,0 s) son el mismo bloque.
export const APERTURA = {
  A: [
    { id: 'A1', nombre: 'Gancho · pagar por aparecer', b0: 0, b1: 4, texto: ['Deja de', 'pagar por', 'aparecer.'],
      visual: 'Fondo verde oscuro. Tres anuncios con la etiqueta «DESTACADO» (las propiedades del agente). En cada golpe cae una moneda sobre un anuncio, lo atraviesa y se pierde por abajo: se paga y no queda nada.' },
    { id: 'A2', nombre: 'Giro · la moneda se da vuelta', b0: 4, b1: 6, texto: ['Paga solo por', 'clientes', 'interesados.'],
      visual: 'Todo se congela en el beat. Una moneda queda en el aire, gira, y su otra cara es verde: el punto. Los anuncios y el titular caen y el fondo se vuelve marfil desde el punto.' },
  ],
  B: [
    { id: 'B1', nombre: 'Gancho · el cliente ya está buscando', b0: 0, b1: 4, texto: ['Esta vez,', 'el cliente ya', 'está buscando.'],
      visual: 'Los mismos anuncios y las mismas monedas. En el tercer beat el anuncio del medio se voltea: del otro lado dice «BUSCO».' },
    { id: 'B2', nombre: 'Giro · la moneda se da vuelta', b0: 4, b1: 6, texto: ['Paga solo por', 'clientes', 'interesados.'],
      visual: 'Igual que en A: la moneda en el aire gira y es el punto verde; todo lo demás cae.' },
  ],
};
export const COMUN = [
  { id: 'C1', nombre: 'Titular', b0: 6, b1: 8, texto: ['Paga solo por clientes interesados.'],
    visual: 'El punto llega al lugar de la tilde de la «i» de «interesados» y el titular sube debajo de él: la «i» crece hasta el punto. Se agacha y salta; las palabras viajan a la cabecera.' },
  { id: 'C2', nombre: 'El punto se vuelve marco', b0: 8, b1: 9.25, texto: [],
    visual: 'El punto aterriza en el centro y se estira hasta ser el marco donde van las pantallas reales.' },
  { id: 'P', nombre: 'Producto · lo que ve el agente', b0: 9.25, b1: 24, texto: ['Qué busca', 'Su presupuesto', 'Tú eliges', 'Desbloqueas', 'Contactas', 'Protección'],
    visual: 'Recortes de las capturas reales, uno por paso y en el orden real: la tarjeta del marketplace, su presupuesto, el contacto oculto y el botón de desbloquear, el diálogo de confirmación, «Contactar por WhatsApp» y la protección del lead. El marco toma el tamaño de cada recorte.' },
  { id: 'K1', nombre: 'Puente al cierre', b0: 24, b1: 26, texto: [],
    visual: 'El marco se recoge en el punto. El punto vuela en arco hasta la cabeza verde clara del isotipo.' },
  { id: 'K2', nombre: 'Cierre · marca + CTA', b0: 26, b1: 36, texto: ['Regístrate gratis', 'Para agentes e inmobiliarias'],
    visual: 'El punto aterriza sobre la cabeza clara del logo original y el isotipo se revela desde ahí. Suben el botón «Regístrate gratis», la línea «Para agentes e inmobiliarias» y el nombre. Fondo marfil; se sostiene 3 s completo.' },
];

// Eventos (beats) que comparten imagen y sonido.
export const EV = {
  monedas: [0, 1, 1.5, 2, 2.5, 3, 3.5], // cada moneda golpea un anuncio en su beat
  blanco: [1, 0, 2, 1, 0, 2, 0],        // a qué anuncio (0 izquierda, 1 centro, 2 derecha) va cada moneda
  caeB: 3,                              // B: el anuncio del medio se voltea y dice «BUSCO»
  congela: 4,                           // todo se detiene; una moneda queda en el aire
  gira: 4.2,                            // la moneda gira: del otro lado es el punto verde
  caen: 4.25,                           // los anuncios y el titular caen; el fondo se vuelve marfil desde el punto
  titular: 5.5,                         // «Paga solo por clientes interesados.» sube bajo el punto
  tilde: 5.5,                           // el punto llega al lugar del punto de la «i» de «interesados»
  salto: 7.5,                           // el punto deja la «i»
  marco: 8,                             // el punto aterriza en el centro y se vuelve marco
  abre: 8.6,                            // el marco se abre sobre la primera pantalla
  pasos: [10, 12, 15, 17, 18.5, 20],    // la cabecera cambia y entra cada pantalla
  acerca: 15.5,                         // la cámara se acerca al botón «Desbloquear contacto»
  fuera: 23.75,                         // sale la cabecera
  recoge: 24,                           // el marco se recoge en el punto
  vuelo: [24.5, 26],                    // el punto vuela al isotipo
  isotipo: 26,                          // aterriza: el isotipo se revela
  cta: 26.5,                            // sube el botón
  nota: 27.5,                           // sube «Para agentes e inmobiliarias»
  nombre: 29.25,                        // sube el nombre
  empujes: [32, 34],                    // la flecha del botón empuja
};

// ---------- locución (pendiente de grabar) ----------
// Mientras no haya tomas, cada línea es un hueco planeado (inicio/fin): la música ya baja ahí.
// Cuando lleguen: toma, frases con su corte y ancla a la imagen (ver el ejemplo del motor).
export const LOCUCION = {
  ritmo: { natural: 5.8, agil: 6.3 },
  voz: 'La misma voz del anuncio para compradores: cálida y segura, conversacional, sin tono de locutor. Grabación seca, tres tomas por línea.',
  tomas: 'locucion/tomas/',
  A: [{ id: 'L1', inicio: 0.1, fin: 1.9, texto: 'Deja de pagar por aparecer.', direccion: 'Firme y cercana, de colega. Peso en «aparecer».', toma: null }],
  B: [{ id: 'LB1', inicio: 0.1, fin: 2.4, texto: 'Esta vez, el cliente ya está buscando.', direccion: 'Con complicidad. Peso en «buscando».', toma: null }],
  comun: [
    { id: 'L2', inicio: 2.7, fin: 4.9, texto: 'Paga solo por clientes interesados.', direccion: 'Clara y segura. Peso en «interesados».', toma: null },
    { id: 'L3', inicio: 5.0, fin: 9.4, texto: 'Ves qué busca y cuánto quiere invertir… y eliges a quién contactar.', direccion: 'Lista con ritmo; cada parte coincide con la pantalla que aparece.', toma: null },
    { id: 'L4', inicio: 10.1, fin: 12.9, texto: 'Si no responde, puedes recuperar tus créditos.', direccion: 'Tranquila, que dé confianza. Peso en «recuperar».', toma: null },
    { id: 'L5', inicio: 13.4, fin: 15.9, texto: '__CTA__ en Propiedad Conecta.', direccion: 'Directa y cálida. Marca bien clara.', toma: null },
  ],
};
export const lineasVoz = v => [...LOCUCION[v], ...LOCUCION.comun].map(l => ({ ...l, texto: l.texto.replace('__CTA__', ctaTexto()) }));

// ---------- materiales y controles ----------
// Capturas reales de lo que ve el agente, en el orden en que las usa la película.
export const CAPTURAS = ['agente-1-marketplace.png', 'agente-2-detalle.png', 'agente-3-confirmar.png', 'agente-4-lead.png'].map(n => 'capturas/' + n);

// Impactos del punto que control.mjs mide en el video exportado: [nombre, beat].
export const CONTROL = {
  impactos: { A: [['punto de la «i»', EV.tilde]], B: [['punto de la «i»', EV.tilde]] },
};

// Momentos de la hoja a tamaño de teléfono (revision/movil-1a1.jpg): [variante, segundo].
export const REVISION = { movil: [['A', 1.6], ['B', 1.9], ['A', 3.6], ['A', 5.4], ['A', 8.9], ['A', 10.6], ['A', 16.5]] };

// Tabla de eventos del guion técnico: [nombre, beat o lista de beats, imagen, sonido].
export const EVENTOS = [
  ['Monedas', EV.monedas, 'cada moneda golpea un anuncio «DESTACADO», lo atraviesa y se pierde', 'moneda + golpe sordo'],
  ['B: el anuncio se voltea', EV.caeB, 'el anuncio del medio se voltea y dice «BUSCO»', 'marimba si + latigazo de volteo'],
  ['Congela', EV.congela, 'todo se detiene; una moneda queda en el aire', 'freno de cinta, silencio'],
  ['Gira', EV.gira, 'la moneda gira: del otro lado es el punto verde', 'brillo + marimba (la voz del punto)'],
  ['Caen', EV.caen, 'los anuncios y el titular caen; el fondo pasa a marfil desde el punto', 'barrido hacia abajo'],
  ['Titular', EV.titular, '«Paga solo por clientes interesados.» sube', 'acorde re mayor (piano FM) + bombo suave'],
  ['Tilde', EV.tilde, 'el punto cae como punto de la «i»', 'marimba re'],
  ['Salto', EV.salto, 'el punto deja la «i»; las palabras van a la cabecera', 'marimba la'],
  ['Marco', EV.marco, 'el punto se estira hasta ser el marco', 'grave + barrido'],
  ['Pasos', EV.pasos, 'qué busca · su presupuesto · tú eliges · desbloqueas · contactas · protección', 'marimba re–fa#–la–si–re–la'],
  ['Acerca', EV.acerca, 'la cámara se acerca al botón «Desbloquear contacto»', 'clic'],
  ['Recoge', EV.recoge, 'el marco se recoge en el punto', 'platillo invertido + barrido'],
  ['Vuelo', EV.vuelo, 'el punto vuela hasta la cabeza clara del isotipo', 'barrido + subida'],
  ['Isotipo', EV.isotipo, 'aterriza; el isotipo original se revela desde la cabeza', 'firma sonora: re + acorde re mayor 9'],
  ['CTA', EV.cta, 'sube el botón «Regístrate gratis»', 'firma sonora: la'],
  ['Nota', EV.nota, 'sube «Para agentes e inmobiliarias»', '—'],
  ['Nombre', EV.nombre, 'el logo se acomoda y sube el nombre', 'firma sonora: fa# + campana'],
  ['Empujes', EV.empujes, 'la flecha del botón empuja', 'clic suave'],
];
