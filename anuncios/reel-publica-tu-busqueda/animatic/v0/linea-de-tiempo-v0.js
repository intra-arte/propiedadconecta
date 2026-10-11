/*
 * Línea de tiempo del animatic v0: fuente única de tiempos y textos.
 *
 * La leen animatic.html (reproducción y render) y generar.mjs (subtítulos,
 * guion de locución, tabla de tiempos y control de calidad). Para cambiar un
 * tiempo o un texto se edita aquí y se vuelve a ejecutar `node generar.mjs`.
 *
 * Tiempos en segundos. Los ganchos A y B ocupan 0–6,6 s; desde 6,6 s ambas
 * versiones usan exactamente las mismas escenas y la misma locución.
 */
(function (raiz) {
  // E3 es el mismo plano en A y B; solo cambian la voz y el titular.
  const E3 = (titular, resaltar, inicioTitular) => ({
    id: 'E3', nombre: 'Giro', inicio: 4.6, fin: 6.6, mundo: 'dia',
    fuente: 'Clip C02',
    plano: 'A la mañana siguiente, junto a la ventana, toma el celular con decisión y empieza a escribir.',
    camara: 'Push-in lento con un arco leve.',
    salida: { tipo: 'zoom', texto: 'Zoom hacia el celular; la pantalla crece' },
    elementos: [{ tipo: 'titular', texto: titular, resaltar, inicio: inicioTitular, fin: 6.6 }],
  });

  const LINEA = {
    titulo: 'Propiedad Conecta · Reel «Publica tu búsqueda»',
    version: 'v0',
    duracion: 22.0,
    fps: 30,
    ancho: 1080,
    alto: 1920,
    // Zona segura de Reels (cubre Stories): sin texto ni logo fuera de ella.
    zonaSegura: { arriba: 270, abajo: 672, lados: 65 },
    // Sílabas por segundo: hasta «natural» suena tranquilo; hasta «agil», aceptable.
    ritmo: { natural: 5.8, agil: 6.3 },
    comunDesde: 6.6,

    ganchos: {
      A: {
        nombre: 'A · Dolor',
        escenas: [
          {
            id: 'E1', nombre: 'Gancho', inicio: 0, fin: 1.8, mundo: 'noche',
            fuente: 'Clip C01 (primera parte)',
            plano: 'Noche. Daniela, recostada en el sofá, lee el celular con cansancio.',
            camara: 'Dolly-in muy lento hacia su rostro.',
            salida: { tipo: 'continua', texto: 'Sigue el mismo plano' },
            elementos: [
              { tipo: 'titular', texto: '¿Otra vez?', tam: 132, inicio: 0, fin: 1.8 },
              { tipo: 'burbuja', texto: 'Ya se arrendó.', x: 430, y: 690, inicio: 0.2, fin: 2.6, sale: { inicio: 1.9, fin: 2.6 } },
              { tipo: 'burbuja', texto: 'Ese ya se vendió.', x: 360, y: 830, inicio: 0.9, fin: 2.6, sale: { inicio: 1.9, fin: 2.6 } },
            ],
          },
          {
            id: 'E2', nombre: 'Agitación', inicio: 1.8, fin: 4.6, mundo: 'noche',
            fuente: 'Clip C01 (continúa)',
            plano: 'Baja el celular al pecho, apoya la cabeza en el sofá y exhala.',
            camara: 'El push-in termina y se asienta.',
            salida: { tipo: 'chevron', texto: 'Barrido chevrón; entra el beat' },
            elementos: [
              { tipo: 'anuncios', inicio: 1.8, fin: 4.6 },
              { tipo: 'titular', texto: 'Deja de perseguir anuncios por todo Quito.', resaltar: 'perseguir anuncios', inicio: 1.8, fin: 4.6 },
            ],
          },
          E3('Mejor publica tú lo que buscas.', 'tú', 4.75),
        ],
        locucion: [
          {
            id: 'L1', inicio: 0.10, fin: 1.60, texto: '¿Otra vez «ya se arrendó»?',
            mostrar: 'Titular «¿Otra vez?» + burbuja',
            direccion: 'Empática, con media ironía, como quien ya lo vivió.',
            bloques: [{ texto: '¿Otra vez “ya se arrendó”?', inicio: 0.10, fin: 1.60 }],
          },
          {
            id: 'L2', inicio: 1.80, fin: 4.40, texto: 'Deja de perseguir anuncios por todo Quito.',
            mostrar: 'Titular',
            direccion: 'Firme, sin regañar. Peso en «perseguir».',
            bloques: [
              { texto: 'Deja de perseguir anuncios', inicio: 1.80, fin: 3.30 },
              { texto: 'por todo Quito.', inicio: 3.30, fin: 4.40 },
            ],
          },
          {
            id: 'L3', inicio: 4.75, fin: 6.55, texto: 'Mejor publica tú lo que buscas.',
            mostrar: 'Titular',
            direccion: 'Sonrisa en la voz. Peso en «tú».',
            bloques: [{ texto: 'Mejor publica tú lo que buscas.', inicio: 4.75, fin: 6.55 }],
          },
        ],
      },

      B: {
        nombre: 'B · Inversión',
        escenas: [
          {
            id: 'B1', nombre: 'Gancho B', inicio: 0, fin: 2.4, mundo: 'fachada',
            fuente: 'Clip C07 + carteles compuestos en edición',
            plano: 'Ventana de un edificio residencial del norte de Quito con un cartel en blanco (los carteles se componen en edición).',
            camara: 'Trípode, push-in muy lento.',
            salida: { tipo: 'corte', texto: 'Corte directo' },
            elementos: [
              { tipo: 'titular', texto: 'Esta vez, el anuncio lo pones tú.', resaltar: 'tú', inicio: 0, fin: 2.4 },
              { tipo: 'cartel', inicio: 0, fin: 2.4, giro: 0.5 },
            ],
          },
          {
            id: 'B2', nombre: 'Pregunta', inicio: 2.4, fin: 4.6, mundo: 'calle',
            fuente: 'Clip C08',
            plano: 'Daniela camina por una calle arbolada del norte de Quito mirando su celular; levanta la vista, pensativa.',
            camara: 'Gimbal retrocediendo frente a ella.',
            salida: { tipo: 'chevron', texto: 'Barrido chevrón; entra el beat' },
            elementos: [],
          },
          E3('Publica lo que buscas.', null, 4.85),
        ],
        locucion: [
          {
            id: 'LB1', inicio: 0.10, fin: 2.30, texto: 'Esta vez, el anuncio lo pones tú.',
            mostrar: 'Titular',
            direccion: 'Segura, con complicidad. Peso en «tú».',
            bloques: [{ texto: 'Esta vez, el anuncio lo pones tú.', inicio: 0.10, fin: 2.30 }],
          },
          {
            id: 'LB2', inicio: 2.50, fin: 4.45, texto: '¿Vas a comprar o arrendar en Quito?',
            mostrar: 'Subtítulo', quemar: true,
            direccion: 'Pregunta directa y cercana.',
            bloques: [
              { texto: '¿Vas a comprar o arrendar', inicio: 2.50, fin: 3.60 },
              { texto: 'en Quito?', inicio: 3.60, fin: 4.45 },
            ],
          },
          {
            id: 'LB3', inicio: 4.85, fin: 6.25, texto: 'Publica lo que buscas.',
            mostrar: 'Titular',
            direccion: 'Igual que L3 en A.',
            bloques: [{ texto: 'Publica lo que buscas.', inicio: 4.85, fin: 6.25 }],
          },
        ],
      },
    },

    comun: {
      escenas: [
        {
          id: 'E4', nombre: 'Así funciona', inicio: 6.6, fin: 11.6, mundo: 'dia-suave',
          fuente: 'Interfaz real (captura) + clip C03 desenfocado',
          plano: 'Fondo: manos escribiendo en el celular, muy desenfocado.',
          camara: 'Fondo con deriva lenta.',
          salida: { tipo: 'deslizar', texto: 'La búsqueda sale por la derecha y entra en E5' },
          elementos: [
            {
              tipo: 'pendiente', clase: 'captura', y: 300, inicio: 6.6, fin: 11.6, entra: 'crece',
              que: 'Formulario para publicar una búsqueda',
              items: [
                { texto: 'Tipo de propiedad', inicio: 6.9 },
                { texto: 'Ubicación', inicio: 8.2 },
                { texto: 'Presupuesto', inicio: 9.0 },
                { texto: 'Características', inicio: 9.8 },
              ],
              nota: 'Datos según el brief, no rótulos de la app. Rótulos, orden y diseño reales: según la captura.',
            },
            {
              tipo: 'pendiente', clase: 'captura', y: 960, inicio: 10.8, fin: 11.6,
              que: 'Botón para publicar y pantalla que aparece después',
            },
          ],
        },
        {
          id: 'E5', nombre: 'Del otro lado', inicio: 11.6, fin: 14.4, mundo: 'oficina',
          fuente: 'Clip C04 + vista real del agente (captura)',
          plano: 'Un agente inmobiliario, en una oficina luminosa, mira su laptop con interés.',
          camara: 'Push-in lento, plano medio en 3/4.',
          salida: { tipo: 'corte', texto: 'Corte; la vibración de E6 se oye 4 frames antes' },
          elementos: [
            {
              tipo: 'pendiente', clase: 'captura', y: 330, inicio: 11.6, fin: 14.4, entra: 'izquierda',
              que: 'Cómo ve el agente una búsqueda',
              nota: 'Decidir si este lado se muestra en el anuncio.',
            },
            {
              tipo: 'pendiente', clase: 'confirmar', y: 640, inicio: 11.6, fin: 14.4, entra: 'izquierda',
              que: '¿Los agentes ya usan la plataforma hoy?',
              nota: 'Si aún no, cambia la voz «pueden ver tu búsqueda».',
            },
          ],
        },
        {
          id: 'E6', nombre: 'Contacto', inicio: 14.4, fin: 17.0, mundo: 'terraza',
          fuente: 'Clip C05',
          plano: 'En una terraza con vista a la ciudad, su celular vibra sobre la mesa; lo toma y mira la pantalla.',
          camara: 'Plano medio casi estático.',
          salida: { tipo: 'corte', texto: 'Corte en el beat' },
          elementos: [
            {
              tipo: 'pendiente', clase: 'confirmar', y: 330, inicio: 14.4, fin: 17.0,
              que: 'Canal de contacto: llamada, WhatsApp, correo o dentro de la app',
              nota: 'Define si ella contesta o lee un mensaje.',
            },
          ],
        },
        {
          id: 'E7', nombre: 'Alivio + CTA', inicio: 17.0, fin: 19.3, mundo: 'terraza',
          fuente: 'Clip C06 (o stock real de Quito)',
          plano: 'Plano abierto: Daniela, tranquila, con el celular en la mano; Quito y el Pichincha de fondo.',
          camara: 'Pull-back lento con ligera subida.',
          salida: { tipo: 'chevron', texto: 'Barrido chevrón al cierre' },
          elementos: [
            { tipo: 'titular', texto: 'Publica gratis tu búsqueda', resaltar: 'gratis', inicio: 17.25, fin: 19.3 },
          ],
        },
        {
          id: 'E8', nombre: 'Cierre', inicio: 19.3, fin: 22.0, mundo: 'marfil',
          fuente: 'Edición: logo original + botón',
          plano: null,
          camara: null,
          salida: { tipo: 'ninguno', texto: 'El último frame sirve de frame de loop' },
          elementos: [
            { tipo: 'logo', inicio: 19.4, fin: 22.0 },
            { tipo: 'boton', texto: 'Publica gratis tu búsqueda', inicio: 19.9, fin: 22.0, pulso: 21.0 },
          ],
        },
      ],
      locucion: [
        {
          id: 'L4', inicio: 6.90, fin: 11.10, texto: 'Tipo de propiedad, sector, presupuesto… y lo que no puede faltar.',
          mostrar: 'Marcador CAPTURA PENDIENTE (formulario)',
          direccion: 'Lista con ritmo; micro-pausa entre datos.',
          bloques: [
            { texto: 'Tipo de propiedad,', inicio: 6.90, fin: 8.20 },
            { texto: 'sector,', inicio: 8.20, fin: 9.00 },
            { texto: 'presupuesto…', inicio: 9.00, fin: 9.80 },
            { texto: 'y lo que no puede faltar.', inicio: 9.80, fin: 11.10 },
          ],
        },
        {
          id: 'L5', inicio: 11.70, fin: 14.35, texto: 'Agentes inmobiliarios pueden ver tu búsqueda',
          mostrar: 'Subtítulo', quemar: true,
          direccion: 'Clara, informativa.',
          bloques: [
            { texto: 'Agentes inmobiliarios', inicio: 11.70, fin: 12.90 },
            { texto: 'pueden ver tu búsqueda', inicio: 12.90, fin: 14.35 },
          ],
        },
        {
          id: 'L6', inicio: 14.50, fin: 16.90, texto: 'y contactarte si tienen algo para ti.',
          mostrar: 'Subtítulo', quemar: true,
          direccion: 'Tranquila, cercana. No vender de más.',
          bloques: [
            { texto: 'y contactarte', inicio: 14.50, fin: 15.40 },
            { texto: 'si tienen algo para ti.', inicio: 15.40, fin: 16.90 },
          ],
        },
        {
          id: 'L7a', inicio: 17.30, fin: 18.90, texto: 'Publica gratis tu búsqueda…',
          mostrar: 'Titular',
          direccion: 'Directa y cálida. «Gratis» con peso.',
          bloques: [{ texto: 'Publica gratis tu búsqueda', inicio: 17.30, fin: 18.90 }],
        },
        {
          id: 'L7b', inicio: 19.40, fin: 20.70, texto: 'en Propiedad Conecta.',
          mostrar: 'Logo',
          direccion: 'Marca bien clara; coincide con la aparición del logo.',
          bloques: [{ texto: 'en Propiedad Conecta.', inicio: 19.40, fin: 20.70 }],
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
