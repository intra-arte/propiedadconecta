// GUION del anuncio: la fuente única. La película (pelicula.js), la partitura (partitura.mjs), la voz,
// los subtítulos, el guion técnico y los controles del motor se derivan de este archivo.
// Los tiempos de los eventos están en beats; la película los convierte a segundos con la cuadrícula
// MEDIDA en beats.json. Cada frase de la locución se ancla a un beat de la imagen.
//
// Ejemplo del motor: es el anuncio aprobado «Publica lo que buscas» (v1 de motion, 11/10/2026), portado
// tal cual. Sus materiales (capturas y tomas de voz) se leen de la carpeta del original, que no se toca.

export const TITULO = 'Propiedad Conecta · «Publica lo que buscas» · v1 de motion';
export const ETIQUETA = 'v1';                     // rótulo de la capa de revisión
export const ARCHIVO = 'propiedad-conecta-v1';    // nombre de los videos: <ARCHIVO>-A.mp4, <ARCHIVO>-B.mp4
const MATERIAL = '../../reel-publica-tu-busqueda/motion-v1/'; // relativo a esta carpeta

export const BPM = 120;          // 1 beat = 0,5 s · 1 compás = 2 s
export const BEATS = 32;
export const DURACION = 16;      // s

// Lo que todavía no está confirmado. Cambia a 'confirmado' / 'no' cuando llegue la respuesta.
export const PENDIENTE = {
  gratis: 'confirmado',          // confirmado por producto el 11/10/2026 · 'no' → «Publica tu búsqueda»
  capturas: 'recibidas',         // capturas reales del formulario: cuatro de 1440 × 900 y la 3 de 800 × 500 (de esa no llegó versión grande)
  voz: 'recibida',               // las seis tomas, recibidas el 11/10/2026 (locucion/tomas/)
  rotulos: 'confirmado',         // «Tipo de propiedad», «Ubicación», «Presupuesto», «Características» existen en el formulario real
};

export const CTA = {
  conGratis: 'Publica gratis tu búsqueda',
  sinGratis: 'Publica tu búsqueda',
};
export const ctaTexto = () => (PENDIENTE.gratis === 'no' ? CTA.sinGratis : CTA.conGratis);

