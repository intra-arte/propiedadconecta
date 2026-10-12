// Hojas de revisión sacadas de los MP4 finales (no de la vista previa) → revision/ del anuncio:
//   archivo-final-{A,B}-cada-1s.jpg   un fotograma por segundo
//   voz-sobre-imagen-{A,B}.jpg        un fotograma cuando suena cada frase de la voz, con su texto
//   movil-1a1.jpg                     momentos clave a 390 px de ancho, el de un teléfono de 6,1″ (REVISION.movil del guion)
// Uso: node motor/herramientas/revision.mjs --anuncio <carpeta>
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ruta, G, coma } from './comun.mjs';

const { ARCHIVO, DURACION } = G;
const tmp = mkdtempSync(join(tmpdir(), 'revision-'));
mkdirSync(ruta('revision'), { recursive: true });
const mp4 = v => ruta('salida', `${ARCHIVO}-${v}.mp4`);
const cuadro = (v, t, ancho, nombre) => { const png = join(tmp, nombre); execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', mp4(v), '-frames:v', '1', '-vf', `scale=${ancho}:-1`, png]); return png; };
const coloc = existsSync(ruta('locucion', 'colocacion.json')) ? JSON.parse(readFileSync(ruta('locucion', 'colocacion.json'))) : null;

for (const v of ['A', 'B']) {
  if (!existsSync(mp4(v))) { console.log(`sin ${ARCHIVO}-${v}.mp4: se salta`); continue; }
  const cada = [];
  for (let k = 0; k < Math.floor(DURACION); k++) cada.push('-label', `${coma(k + 0.5, 1)} s`, cuadro(v, k + 0.5, 265, `${v}-s${k}.png`));
  execFileSync('montage', [...cada, '-tile', '8x', '-geometry', '265x471+5+5', '-background', '#1e1e1e', '-fill', '#ddd', '-pointsize', '14', ruta('revision', `archivo-final-${v}-cada-1s.jpg`)]);
  if (coloc) {
    const items = [];
    for (const l of coloc[v]) for (const f of l.pendiente ? [{ texto: l.texto + '  (FALTA LA TOMA)', inicio: l.inicio }] : l.frases)
      items.push('-label', `${l.id} · ${coma(f.inicio)} s\n«${f.texto}»`, cuadro(v, f.inicio + 0.2, 360, `${v}-v${items.length}.png`));
    execFileSync('montage', [...items, '-tile', `${Math.min(5, items.length / 3)}x`, '-geometry', '360x640+8+8', '-background', '#1e1e1e', '-fill', '#e8e8e8', '-pointsize', '17', ruta('revision', `voz-sobre-imagen-${v}.jpg`)]);
  }
}
const movil = (G.REVISION && G.REVISION.movil) || [['A', 1.8], ['A', 2.9], ['A', DURACION * 0.4], ['A', DURACION * 0.55], ['A', DURACION - 1.5]];
const disponibles = movil.filter(([v]) => existsSync(mp4(v)));
if (disponibles.length) execFileSync('montage', [...disponibles.map(([v, t], i) => cuadro(v, t, 390, `m${i}.png`)), '-tile', `${disponibles.length}x`, '-geometry', '390x693+4+4', '-background', '#1e1e1e', ruta('revision', 'movil-1a1.jpg')]);
rmSync(tmp, { recursive: true, force: true });
console.log('escritas las hojas de revisión en revision/');
