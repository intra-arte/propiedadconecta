// GUION de «Los dos del logo»: la fuente única. La película (pelicula.js), la partitura (partitura.mjs),
// la voz, los subtítulos, el guion técnico y los controles del motor salen de aquí. Los tiempos de los
// eventos están en beats; la película los convierte a segundos con la cuadrícula MEDIDA en beats.json.
// Concepto aprobado el 13/10/2026 con un cambio: un solo gancho (A), para que el logo aparezca recién
// al final, cuando los dos se conectan. Ver CONCEPTO.md.

export const TITULO = 'Propiedad Conecta · «Los dos del logo» · agentes';
export const ETIQUETA = 'los dos del logo';
export const ARCHIVO = 'propiedad-conecta-los-dos-del-logo';
export const VARIANTES = ['A'];  // un solo gancho: el logo no se muestra antes del final

export const BPM = 120;          // 1 beat = 0,5 s · 1 compás = 2 s
export const BEATS = 40;
export const DURACION = 20;      // s

export const PENDIENTE = {
  gratis: 'confirmado',          // el registro de agentes es gratis
  capturas: 'recibidas',         // las del anuncio para agentes (reel-agentes/capturas), recortadas
  voz: 'recibida',               // L1–L4 con ElevenLabs (13/10/2026); el CTA queda solo en pantalla, por decisión del cliente
};

export const CTA = { conGratis: 'Regístrate gratis', sinGratis: 'Regístrate' };
export const ctaTexto = () => (PENDIENTE.gratis === 'no' ? CTA.sinGratis : CTA.conGratis);

// ---------- escenas ----------
export const APERTURA = {
  A: [
    { id: 'A1', nombre: 'Gancho · ya están buscando', b0: 0, b1: 6, texto: ['Tus próximos', 'clientes ya', 'están buscando.'],
      visual: 'Fondo marfil. Tres clientes (la persona verde oscura del logo) caen uno por beat en una fila, cada uno con una burbuja de lo que busca: casa, departamento, arriendo. El cuerpo claro brota del suelo y el punto verde cae sobre él: es la cabeza del agente.' },
  ],
};
export const COMUN = [
  { id: 'C1', nombre: 'Elige', b0: 6, b1: 11, texto: ['Qué busca', 'Su presupuesto'],
    visual: 'El agente pasa saltando frente a los clientes; cada burbuja crece cuando pasa. Se queda con el del medio: su burbuja sube y se abre en la app real (la tarjeta del marketplace, después su presupuesto).' },
  { id: 'C2', nombre: 'La moneda', b0: 11, b1: 16, texto: ['Tú eliges', 'Desbloqueas'],
    visual: 'A cada cliente le aparece un candado. Arriba, el contacto oculto y el botón «Desbloquear contacto»; después, el diálogo. El agente lanza una moneda que gira en el aire y entra en el candado del elegido: se abre.' },
  { id: 'C3', nombre: 'No responde', b0: 16, b1: 20, texto: ['Protección'],
    visual: 'El cliente muestra «…» y se apaga: no contesta. Arriba, la tarjeta «Protección del lead». La moneda sale y vuelve a la mano del agente.' },
  { id: 'C4', nombre: 'Responde', b0: 20, b1: 25, texto: ['Contactas'],
    visual: 'La misma moneda abre el candado del cliente de la izquierda. Contesta (globo de chat) y salta. Arriba, «Contactar por WhatsApp». Los otros se apartan y los dos van al centro; la cámara se acerca.' },
  { id: 'C5', nombre: 'Se forma el logo', b0: 25, b1: 29.5, texto: [],
    visual: 'Se agachan, saltan uno hacia el otro y sus brazos se juntan en el vértice: el techo. La app baja y se vuelve la ventana, que se enciende cuadro a cuadro. Es el logo original.' },
  { id: 'K', nombre: 'Cierre · marca + CTA', b0: 29.5, b1: 40, texto: ['Regístrate gratis', 'Para agentes e inmobiliarias'],
    visual: 'El logo va a su lugar. Suben el botón «Regístrate gratis», la línea «Para agentes e inmobiliarias» y el nombre. Fondo marfil; se sostiene completo.' },
];

