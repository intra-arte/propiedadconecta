// GUION de «Los dos del logo» — por ahora solo para el storyboard del concepto (CONCEPTO.md).
// Cuando el concepto se apruebe, este archivo pasa a ser la fuente única del anuncio, como en reel-agentes.

export const TITULO = 'Propiedad Conecta · «Los dos del logo» · storyboard';
export const ETIQUETA = 'storyboard';
export const ARCHIVO = 'propiedad-conecta-los-dos-del-logo';
export const BPM = 120;
export const BEATS = 36;
export const DURACION = 10;      // el storyboard: un cuadro clave por segundo

export const PENDIENTE = { gratis: 'confirmado', capturas: 'recibidas', voz: 'pendiente' };
export const CTA = { conGratis: 'Regístrate gratis', sinGratis: 'Regístrate' };
export const ctaTexto = () => (PENDIENTE.gratis === 'no' ? CTA.sinGratis : CTA.conGratis);

// Las mismas capturas reales del anuncio para agentes (sin copiarlas).
export const CAPTURAS = ['agente-1-marketplace.png', 'agente-2-detalle.png', 'agente-3-confirmar.png', 'agente-4-lead.png'].map(n => '../reel-agentes/capturas/' + n);
