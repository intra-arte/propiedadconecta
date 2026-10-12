// Hornea Outfit (variable, solo eje wght 100–900) en contornos compatibles punto a punto,
// para interpolar el peso de forma continua en canvas, letra por letra y fotograma a fotograma.
import * as fontkit from 'fontkit';
import { writeFileSync } from 'node:fs';

const font = fontkit.openSync(new URL('../fuentes/Outfit-Variable.ttf', import.meta.url).pathname);
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áéíóúüñÁÉÍÓÚÑı.,;:¿?¡!«»“”"\'-—…·→$/()%+ ';
const WGHT = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const upm = font.unitsPerEm;
const opOf = c => ({ moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' })[c];

const glyphs = {};
for (const ch of CHARS) {
  const g = { ops: null, adv: [], pts: [] };
  for (const w of WGHT) {
    const glyph = font.getVariation({ wght: w }).glyphForCodePoint(ch.codePointAt(0));
    if (!glyph || glyph.id === 0) throw new Error('falta el glifo ' + ch);
    const cmds = glyph.path.commands, ops = cmds.map(c => opOf(c.command)).join('');
    if (g.ops === null) g.ops = ops;
    else if (g.ops !== ops) throw new Error(`contorno incompatible en ${ch} a ${w}`);
    const pts = [];
    for (const c of cmds) for (let i = 0; i < c.args.length; i += 2) pts.push(Math.round((c.args[i] / upm) * 1000), Math.round((-c.args[i + 1] / upm) * 1000));
    g.pts.push(pts);
    g.adv.push(Math.round((glyph.advanceWidth / upm) * 1000));
  }
  glyphs[ch] = g;
}
const v = font.getVariation({ wght: 800 });
const box = ch => v.glyphForCodePoint(ch.codePointAt(0)).bbox;
const out = { wght: WGHT, xHeight: +(box('x').maxY / upm).toFixed(4), capHeight: +(box('H').maxY / upm).toFixed(4), glyphs };
writeFileSync(new URL('../nucleo/glifos.js', import.meta.url), '// generado por hornear-glifos.mjs — no editar\nexport default ' + JSON.stringify(out) + ';\n');
console.log('horneados', Object.keys(glyphs).length, 'glifos ×', WGHT.length, 'pesos · altura x', out.xHeight, '· mayúsculas', out.capHeight);
