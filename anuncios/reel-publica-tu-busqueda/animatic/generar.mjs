#!/usr/bin/env node
/*
 * Genera todo lo que depende de los tiempos a partir de linea-de-tiempo.js:
 *   ../subtitulos/version-a.srt y version-b.srt
 *   ../locucion/guion-locucion.txt
 *   tabla-de-tiempos.md
 *   salida/ → animatics MP4, hojas de contactos, vista móvil del cierre e informe de control de calidad
 *
 * Uso:  node generar.mjs                 (todo)
 *       node generar.mjs --solo-textos   (sin video)
 * Video: requiere Playwright con Chromium, ffmpeg e ImageMagick.
 */
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(DIR, '..');
const SALIDA = path.join(DIR, 'salida');
const LINEA = require('./linea-de-tiempo.js');
const SOLO_TEXTOS = process.argv.includes('--solo-textos');
const VERSIONES = ['A', 'B'];

const coma = (n, d = 2) => n.toFixed(d).replace('.', ',');
const escribir = (ruta, texto) => { fs.mkdirSync(path.dirname(ruta), { recursive: true }); fs.writeFileSync(ruta, texto); console.log('  escrito', path.relative(RAIZ, ruta)); };

// ---------- sílabas y ritmo ----------
// Conteo fonético simple del español: diptongos juntos, hiatos separados,
// «qu/gu» + e/i sin la u. No une vocales entre palabras, así que cuenta de más:
// el ritmo real será igual o más tranquilo que el medido.
const VOCALES = 'aeiouáéíóúü', DEBILES = 'iuü';
function silabasPalabra(p) {
  p = p.replace(/qu(?=[eiéí])/g, 'q').replace(/gu(?=[eiéí])/g, 'g');
  if (p === 'y') return 1;
  p = p.replace(/y$/, 'i');
  let n = 0, previa = '';
  for (const c of p) {
    if (VOCALES.includes(c)) {
      if (!(previa && (DEBILES.includes(c) || DEBILES.includes(previa)))) n++;
      previa = c;
    } else previa = '';
  }
  return Math.max(n, 1);
}
const palabras = t => t.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, ' ').split(/\s+/).filter(Boolean);
const silabas = t => palabras(t).reduce((s, p) => s + silabasPalabra(p), 0);
function ritmo(v) {
  const sil = silabas(v.texto), dur = v.fin - v.inicio, sps = sil / dur;
  const juicio = sps <= LINEA.ritmo.natural ? 'natural' : sps <= LINEA.ritmo.agil ? 'ágil' : 'ACELERADO';
  return { sil, dur, sps, juicio, palabras: palabras(v.texto).length };
}

