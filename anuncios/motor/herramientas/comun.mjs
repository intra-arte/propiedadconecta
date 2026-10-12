// Lo que comparten las herramientas: qué anuncio se trabaja, sus rutas y su guion.
// Cada herramienta trabaja sobre la carpeta del anuncio: --anuncio <carpeta> o, si no, la carpeta actual.
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

export const args = process.argv.slice(2);
export const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
export const flag = k => args.includes('--' + k);
// argumentos sueltos: ni --opción ni el valor de una opción que lo lleva
const SIN_VALOR = new Set(['--rev', '--hoja']);
export const sueltos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !SIN_VALOR.has(args[i - 1])));

export const MOTOR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ANUNCIOS = dirname(MOTOR);           // la raíz que sirve el render
export const DIR = resolve(opt('anuncio', process.cwd()));
if (!existsSync(join(DIR, 'guion.js'))) { console.error(`No hay guion.js en ${DIR}. Usa --anuncio <carpeta del anuncio>.`); process.exit(1); }
export const RUTA_WEB = relative(ANUNCIOS, DIR).split('\\').join('/'); // la carpeta vista desde la raíz del render
export const ruta = (...p) => join(DIR, ...p);
export const G = await import(pathToFileURL(ruta('guion.js')).href);
export const coma = (n, d = 2) => Number(n).toFixed(d).replace('.', ',');
