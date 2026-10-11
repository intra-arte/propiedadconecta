// FUENTE ÚNICA de la v1 de motion. La imagen (film.js), la partitura (musica.mjs), los subtítulos,
// el guion de locución y la tabla de tiempos (generar-textos.mjs) se derivan de este archivo.
// Los tiempos de los eventos están en beats; la película los convierte a segundos con la
// cuadrícula MEDIDA en beats.json. Cada frase de la locución se ancla a un beat de la imagen.

export const BPM = 120;          // 1 beat = 0,5 s · 1 compás = 2 s
export const BEATS = 32;
export const DURACION = 16;      // s

// Lo que todavía no está confirmado. Cambia a 'confirmado' / 'no' cuando llegue la respuesta.
export const PENDIENTE = {
  gratis: 'confirmado',          // confirmado por producto el 11/10/2026 · 'no' → «Publica tu búsqueda»
  capturas: 'recibidas',         // 5 capturas reales del formulario (800 × 500, JPEG): se reemplazan por originales en alta resolución sin tocar la animación
  voz: 'parcial',                // tomas recibidas el 11/10/2026 salvo L2 «Publica lo que buscas.»: su hueco y la música ya están
  rotulos: 'confirmado',         // «Tipo de propiedad», «Ubicación», «Presupuesto», «Características» existen en el formulario real
};

export const CTA = {
  conGratis: 'Publica gratis tu búsqueda',
  sinGratis: 'Publica tu búsqueda',
};
export const ctaTexto = () => (PENDIENTE.gratis === 'no' ? CTA.sinGratis : CTA.conGratis);

// Zonas seguras para Reels y Stories (las mismas del v0): todo texto y el logo dentro de este rectángulo.
export const SEGURA = { x0: 65, x1: 1015, y0: 270, y1: 1248 };

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
// Tomas entregadas por el cliente el 11/10/2026 (locucion/tomas/, sin editar). Falta L2.
// Cada línea se coloca por frases. «corte»: tramo de la toma, en segundos. «ancla»: dónde cae el
// primer sonido de la frase, { b, s } = beat de la imagen + segundos, o { tras } = segundos después
// del último sonido de la frase anterior. Sin «frases», la toma entera es una frase con el «ancla»
// de la línea. «inicio»/«fin» son el hueco planeado: valen mientras la toma no exista.
// «node voz.mjs» arma la pista y escribe los tiempos reales en locucion/colocacion.json.
export const LOCUCION = {
  ritmo: { natural: 5.8, agil: 6.3 },
  voz: 'Voz femenina o masculina, 25–40 años, cálida y segura, conversacional. Acento quiteño suave o latinoamericano neutro. Sin tono de locutor de radio. Grabación seca, 48 kHz / 24 bit, tres tomas por línea.',
  tomas: 'locucion/tomas/',
  A: [{ id: 'L1', inicio: 0.1, fin: 1.9, texto: 'Deja de perseguir anuncios.', direccion: 'Firme y cercana, sin regañar. Peso en «perseguir».',
    toma: 'L1-deja-de-perseguir-anuncios.mp3', ancla: { s: 0.1 } }],
  B: [{ id: 'LB1', inicio: 0.1, fin: 2.3, texto: 'Esta vez, el anuncio lo pones tú.', direccion: 'Segura, con complicidad. Peso en «tú».',
    toma: 'LB1-esta-vez-el-anuncio-lo-pones-tu.mp3',
    // la pausa después de «Esta vez,» baja de 0,15 a 0,10 s para que «tú.» termine antes de L2
    frases: [{ texto: 'Esta vez,', corte: [0, 0.84], ancla: { s: 0.04 } }, { texto: 'el anuncio lo pones tú.', corte: [0.84, 2.88], ancla: { tras: 0.1 } }] }],
  comun: [
    // «bli» de «Publica» cae con el punto en la «i»
    { id: 'L2', inicio: 2.69, fin: 4.1, texto: 'Publica lo que buscas.', direccion: 'Sonrisa en la voz. Peso en «buscas».',
      toma: null, ancla: { b: EV.tilde, s: -0.06 } },
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