// Eventos (beats) que comparten imagen y sonido.
export const EV = {
  titular: [0.25, 1, 2],                // entran las tres líneas del gancho
  leads: [0.5, 1.5, 2.5],               // cada cliente cae en su lugar
  cuerpo: 3.25,                         // el cuerpo claro brota del suelo
  cabeza: [3, 4],                       // el punto cae desde arriba y aterriza en el cuerpo: el agente
  saleTitular: 5.5,                     // el titular se va
  saltos: [6.5, 7, 7.5, 8],             // el agente pasa saltando frente a los clientes (aterrizajes)
  burbuja: 8.25,                        // la burbuja del elegido sube y se abre en la app
  pasos: [9, 10, 11.5, 13.5, 17.5, 22.5], // la cabecera cambia y entra cada pantalla real
  acerca: 12.5,                         // la cámara se acerca al botón «Desbloquear contacto»
  candados: [11, 11.25, 11.5],          // a cada cliente le aparece su candado
  lanza: 13.75, entra: 14.5, abre: 14.75, // la moneda sale de la mano, entra en el candado y lo abre
  espera: 15.5, silencio: 17.25,        // «…» y se apaga: el cliente no contesta
  vuelve: [20, 21],                     // la moneda sale del candado y vuelve a la mano («puedes recuperar»)
  lanza2: 21.25, entra2: 22, abre2: 22.25, // la misma moneda abre al cliente de la izquierda
  responde: 22.75,                      // contesta: globo de chat y un salto
  apartan: 23.25,                       // los otros dos se apartan
  acercan: [23.5, 24],                  // los dos saltan al centro
  camara: [23.75, 25],                  // la cámara se acerca a ellos
  fuera: 25,                            // sale la cabecera
  agacha: 25.25, salto: 25.5, junta: 26.5, // se agachan, saltan y los brazos se juntan en el vértice
  baja: [25.5, 26.75],                  // la app se achica y baja a la casa
  ventanas: [26.75, 27, 27.25, 27.5],   // la ventana se enciende cuadro a cuadro
  aCierre: [28.5, 29.5],                // la cámara lleva el logo a su lugar del cierre
  isotipo: 28,                          // (cierre del motor: el logo ya está entero cuando toma el relevo)
  cta: 30,                              // sube el botón
  nota: 31,                             // sube «Para agentes e inmobiliarias»
  nombre: 32.5,                         // el logo se acomoda y sube el nombre
  empujes: [35, 37],                    // la flecha del botón empuja
};

// ---------- locución ----------
// L1–L4: voz «Arturo Casares» de ElevenLabs, elegida por el cliente (ver locucion/tomas/LEEME.md). Cada
// línea entra entera, sin acelerar ni estirar; el ancla es dónde empieza a sonar. No hay CTA hablado: el
// cliente decidió dejarlo solo en pantalla (13/10/2026), así que la música no le deja hueco.
export const LOCUCION = {
  ritmo: { natural: 5.8, agil: 6.3 },
  voz: 'Arturo Casares (ElevenLabs, eleven_v4): cálida y pausada.',
  tomas: 'locucion/tomas/',
  A: [{ id: 'L1', inicio: 0.1, fin: 2.72, texto: 'Tus próximos clientes ya están buscando.', direccion: 'Cercana, con una buena noticia. Peso en «buscando».',
    toma: 'L1-2-tus-proximos-clientes-ya-estan-buscando.mp3', ancla: { s: 0.1 } }],
  comun: [
    // «Ves qué buscan» mientras el agente mira a cada cliente; «cuánto quieren invertir» con su presupuesto en pantalla
    { id: 'L2', inicio: 2.9, fin: 6.0, texto: 'Ves qué buscan y cuánto quieren invertir.', direccion: 'Clara, como mostrando algo. Peso en «invertir».',
      toma: 'L2-1-ves-que-buscan-y-cuanto-quieren-invertir.mp3', ancla: { b: EV.saltos[0] - 0.5, s: -0.1 } },
    // «por el cliente» cuando la moneda entra en el candado
    { id: 'L3', inicio: 6.15, fin: 8.78, texto: 'Pagas solo por el cliente que eliges.', direccion: 'Segura. Peso en «solo» y «eliges».',
      toma: 'L3-1-pagas-solo-por-el-cliente-que-eliges.mp3', ancla: { b: EV.pasos[2], s: 0.4 } },
    // «Si no responde» cuando los puntos se apagan; «puedes recuperar» cuando la moneda sale del candado
    { id: 'L4', inicio: 8.93, fin: 12.05, texto: 'Si no responde, puedes recuperar tus créditos.', direccion: 'Tranquila, que dé confianza. Peso en «recuperar».',
      toma: 'L4-1-si-no-responde-puedes-recuperar-tus-creditos.mp3', ancla: { b: EV.silencio, s: 0.3 } },
  ],
};
export const lineasVoz = v => [...LOCUCION[v], ...LOCUCION.comun].map(l => ({ ...l, texto: l.texto.replace('__CTA__', ctaTexto()) }));