// ---------- subtítulos ----------
function tc(s) {
  const ms = Math.round(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
}
function bloquesSRT(L) {
  return L.locucion.flatMap(v => v.bloques.map(b => ({ ...b, linea: v.id, quemar: !!v.quemar })))
    .sort((a, b) => a.inicio - b.inicio).map((b, i) => ({ ...b, n: i + 1 }));
}
const srt = L => bloquesSRT(L).map(b => `${b.n}\n${tc(b.inicio)} --> ${tc(b.fin)}\n${b.texto}\n`).join('\n');
const quemados = L => bloquesSRT(L).filter(b => b.quemar).map(b => b.n);
function rangos(ns) {
  const out = [];
  for (const n of ns) { const u = out[out.length - 1]; if (u && n === u[1] + 1) u[1] = n; else out.push([n, n]); }
  return out.map(([a, b]) => a === b ? `${a}` : `${a}–${b}`).join(', ') || '—';
}

// ---------- textos de producción ----------
function guionLocucion() {
  const A = LINEA.armar('A'), B = LINEA.armar('B');
  const linea = v => {
    const r = ritmo(v);
    return `[${coma(v.inicio)}–${coma(v.fin)}]  ${v.texto}\n               (${v.direccion} · ${r.sil} sílabas en ${coma(r.dur)} s = ${coma(r.sps, 1)} síl./s, ${r.juicio})`;
  };
  return `PROPIEDAD CONECTA — Reel «Publica tu búsqueda» — Locución del animatic ${LINEA.version} (${coma(LINEA.duracion, 1)} s)
Generado desde animatic/linea-de-tiempo.js con «node generar.mjs». No editar a mano.

Voz femenina, 25–35 años, cálida y conversacional, como una amiga que da
un consejo práctico. Acento quiteño suave o latinoamericano neutro.
Sin tono de locutor de radio. Grabación seca, 48 kHz / 24 bit, 3 tomas por línea.
Los tiempos marcan dónde empieza y termina cada línea dentro del video.
Ritmo: hasta ${coma(LINEA.ritmo.natural, 1)} sílabas por segundo suena tranquilo; más de ${coma(LINEA.ritmo.agil, 1)} se oye apurado.

Voz guía para el animatic: basta grabarla con el celular leyendo este texto
sobre el video (sin música), de corrido y a ritmo natural.

==============================================================
VERSIÓN A (principal)
==============================================================

${A.locucion.map(linea).join('\n\n')}

==============================================================
VERSIÓN B (prueba A/B) — solo cambian las tres primeras líneas
==============================================================

${LINEA.ganchos.B.locucion.map(linea).join('\n\n')}

Desde [${coma(LINEA.comun.locucion[0].inicio)}] sigue igual que la versión A.
`;
}

function textoEnPantalla(L, e) {
  const t = [];
  for (const el of e.elementos) {
    if (el.tipo === 'titular') t.push(`Titular «${el.texto}»`);
    else if (el.tipo === 'burbuja') t.push(`Burbuja «${el.texto}»`);
    else if (el.tipo === 'anuncios') t.push('Anuncios genéricos «NO DISPONIBLE»');
    else if (el.tipo === 'pendiente') t.push(`${el.clase === 'confirmar' ? 'POR CONFIRMAR' : 'CAPTURA PENDIENTE'}: ${el.que}`);
    else if (el.tipo === 'cartel') t.push('Cartel «SE ARRIENDA» → «BUSCO DEPA»');
    else if (el.tipo === 'logo') t.push('Logo');
    else if (el.tipo === 'boton') t.push(`Botón «${el.texto} →»`);
  }
  for (const v of L.locucion) if (v.quemar && v.inicio >= e.inicio && v.inicio < e.fin) t.push(`Subtítulo «${v.texto}»`);
  return t.join(' · ') || '—';
}

function tablaTiempos() {
  const filasEsc = L => L.escenas.map(e =>
    `| ${e.id} ${e.nombre} | ${coma(e.inicio, 1)} | ${coma(e.fin, 1)} | ${coma(e.fin - e.inicio, 1)} | ${e.fuente} | ${textoEnPantalla(L, e)} | ${e.salida.texto} |`).join('\n');
  const filasVoz = L => L.locucion.map(v => {
    const r = ritmo(v);
    return `| ${v.id} | ${coma(v.inicio)} | ${coma(v.fin)} | ${v.texto} | ${r.sil} | ${coma(r.sps, 1)} | ${r.juicio} | ${v.mostrar} |`;
  }).join('\n');
  const A = LINEA.armar('A'), B = LINEA.armar('B');
  const gB = { escenas: LINEA.ganchos.B.escenas, locucion: LINEA.ganchos.B.locucion };
  const fin = Math.max(...A.locucion.map(v => v.fin));
  return `# Tabla de tiempos definitiva — animatic ${LINEA.version}

Generada desde [linea-de-tiempo.js](linea-de-tiempo.js) con \`node generar.mjs\`. **No editar a mano:** cambiar la línea de tiempo y volver a generar.

**Duración: ${coma(LINEA.duracion, 1)} s exactos** · ${LINEA.fps} fps · ${Math.round(LINEA.duracion * LINEA.fps)} frames · ${LINEA.ancho} × ${LINEA.alto}. La voz termina en ${coma(fin)} s; los últimos ${coma(LINEA.duracion - fin, 1)} s son el cierre sin voz.

## Versión A — escenas

| Escena | Inicio (s) | Fin (s) | Duración (s) | Fuente | Texto en pantalla | Salida |
|---|---|---|---|---|---|---|
${filasEsc(A)}

## Versión A — locución

Ritmo: «natural» ≤ ${coma(LINEA.ritmo.natural, 1)} sílabas/s · «ágil» ≤ ${coma(LINEA.ritmo.agil, 1)} · más rápido = acelerado.

| Línea | Inicio (s) | Fin (s) | Texto | Sílabas | Síl./s | Ritmo | En pantalla como |
|---|---|---|---|---|---|---|---|
${filasVoz(A)}

**Subtítulos que se queman:** bloques ${rangos(quemados(A))} de \`subtitulos/version-a.srt\`. El resto de la voz ya aparece como titular, burbuja, marcador de captura o logo.

## Versión B — lo que cambia (0,0–${coma(LINEA.comunDesde, 1)} s)

Desde ${coma(LINEA.comunDesde, 1)} s, B es idéntica a A: las mismas escenas y la misma locución salen del mismo bloque de la línea de tiempo.

| Escena | Inicio (s) | Fin (s) | Duración (s) | Fuente | Texto en pantalla | Salida |
|---|---|---|---|---|---|---|
${filasEsc(gB)}

| Línea | Inicio (s) | Fin (s) | Texto | Sílabas | Síl./s | Ritmo | En pantalla como |
|---|---|---|---|---|---|---|---|
${filasVoz(gB)}

**Subtítulos que se queman en B:** bloques ${rangos(quemados(B))} de \`subtitulos/version-b.srt\`.
`;
}

// ---------- control de calidad de la línea de tiempo ----------
function revisarLinea() {
  const avisos = [];
  for (const V of VERSIONES) {
    const L = LINEA.armar(V);
    let fin = 0;
    for (const e of L.escenas) {
      if (Math.abs(e.inicio - fin) > 1e-6) avisos.push(`${V}: hueco o solape antes de ${e.id}`);
      fin = e.fin;
      for (const el of e.elementos) {
        const min = el.tipo === 'titular' ? 1.5 : 0.8;
        if (el.fin - el.inicio < min - 1e-6) avisos.push(`${V}: ${e.id} ${el.tipo} dura ${coma(el.fin - el.inicio)} s (< ${coma(min, 1)})`);
      }
    }
    if (Math.abs(fin - LINEA.duracion) > 1e-6) avisos.push(`${V}: las escenas terminan en ${fin} s`);
    let previa = null;
    for (const v of L.locucion) {
      if (previa && v.inicio < previa.fin) avisos.push(`${V}: ${v.id} se solapa con ${previa.id}`);
      if (v.fin > LINEA.duracion - 1) avisos.push(`${V}: ${v.id} termina a menos de 1 s del final`);
      if (ritmo(v).juicio === 'ACELERADO') avisos.push(`${V}: ${v.id} acelerada (${coma(ritmo(v).sps, 1)} síl./s)`);
      for (const b of v.bloques) {
        if (b.fin - b.inicio < 0.8 - 1e-6) avisos.push(`${V}: bloque «${b.texto}» < 0,8 s`);
        if (v.quemar && b.texto.length > 32) avisos.push(`${V}: subtítulo «${b.texto}» > 32 caracteres`);
      }
      previa = v;
    }
  }
  return avisos;
}

// ---------- contraste ----------
function luminancia(hex) {
  const c = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contraste = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// ---------- render ----------
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.ttf': 'font/ttf', '.webp': 'image/webp' };
function servidor() {
  const srv = http.createServer((req, res) => {
    const ruta = path.join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!ruta.startsWith(RAIZ) || !fs.existsSync(ruta) || fs.statSync(ruta).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TIPOS[path.extname(ruta)] || 'application/octet-stream' });
    fs.createReadStream(ruta).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

function ventanasTransicion(L) {
  return L.escenas.filter(e => ['chevron', 'zoom', 'deslizar'].includes(e.salida.tipo)).map(e => [e.fin - 0.3, e.fin + 0.35]);
}

async function renderizar(navegador, puerto, version, modo, archivo, muestras) {
  const pagina = await navegador.newPage({ viewport: { width: LINEA.ancho, height: LINEA.alto } });
  await pagina.goto(`http://127.0.0.1:${puerto}/animatic/animatic.html?captura=1&version=${version}&modo=${modo}`);
  await pagina.waitForFunction(() => window.LISTO);
  const listo = await pagina.evaluate(() => window.LISTO);
  if (!listo.fuente) throw new Error('La tipografía Outfit no cargó');

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(LINEA.fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(LINEA.fps),
    '-movflags', '+faststart', archivo], { stdio: ['pipe', 'inherit', 'inherit'] });
  const terminado = new Promise((ok, mal) => ff.on('close', c => c === 0 ? ok() : mal(new Error('ffmpeg ' + c))));

  const L = LINEA.armar(version);
  const ventanas = ventanasTransicion(L);
  const fueraDeZona = [];
  const Z = LINEA.zonaSegura, x0 = Z.lados, x1 = LINEA.ancho - Z.lados, y0 = Z.arriba, y1 = LINEA.alto - Z.abajo;
  const N = Math.round(LINEA.duracion * LINEA.fps);
  let medidasCierre = null;
  for (let f = 0; f < N; f++) {
    const t = f / LINEA.fps;
    await pagina.evaluate(x => window.dibujar(x), t);
    const png = await pagina.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (muestras && muestras.has(f)) muestras.set(f, png);
    if (modo === 'prueba' && f % 3 === 0 && !ventanas.some(([a, b]) => t >= a && t <= b)) {
      for (const c of await pagina.evaluate(() => window.medir())) {
        if (c.x0 < x0 - 0.5 || c.x1 > x1 + 0.5 || c.y0 < y0 - 0.5 || c.y1 > y1 + 0.5) fueraDeZona.push({ t, ...c });
      }
    }
    if (modo === 'prueba' && Math.abs(t - 21.5) < 1e-6) medidasCierre = await pagina.evaluate(() => window.medirLogoYBoton());
  }
  ff.stdin.end();
  await terminado;
  await pagina.close();
  console.log('  video', path.relative(RAIZ, archivo));
  return { fueraDeZona, medidasCierre };
}

function sonda(archivo) {
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_frames',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_read_frames:format=duration,size', '-of', 'json', archivo]));
  const s = j.streams[0];
  return { ancho: s.width, alto: s.height, fps: s.r_frame_rate, frames: +s.nb_read_frames, duracion: +j.format.duration, mb: +j.format.size / 1e6 };
}