// ---------- escenas ----------
// A y B solo difieren en la apertura (beats 0–6). Desde el beat 6 (3,0 s) son el mismo bloque.
export const APERTURA = {
  A: [
    { id: 'A1', nombre: 'Gancho · el muro', b0: 0, b1: 4, texto: ['Deja de', 'perseguir', 'anuncios.'],
      visual: 'Un anuncio en primer plano recibe el sello «YA SE ARRENDÓ»; la cámara se aleja y revela un muro infinito de anuncios que se desplaza. Los sellos caen en cascada. El punto verde persigue anuncios saltando de tarjeta en tarjeta; cada una que toca queda sellada.' },
    { id: 'A2', nombre: 'Giro · el muro se da la vuelta', b0: 4, b1: 6, texto: ['Publica', 'lo que', 'buscas.'],
      visual: 'Todo se congela en el beat. Desde el punto, una onda voltea cada anuncio: sus reversos marfil se unen en una superficie limpia. «Publica lo que buscas.» sube desde su línea base y el punto cae como el punto de la «i».' },
  ],
  B: [
    { id: 'B1', nombre: 'Gancho · el anuncio es tuyo', b0: 0, b1: 4, texto: ['Esta vez,', 'el anuncio', 'lo pones tú.'],
      visual: 'El mismo muro y el mismo movimiento de cámara. Mientras la voz dice «el anuncio lo pones…», el punto cae sobre el anuncio central, que se voltea: ya no dice «SE ARRIENDA», dice «BUSCO». «Tú» cae cuando el muro se da la vuelta.' },
    { id: 'B2', nombre: 'Giro · el muro se da la vuelta', b0: 4, b1: 6, texto: ['Publica', 'lo que', 'buscas.'],
      visual: 'La onda sale del anuncio «BUSCO» y voltea todo el muro. «Publica lo que buscas.» sube y el punto cae como el punto de la «i».' },
  ],
};
export const COMUN = [
  { id: 'C1', nombre: 'Titular', b0: 6, b1: 8, texto: ['Publica lo que buscas.'],
    visual: 'Titular sostenido. El punto se agacha con la «i» y salta; las palabras viajan a su posición de cabecera.' },
  { id: 'C2', nombre: 'El punto se vuelve marco', b0: 8, b1: 9.25, texto: [],
    visual: 'El punto aterriza en el centro y se estira hasta convertirse en el marco donde irá el formulario real. El verde se abre y deja ver el espacio reservado.' },
  { id: 'P', nombre: 'Producto · el formulario real', b0: 9.25, b1: 19.5, texto: ['Tipo de propiedad', 'Ubicación', 'Presupuesto', 'Características'],
    visual: 'El marco se abre sobre el formulario real («Cuéntanos qué propiedad estás buscando · Es gratis publicar»). La cabecera rueda al ritmo de la voz y la cámara encuadra cada tarjeta mientras el resto se atenúa; cada una pasa de vacía a llena con las capturas reales. Al final la ventana se estrecha sobre el botón «Publicar solicitud».' },
  { id: 'K1', nombre: 'Puente al cierre', b0: 19.5, b1: 22, texto: [],
    visual: 'El marco se recoge en el punto. El punto vuela en arco hasta la cabeza verde clara del isotipo.' },
  { id: 'K2', nombre: 'Cierre · marca + CTA', b0: 22, b1: 32, texto: ['Publica gratis tu búsqueda'],
    visual: 'El punto aterriza exactamente sobre la cabeza clara del logo original; el isotipo se revela desde ahí. Sube el botón con el CTA y después el nombre. Fondo marfil del logo. Se sostiene 3 s completo.' },
];

// Eventos (beats) que comparten imagen y sonido.
export const EV = {
  sello0: 0,                       // primer sello, en el primer fotograma
  alejar: [0, 2],                  // la cámara se aleja del anuncio
  cascada: [1, 1.5, 2, 2.25, 2.75, 3.25, 3.75],  // sellos en cascada (corcheas y semicorcheas)
  saltosA: [2.5, 3, 3.5],          // A: el punto persigue y sella anuncios
  caeB: 3,                         // B: el punto cae sobre el anuncio central con «tú»
  congela: 4,                      // todo se detiene
  onda: 4.15,                      // empieza la onda de volteo
  titular: 5,                      // «Publica lo que buscas.» sube
  tilde: 5.5,                      // el punto cae como punto de la «i»
  salto: 7.5,                      // el punto deja la «i»
  marco: 8,                        // el punto aterriza en el centro y se vuelve marco
  abre: 8.6,                       // el verde se abre: espacio reservado
  rotulos: [10, 12, 14, 16],       // la cabecera cambia y la cámara encuadra la tarjeta
  rellena: [10.5, 12.5, 14.5, 16.5], // la tarjeta pasa de vacía a llena (captura vacía → captura llena)
  boton: 18,                       // la ventana se estrecha sobre «Publicar solicitud»
  rotulosFuera: 18.25,
  recoge: 19.75,                   // el marco se recoge en el punto
  vuelo: [20.25, 22],              // el punto vuela al isotipo
  isotipo: 22,                     // aterriza: el isotipo se revela
  cta: 22.5,                       // sube el botón
  nombre: 25.25,                   // sube el nombre
  empujes: [28, 30],               // la flecha del botón empuja
};

