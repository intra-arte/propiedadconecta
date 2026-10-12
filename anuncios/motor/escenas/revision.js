// Capa de revisión (?rev=1): zona segura y, arriba, versión, segundo, beat y escena actual.
import { mono } from '../nucleo/dibujo.js';
import { SEGURA } from '../nucleo/marca.js';
import { B, BT, VAR } from '../nucleo/reloj.js';

export function dibujarRevision(ctx, t, escenas, etiqueta) {
  ctx.save();
  ctx.setLineDash([14, 10]); ctx.strokeStyle = 'rgba(226,61,40,0.9)'; ctx.lineWidth = 3;
  ctx.strokeRect(SEGURA.x0, SEGURA.y0, SEGURA.x1 - SEGURA.x0, SEGURA.y1 - SEGURA.y0); ctx.setLineDash([]);
  const sc = escenas.find(s => t >= B(s.b0) && t < B(s.b1)) || escenas[escenas.length - 1];
  ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, 1080, 150);
  mono(ctx, `${etiqueta} · ${VAR} · ${t.toFixed(2).replace('.', ',')} s · beat ${((t - BT[0]) / (BT[1] - BT[0])).toFixed(2)}`, 40, 62, 34, '#fff', 'left', 600);
  mono(ctx, `${sc.id} · ${sc.nombre}`, 40, 115, 32, '#c8f0b0');
  ctx.restore();
}
