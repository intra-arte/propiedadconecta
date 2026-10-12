// La marca Propiedad Conecta, fija para todos los anuncios: formato, zonas seguras, colores y logo.
export const W = 1080, H = 1920, CX = 540;
// Zonas seguras para Reels y Stories: todo texto y el logo dentro de este rectángulo.
export const SEGURA = { x0: 65, x1: 1015, y0: 270, y1: 1248 };
// Marfil y verdes muestreados del logo original (cabeza clara #4C9F2D, nombre #142A22).
export const IVORY = '#F9FAF5', INK = '#142A22', LEAF = '#4C9F2D', DEEP = '#0E2219', CARD = '#183A2C';
export const ink = a => `rgba(20,42,34,${a})`, ivo = a => `rgba(249,250,245,${a})`;
// El logo original se lee siempre del archivo: sin copias, sin retoques, sin escala no uniforme.
// La ruta es desde la carpeta anuncios/ (la raíz que sirve el render).
export const LOGO = {
  url: '/reel-publica-tu-busqueda/marca/logo-horizontal-transparente.png',
  w: 1208, h: 431,                                  // tamaño del PNG
  contenido: { x0: 72, y0: 73, x1: 1135, y1: 357 }, // lo que no es transparente: 1064 × 285 px
  cabeza: { x: 319.5, y: 108.5, r: 36 },            // la cabeza verde clara: donde aterriza el punto
  isotipoX1: 393,                                   // borde derecho del isotipo
  corte: 425,                                       // a la izquierda el isotipo, a la derecha el nombre
};