// ---------- locución ----------
// Tomas entregadas por el cliente el 11/10/2026 (locucion/tomas/, sin editar).
// Cada línea se coloca por frases. «corte»: tramo de la toma, en segundos. «ancla»: dónde cae el
// primer sonido de la frase, { b, s } = beat de la imagen + segundos, o { tras } = segundos después
// del último sonido de la frase anterior. Sin «frases», la toma entera es una frase con el «ancla»
// de la línea. «inicio»/«fin» son el hueco planeado: valen mientras la toma no exista.
// «node voz.mjs» arma la pista y escribe los tiempos reales en locucion/colocacion.json.
export const LOCUCION = {
  ritmo: { natural: 5.8, agil: 6.3 },
  voz: 'Voz femenina o masculina, 25–40 años, cálida y segura, conversacional. Acento quiteño suave o latinoamericano neutro. Sin tono de locutor de radio. Grabación seca, 48 kHz / 24 bit, tres tomas por línea.',
  tomas: MATERIAL + 'locucion/tomas/',
  A: [{ id: 'L1', inicio: 0.1, fin: 1.9, texto: 'Deja de perseguir anuncios.', direccion: 'Firme y cercana, sin regañar. Peso en «perseguir».',
    toma: 'L1-deja-de-perseguir-anuncios.mp3', ancla: { s: 0.1 } }],
  B: [{ id: 'LB1', inicio: 0.1, fin: 2.3, texto: 'Esta vez, el anuncio lo pones tú.', direccion: 'Segura, con complicidad. Peso en «tú».',
    toma: 'LB1-esta-vez-el-anuncio-lo-pones-tu.mp3',
    // la pausa después de «Esta vez,» baja de 0,15 a 0,10 s para que «tú.» termine antes de L2
    frases: [{ texto: 'Esta vez,', corte: [0, 0.84], ancla: { s: 0.04 } }, { texto: 'el anuncio lo pones tú.', corte: [0.84, 2.88], ancla: { tras: 0.1 } }] }],
  comun: [
    // «Publica» empieza cuando el punto cae en la «i»
    { id: 'L2', inicio: 2.69, fin: 4.1, texto: 'Publica lo que buscas.', direccion: 'Sonrisa en la voz. Peso en «buscas».',
      toma: 'L2-publica-lo-que-buscas.mp3',
      // el corte deja fuera un sonido corto que precede a la frase (0,17–0,22 s de la toma)
      frases: [{ texto: 'Publica lo que buscas.', corte: [0.3, 2.04], ancla: { b: EV.tilde, s: -0.06 } }] },
    // cada dato suena cuando la cabecera lo nombra y la cámara encuadra su tarjeta
    { id: 'L3', inicio: 4.9, fin: 9.1, texto: 'Tipo de propiedad, ubicación, presupuesto… y lo que no puede faltar.', direccion: 'Lista con ritmo, micro-pausa entre datos: cada dato coincide con la tarjeta que aparece en pantalla.',
      toma: 'L3-tipo-de-propiedad-ubicacion-presupuesto-y-lo-que-no-puede-faltar.mp3',
      frases: [
        { texto: 'Tipo de propiedad,', corte: [0, 1.25], ancla: { b: EV.rotulos[0], s: -0.18 } },
        { texto: 'ubicación,', corte: [1.25, 2.335], ancla: { b: EV.rotulos[1], s: 0.09 } },
        { texto: 'presupuesto…', corte: [2.335, 3.42], ancla: { b: EV.rotulos[2], s: 0.16 } },
        { texto: 'y lo que no puede faltar.', corte: [3.6, 5.6], ancla: { b: EV.rotulos[3], s: 0.22 } },
      ] },
    // el CTA suena cuando sube el texto del botón; la marca lo sigue en la misma frase, con el nombre ya arriba
    { id: 'L4', inicio: 11.0, fin: 12.6, texto: '__CTA__.', direccion: 'Directa y cálida. «Gratis» con peso.',
      toma: 'L4-publica-gratis-tu-busqueda.mp3', ancla: { b: EV.cta, s: 0.15 } },
    { id: 'L5', inicio: 12.7, fin: 14.0, texto: 'En Propiedad Conecta.', direccion: 'Marca bien clara; coincide con la aparición del nombre.',
      toma: 'L5-en-propiedad-conecta.mp3', ancla: { tras: 0.12 } },
  ],
};
export const lineasVoz = v => [...LOCUCION[v], ...LOCUCION.comun].map(l => ({ ...l, texto: l.texto.replace('__CTA__', ctaTexto()) }));