function medirLogoEnVideo(archivo, tmp) {
  // Recorta la zona del logo en un frame del cierre y mide su contenido contra el archivo original.
  const frame = path.join(tmp, 'cierre.png');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '21.5', '-i', archivo, '-frames:v', '1', frame]);
  const medir = (args) => execFileSync('convert', args).toString().trim().split(' ').map(Number);
  const [wv, hv] = medir([frame, '-crop', '1080x400+0+560', '+repage', '-fuzz', '8%', '-trim', '-format', '%w %h', 'info:']);
  const [wo, ho] = medir([path.join(RAIZ, 'marca/logo-horizontal-fondo-marfil.png'), '-fuzz', '8%', '-trim', '-format', '%w %h', 'info:']);
  return { frame, wv, hv, wo, ho, ratioVideo: wv / hv, ratioOriginal: wo / ho, desvio: Math.abs((wv / hv) / (wo / ho) - 1) };
}

async function video() {
  const { chromium } = require('playwright');
  fs.mkdirSync(SALIDA, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'animatic-'));
  const srv = await servidor();
  const puerto = srv.address().port;
  const navegador = await chromium.launch();
  const trabajos = [
    { version: 'A', modo: 'prueba', archivo: 'animatic-A-v0.mp4' },
    { version: 'A', modo: 'revision', archivo: 'animatic-A-v0-revision.mp4' },
    { version: 'B', modo: 'revision', archivo: 'animatic-B-v0-revision.mp4' },
  ];
  const resultados = {};
  for (const j of trabajos) {
    const L = LINEA.armar(j.version);
    const muestras = new Map(L.escenas.map(e => [Math.round((e.inicio + 0.75 * (e.fin - e.inicio)) * LINEA.fps), null]));
    const r = await renderizar(navegador, puerto, j.version, j.modo, path.join(SALIDA, j.archivo), j.modo === 'revision' ? muestras : null);
    resultados[j.archivo] = { ...r, sonda: sonda(path.join(SALIDA, j.archivo)) };
    if (j.modo === 'revision') {
      const args = [];
      L.escenas.forEach((e, i) => {
        const f = path.join(tmp, `${j.version}-${i}.png`);
        fs.writeFileSync(f, [...muestras.values()][i]);
        args.push('-label', `${e.id} · ${e.nombre} · ${coma(e.inicio, 1)}–${coma(e.fin, 1)} s`, f);
      });
      const hoja = path.join(SALIDA, `hoja-de-contactos-${j.version}.jpg`);
      execFileSync('montage', ['-font', 'DejaVu-Sans', '-pointsize', '20', '-fill', 'white', '-background', '#1b1b1b',
        ...args, '-tile', `${Math.min(4, L.escenas.length)}x`, '-geometry', '360x640+10+10', '-quality', '85', hoja]);
      console.log('  hoja', path.relative(RAIZ, hoja));
    }
  }
  await navegador.close();
  srv.close();

  const principal = path.join(SALIDA, 'animatic-A-v0.mp4');
  const logo = medirLogoEnVideo(principal, tmp);
  execFileSync('convert', [logo.frame, '-resize', '390x693', path.join(SALIDA, 'cierre-en-movil.png')]);
  return { resultados, logo };
}