// ---------- materiales y controles ----------
// Las capturas reales del anuncio para agentes, en el orden en que las usa la película (no se copian).
export const CAPTURAS = ['agente-1-marketplace.png', 'agente-2-detalle.png', 'agente-3-confirmar.png', 'agente-4-lead.png'].map(n => '../reel-agentes/capturas/' + n);

// Impactos que control.mjs mide en el video (rastrea el verde claro: aquí, el agente entero): [nombre, beat].
export const CONTROL = {
  impactos: { A: [['el punto aterriza: es la cabeza del agente', EV.cabeza[1]], ...EV.saltos.slice(1).map(b => ['salto del agente', b])] },
};

// Momentos de la hoja a tamaño de teléfono (revision/movil-1a1.jpg): [variante, segundo].
export const REVISION = { movil: [['A', 1.6], ['A', 4.8], ['A', 6.0], ['A', 7.3], ['A', 9.3], ['A', 11.7], ['A', 13.9], ['A', 18.5]] };

// Tabla de eventos del guion técnico: [nombre, beat o lista de beats, imagen, sonido].
export const EVENTOS = [
  ['Clientes', EV.leads, 'cada cliente cae en su lugar y le brota la burbuja de lo que busca', 'madera grave + burbuja'],
  ['Agente', EV.cabeza, 'el cuerpo claro brota y el punto cae sobre él: es la cabeza', 'caída + marimba re (la voz del punto)'],
  ['Saltos', EV.saltos, 'el agente pasa saltando frente a los clientes', 'marimba en escala'],
  ['Burbuja', EV.burbuja, 'la burbuja del elegido sube y se abre en la app real', 'barrido brillante'],
  ['Pasos', EV.pasos, 'qué busca · su presupuesto · tú eliges · desbloqueas · protección · contactas', 'marimba por paso'],
  ['Candados', EV.candados, 'a cada cliente le aparece un candado', 'tres clics'],
  ['Moneda', [EV.lanza, EV.entra, EV.abre], 'la moneda sale de la mano, gira, entra en el candado y lo abre', 'moneda + clic + marimba'],
  ['No contesta', [EV.espera, EV.silencio], '«…» y se apaga', 'tres toques suaves + tono que se apaga'],
  ['Vuelve', EV.vuelve, 'la moneda sale del candado y vuelve a la mano', 'moneda al revés'],
  ['Otra vez', [EV.lanza2, EV.entra2, EV.abre2], 'la misma moneda abre al otro cliente', 'moneda + clic'],
  ['Responde', EV.responde, 'globo de chat y un salto', 'marimba la'],
  ['Al centro', EV.acercan, 'los otros se apartan; los dos saltan al centro y la cámara se acerca', 'pasos + subida'],
  ['Se juntan', EV.junta, 'saltan y los brazos se juntan en el vértice: el techo', 'acorde re mayor + grave'],
  ['Ventana', EV.ventanas, 'la app baja y se vuelve la ventana, cuadro a cuadro', 're–fa#–la–re'],
  ['CTA', EV.cta, 'sube el botón «Regístrate gratis»', 'firma sonora: la'],
  ['Nota', EV.nota, 'sube «Para agentes e inmobiliarias»', '—'],
  ['Nombre', EV.nombre, 'el logo se acomoda y sube el nombre', 'firma sonora: fa# + campana'],
  ['Empujes', EV.empujes, 'la flecha del botón empuja', 'clic suave'],
];
