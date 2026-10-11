// FUENTE ÚNICA de la v1 de motion. La imagen (film.js), la partitura (musica.mjs), los subtítulos,
// el guion de locución y la tabla de tiempos (generar-textos.mjs) se derivan de este archivo.
// Los tiempos de los eventos están en beats; la película los convierte a segundos con la
// cuadrícula MEDIDA en beats.json. La locución está en segundos (es una pista aparte).

export const BPM = 120;          // 1 beat = 0,5 s · 1 compás = 2 s
export const BEATS = 32;
export const DURACION = 16;      // s

// Lo que todavía no está confirmado. Cambia a 'confirmado' / 'no' cuando llegue la respuesta.
export const PENDIENTE = {
  gratis: 'pendiente',           // 'confirmado' → «Publica gratis tu búsqueda» · 'no' → «Publica tu búsqueda»
  capturas: 'pendiente',         // el formulario real ocupa el espacio reservado de la escena P
  voz: 'pendiente',              // no hay voz natural en este entorno: guion y huecos listos para grabar
  rotulos: 'pendiente',          // «Tipo de propiedad», «Ubicación»… se ajustan a los rótulos reales del formulario
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
      visual: 'El mismo muro y el mismo movimiento de cámara. Con «tú», el punto cae sobre el anuncio central, que se voltea: ya no dice «SE ARRIENDA», dice «BUSCO».' },
    { id: 'B2', nombre: 'Giro · el muro se da la vuelta', b0: 4, b1: 6, texto: ['Publica', 'lo que', 'buscas.'],
      visual: 'La onda sale del anuncio «BUSCO» y voltea todo el muro. «Publica lo que buscas.» sube y el punto cae como el punto de la «i».' },
  ],
};
export const COMUN = [
  { id: 'C1', nombre: 'Titular', b0: 6, b1: 8, texto: ['Publica lo que buscas.'],
    visual: 'Titular sostenido. El punto se agacha con la «i» y salta; las palabras viajan a su posición de cabecera.' },
  { id: 'C2', nombre: 'El punto se vuelve marco', b0: 8, b1: 9.25, texto: [],
    visual: 'El punto aterriza en el centro y se estira hasta convertirse en el marco donde irá el formulario real. El verde se abre y deja ver el espacio reservado.' },
  { id: 'P', nombre: 'Producto · ESPACIO RESERVADO', b0: 9.25, b1: 19.5, texto: ['Tipo de propiedad', 'Ubicación', 'Presupuesto', 'Características'],
    visual: 'Aquí va la grabación real del formulario (pendiente). Arriba, la cabecera rueda al ritmo de la voz por los datos que la persona define. Rótulos por confirmar con las capturas.', reservado: true },
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
  rotulos: [10, 12, 14, 16],       // la cabecera cambia
  rotulosFuera: 19,
  recoge: 19.75,                   // el marco se recoge en el punto
  vuelo: [20.25, 22],              // el punto vuela al isotipo
  isotipo: 22,                     // aterriza: el isotipo se revela
  cta: 22.5,                       // sube el botón
  nombre: 25.25,                   // sube el nombre
  empujes: [28, 30],               // la flecha del botón empuja
};

// ---------- locución (pendiente de grabar) ----------
export const LOCUCION = {
  ritmo: { natural: 5.8, agil: 6.3 },
  voz: 'Voz femenina o masculina, 25–40 años, cálida y segura, conversacional. Acento quiteño suave o latinoamericano neutro. Sin tono de locutor de radio. Grabación seca, 48 kHz / 24 bit, tres tomas por línea.',
  A: [{ id: 'L1', inicio: 0.1, fin: 1.9, texto: 'Deja de perseguir anuncios.', direccion: 'Firme y cercana, sin regañar. Peso en «perseguir».' }],
  B: [{ id: 'LB1', inicio: 0.1, fin: 2.3, texto: 'Esta vez, el anuncio lo pones tú.', direccion: 'Segura, con complicidad. Peso en «tú».' }],
  comun: [
    { id: 'L2', inicio: 2.5, fin: 3.8, texto: 'Publica lo que buscas.', direccion: 'Sonrisa en la voz. Peso en «buscas».' },
    { id: 'L3', inicio: 4.9, fin: 9.1, texto: 'Tipo de propiedad, ubicación, presupuesto… y lo que no puede faltar.', direccion: 'Lista con ritmo, micro-pausa entre datos. Los rótulos se ajustan al formulario real.' },
    { id: 'L4', inicio: 11.0, fin: 12.6, texto: '__CTA__.', direccion: 'Directa y cálida. Si se confirma, «gratis» con peso.' },
    { id: 'L5', inicio: 12.7, fin: 14.0, texto: 'En Propiedad Conecta.', direccion: 'Marca bien clara; coincide con la aparición del nombre.' },
  ],
};
export const lineasVoz = v => [...LOCUCION[v], ...LOCUCION.comun].map(l => ({ ...l, texto: l.texto.replace('__CTA__', ctaTexto()) }));