function informe({ resultados, logo }, avisos) {
  const A = LINEA.armar('A');
  const r = resultados['animatic-A-v0.mp4'];
  const m = r.medidasCierre;
  const b = m.boton;
  const escala = m.logo.w / m.logo.natW, escalaV = m.logo.h / m.logo.natH;
  const finVoz = Math.max(...A.locucion.map(v => v.fin));
  const totalSil = A.locucion.reduce((s, v) => s + ritmo(v).sil, 0);
  const totalPal = A.locucion.reduce((s, v) => s + ritmo(v).palabras, 0);
  const pendientes = V => LINEA.armar(V).escenas.flatMap(e => e.elementos.filter(el => el.tipo === 'pendiente').map(el => `${e.id}: ${el.clase === 'confirmar' ? 'POR CONFIRMAR' : 'CAPTURA PENDIENTE'} · ${el.que}`));
  const ok = c => c ? 'OK' : '**REVISAR**';
  return `# Informe de control de calidad — animatic ${LINEA.version}

Generado por \`node generar.mjs\`.

## Archivos

| Archivo | Resolución | fps | Frames | Duración (s) | Tamaño |
|---|---|---|---|---|---|
${Object.entries(resultados).map(([n, x]) => `| ${n} | ${x.sonda.ancho} × ${x.sonda.alto} | ${x.sonda.fps} | ${x.sonda.frames} | ${coma(x.sonda.duracion, 3)} | ${coma(x.sonda.mb, 1)} MB |`).join('\n')}

## Línea de tiempo

${avisos.length ? avisos.map(a => `- **${a}**`).join('\n') : '- Sin huecos ni solapes entre escenas o líneas de voz; todas las líneas por debajo del umbral de ritmo; bloques de texto ≥ 0,8 s y titulares ≥ 1,5 s.'}
- Versión A: ${totalPal} palabras, ${totalSil} sílabas. La voz termina en ${coma(finVoz)} s y deja ${coma(LINEA.duracion - finVoz, 1)} s de cierre sin voz.

## Zonas seguras (versión A, una muestra cada 0,1 s fuera de transiciones)

${r.fueraDeZona.length ? r.fueraDeZona.slice(0, 20).map(c => `- **${coma(c.t)} s · ${c.qa} «${c.texto}»** fuera de zona: x ${Math.round(c.x0)}–${Math.round(c.x1)}, y ${Math.round(c.y0)}–${Math.round(c.y1)}`).join('\n') : `- OK: titulares, burbujas, marcadores, subtítulos, logo y botón quedan dentro de x ${LINEA.zonaSegura.lados}–${LINEA.ancho - LINEA.zonaSegura.lados} px e y ${LINEA.zonaSegura.arriba}–${LINEA.alto - LINEA.zonaSegura.abajo} px.`}
- El bloque «IMAGEN POR PRODUCIR» va a propósito en la franja inferior: es una nota del animatic y no existe en el anuncio final.

## Logo

- Archivo: \`marca/logo-horizontal-transparente.png\`, ${m.logo.natW} × ${m.logo.natH} px.
- En el cierre: ${coma(m.logo.w, 1)} × ${coma(m.logo.h, 1)} px → escala horizontal ${coma(escala * 100, 2)} % y vertical ${coma(escalaV * 100, 2)} % (${ok(Math.abs(escala - escalaV) < 0.001)}: escala uniforme; ${ok(escala <= 1)}: no supera el 100 %).
- Medido en el MP4 exportado (frame de 21,5 s): contenido del logo ${logo.wv} × ${logo.hv} px, proporción ${coma(logo.ratioVideo, 3)}; en el archivo original ${logo.wo} × ${logo.ho} px, proporción ${coma(logo.ratioOriginal, 3)}. Desvío ${coma(logo.desvio * 100, 2)} % (${ok(logo.desvio < 0.015)}; el margen cubre el redondeo de bordes al codificar).
- Posición: x ${Math.round(m.logo.x0)}–${Math.round(m.logo.x1)}, y ${Math.round(m.logo.y0)}–${Math.round(m.logo.y1)}; solo sobre fondo marfil.

## CTA «Publica gratis tu búsqueda»

- Botón de ${Math.round(b.w)} × ${Math.round(b.h)} px, texto Outfit ${b.fontWeight} a ${b.fontSize} px.
- En un celular de 390 pt de ancho (iPhone de 6,1″) el texto se ve a ${coma(b.fontSize * 390 / LINEA.ancho, 1)} pt; en uno de 360 dp, a ${coma(b.fontSize * 360 / LINEA.ancho, 1)} dp. La referencia de texto cómodo en iOS es 17 pt (${ok(b.fontSize * 360 / LINEA.ancho >= 16)}).
- Contraste blanco sobre verde bosque #142A22: ${coma(contraste('#FFFFFF', '#142A22'), 1)}:1 (mínimo AA para texto grande: 3:1; para texto normal: 4,5:1) ${ok(contraste('#FFFFFF', '#142A22') >= 7)}.
- Además, el mismo texto aparece antes como titular en E7 (96 px) mientras la voz lo dice.
- Vista a tamaño de celular: \`salida/cierre-en-movil.png\` (390 × 693 px).

## Marcadores pendientes (no son pantallas reales)

Versión A:
${pendientes('A').map(p => `- ${p}`).join('\n')}

Versión B: los mismos desde ${coma(LINEA.comunDesde, 1)} s.
`;
}

// ---------- principal ----------
console.log('Textos de producción');
for (const V of VERSIONES) escribir(path.join(RAIZ, `subtitulos/version-${V.toLowerCase()}.srt`), srt(LINEA.armar(V)));
escribir(path.join(RAIZ, 'locucion/guion-locucion.txt'), guionLocucion());
escribir(path.join(DIR, 'tabla-de-tiempos.md'), tablaTiempos());
const avisos = revisarLinea();
console.log(avisos.length ? 'Avisos:\n  ' + avisos.join('\n  ') : 'Línea de tiempo sin avisos');
for (const V of VERSIONES) for (const v of LINEA.armar(V).locucion) {
  const r = ritmo(v);
  console.log(`  ${V} ${v.id.padEnd(4)} ${String(r.sil).padStart(2)} síl / ${coma(r.dur)} s = ${coma(r.sps, 1)} (${r.juicio})`);
}

if (!SOLO_TEXTOS) {
  console.log('Video');
  const res = await video();
  escribir(path.join(SALIDA, 'informe-qa.md'), informe(res, avisos));
}