// ---------- materiales y controles ----------
// Capturas reales, en el orden en que las usa la película (rutas relativas a esta carpeta).
export const CAPTURAS = ['formulario-1-vacio.png', 'formulario-2-que-y-ubicacion.png', 'formulario-3-presupuesto.jpg', 'formulario-4-caracteristicas.png', 'formulario-5-contacto-y-publicar.png'].map(n => MATERIAL + 'capturas/' + n);

// Impactos del punto que control.mjs mide en el video exportado: [nombre, beat].
export const CONTROL = {
  impactos: {
    A: [['salto 1 (sello)', EV.saltosA[0]], ['salto 2 (sello)', EV.saltosA[1]], ['salto 3 (sello)', EV.saltosA[2]], ['punto de la «i»', EV.tilde]],
    B: [['cae en «BUSCO»', EV.caeB], ['punto de la «i»', EV.tilde]],
  },
};

// Momentos de la hoja a tamaño de teléfono (revision/movil-1a1.jpg): [variante, segundo].
export const REVISION = { movil: [['A', 1.75], ['B', 1.95], ['A', 5.6], ['A', 7.6], ['A', 9.3], ['A', 14.5]] };

// Tabla de eventos del guion técnico: [nombre, beat o lista de beats, imagen, sonido].
export const EVENTOS = [
  ['Primer sello', EV.sello0, '«YA SE ARRENDÓ» cae sobre el anuncio en el primer fotograma', 'golpe de sello + grave'],
  ['Sellos en cascada', EV.cascada, 'otros anuncios quedan sellados', 'sellos más livianos, abiertos en estéreo'],
  ['A: el punto persigue', EV.saltosA, 'cada anuncio que toca el punto queda «NO DISPONIBLE»', 'marimba fa#–la–si + sello'],
  ['B: el punto cae', EV.caeB, 'la tarjeta se voltea a «BUSCO» y se despega del muro', 'marimba si + latigazo de volteo'],
  ['Congela', EV.congela, 'todo se detiene', 'freno de cinta, silencio'],
  ['Onda', EV.onda, 'los anuncios se voltean desde el punto; el fondo pasa a marfil', 'cascada de clics de papel'],
  ['Titular', EV.titular, '«Publica lo que buscas.» sube', 'acorde re mayor (piano FM) + bombo suave'],
  ['Tilde', EV.tilde, 'el punto cae como punto de la «i»; onda de peso en la palabra', 'marimba re (la voz del punto)'],
  ['Salto', EV.salto, 'el punto deja la «i»; las palabras van a la cabecera', 'marimba la'],
  ['Marco', EV.marco, 'el punto se estira hasta ser el marco', 'grave + barrido'],
  ['Abre', EV.abre, 'el verde se abre sobre el formulario real', 'arpegio re–fa#–la–re'],
  ['Rótulos', EV.rotulos, 'la cabecera rueda: tipo · ubicación · presupuesto · características', 'marimba re–fa#–la–si'],
  ['Recoge', EV.recoge, 'el marco se recoge en el punto', 'platillo invertido + barrido'],
  ['Vuelo', EV.vuelo, 'el punto vuela hasta la cabeza clara del isotipo', 'barrido + subida'],
  ['Isotipo', EV.isotipo, 'aterriza; el isotipo original se revela desde la cabeza', 'firma sonora: re + acorde re mayor 9'],
  ['CTA', EV.cta, 'sube el botón', 'firma sonora: la'],
  ['Nombre', EV.nombre, 'el logo se acomoda y sube el nombre', 'firma sonora: fa# + campana'],
  ['Empujes', EV.empujes, 'la flecha del botón empuja', 'clic suave'],
];
