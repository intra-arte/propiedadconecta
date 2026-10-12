// Un solo comando para producir un anuncio de Propiedad Conecta con el motor.
//
//   node anuncios/motor/anuncio.mjs nuevo <carpeta>             crea un anuncio nuevo a partir del ejemplo
//   node anuncios/motor/anuncio.mjs <paso> <carpeta> [opciones]  corre un paso sobre un anuncio
//
// pasos: voz · musica · beats · textos · hoja · render · control · revision · todo · probar
//   todo     voz → música → beats → textos → render A y B → controles A y B → hojas de revisión
//   hoja     hoja de contactos (pasa las opciones a render.mjs: --v, --desde, --hasta, --paso, --rev, --muestras…)
//   render   videos A y B (o solo --v X)
//   revision hojas de revisión sacadas de los MP4 finales (cada 1 s, voz sobre imagen, teléfono 1:1)
//   probar   regenera el ejemplo y lo compara con las huellas del anuncio aprobado (referencia.json)
import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const MOTOR = dirname(fileURLToPath(import.meta.url)), ANUNCIOS = dirname(MOTOR), H = join(MOTOR, 'herramientas');
const EJEMPLO = join(MOTOR, 'ejemplo-publica-lo-que-buscas');
const [paso, carpeta, ...resto] = process.argv.slice(2);
const AYUDA = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n');
if (!paso || paso === 'ayuda' || (paso !== 'probar' && !carpeta)) { console.log(AYUDA); process.exit(paso ? 0 : 1); }

const correr = (herramienta, dir, extra = []) => {
  const r = spawnSync(process.execPath, [join(H, herramienta), '--anuncio', dir, ...extra], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\n✗ falló ${herramienta} ${extra.join(' ')}`); process.exit(r.status || 1); }
};
const guion = async dir => import(pathToFileURL(join(dir, 'guion.js')).href);
const variantes = () => (resto.includes('--v') ? [resto[resto.indexOf('--v') + 1]] : ['A', 'B']);
const sinV = () => resto.filter((a, i) => a !== '--v' && resto[i - 1] !== '--v');

if (paso === 'nuevo') {
  const dir = resolve(carpeta);
  if (!dir.startsWith(ANUNCIOS + '/')) { console.error('El anuncio tiene que estar dentro de anuncios/ (la carpeta que sirve el render).'); process.exit(1); }
  if (existsSync(dir)) { console.error(`Ya existe ${dir}: no se sobrescribe nada.`); process.exit(1); }
  const slug = relative(ANUNCIOS, dir).split('/').pop();
  mkdirSync(join(dir, 'capturas'), { recursive: true }); mkdirSync(join(dir, 'locucion', 'tomas'), { recursive: true });
  // parte del ejemplo para empezar desde algo que ya renderiza; sus materiales siguen apuntando al original
  const material = relative(dir, join(ANUNCIOS, 'reel-publica-tu-busqueda', 'motion-v1')) + '/';
  let g = readFileSync(join(EJEMPLO, 'guion.js'), 'utf8');
  g = g.replace(/^export const TITULO = .*$/m, `export const TITULO = 'Propiedad Conecta · ${slug} (en desarrollo)';`)
    .replace(/^export const ARCHIVO = '[^']*';/m, `export const ARCHIVO = 'propiedad-conecta-${slug}';`)
    .replace(/^const MATERIAL = .*$/m, `const MATERIAL = '${material}'; // PROVISIONAL: materiales del ejemplo hasta que lleguen los propios`);
  writeFileSync(join(dir, 'guion.js'), g);
  for (const f of ['pelicula.js', 'partitura.mjs', 'beats.json']) writeFileSync(join(dir, f), readFileSync(join(EJEMPLO, f)));
  writeFileSync(join(dir, 'capturas', 'LEEME.md'), '# Capturas\n\nCapturas reales de producto, sin retocar. Anotar aquí qué muestra cada una, su origen, su resolución y su desplazamiento medido en la página.\n');
  writeFileSync(join(dir, 'locucion', 'tomas', 'LEEME.md'), '# Tomas de voz\n\nTomas entregadas, sin editar, con nombres que empiezan por su línea (L1-…, LB1-…). Anotar origen, formato, duración de voz y SHA-256.\n');
  writeFileSync(join(dir, 'README.md'), `# ${slug}\n\nAnuncio de Propiedad Conecta hecho con el motor (\`anuncios/motor/\`) y la fórmula (\`anuncios/FORMULA.md\`).\n\n**Estado:** recién creado a partir del ejemplo. Todavía es «Publica lo que buscas»: hay que cambiar el guion, la película y la partitura.\n\n\`\`\`sh\nnode anuncios/motor/anuncio.mjs todo ${relative(process.cwd(), dir) || '.'}\n\`\`\`\n`);
  console.log(`creado ${relative(process.cwd(), dir)}/ (copia del ejemplo). Siguiente: cambiar guion.js, pelicula.js y partitura.mjs.`);
  process.exit(0);
}

if (paso === 'probar') {
  const ref = JSON.parse(readFileSync(join(EJEMPLO, 'referencia.json'), 'utf8'));
  correr('voz.mjs', EJEMPLO); correr('musica.mjs', EJEMPLO);
  let fallos = 0;
  for (const [k, h] of Object.entries(ref.audio)) {
    const ok = createHash('sha256').update(readFileSync(join(EJEMPLO, 'salida', k + '.wav'))).digest('hex') === h;
    console.log(`${ok ? '✓' : '✗'} audio ${k}`); if (!ok) fallos++;
  }
  for (const f of ref.fotogramas) {
    correr('render.mjs', EJEMPLO, ['--en', String(f.t), '--v', f.v, '--muestras', String(f.muestras ?? ref.muestras), ...(f.rev ? ['--rev'] : [])]);
    const png = join(EJEMPLO, 'salida', `fotograma-${f.v}${f.rev ? '-rev' : ''}-${f.t.toFixed(3)}.png`);
    const ok = execFileSync('identify', ['-format', '%#', png]).toString().trim() === f.firma;
    console.log(`${ok ? '✓' : '✗'} fotograma ${f.v}${f.rev ? ' (revisión)' : ''} ${f.t} s`); if (!ok) fallos++;
  }
  console.log(fallos ? `\n✗ ${fallos} diferencias con el anuncio aprobado` : '\n✓ el motor reproduce el anuncio aprobado sin diferencias');
  process.exit(fallos ? 1 : 0);
}

const dir = resolve(carpeta);
if (!existsSync(join(dir, 'guion.js'))) { console.error(`No hay guion.js en ${dir}`); process.exit(1); }
const { ARCHIVO } = await guion(dir);
const pasos = {
  voz: () => correr('voz.mjs', dir),
  musica: () => correr('musica.mjs', dir),
  beats: () => { correr('medir-beats.mjs', dir, ['A']); correr('medir-beats.mjs', dir, ['B']); },
  textos: () => correr('generar-textos.mjs', dir),
  hoja: () => correr('render.mjs', dir, ['--hoja', ...resto]),
  render: () => { for (const v of variantes()) correr('render.mjs', dir, ['--v', v, ...sinV()]); },
  control: () => { for (const v of variantes()) correr('control.mjs', dir, [join('salida', `${ARCHIVO}-${v}.mp4`), v]); },
  revision: () => correr('revision.mjs', dir),
};
pasos.todo = () => { for (const p of ['voz', 'musica', 'beats', 'textos', 'render', 'control', 'revision']) pasos[p](); };
if (!pasos[paso]) { console.error(`paso desconocido: ${paso}\n`); console.log(AYUDA); process.exit(1); }
pasos[paso]();
