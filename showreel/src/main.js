// Render contract: window.seek(t) paints frame t. Nothing carries between frames.
// Motion blur = N sub-frames across a 180° shutter, averaged in linear light.
import { draw, setBeats, W, H } from './film.js';

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const sub = document.createElement('canvas');
sub.width = W; sub.height = H;
const sctx = sub.getContext('2d', { willReadFrequently: true });

const toLin = new Uint16Array(256), fromLin = new Uint8ClampedArray(4096);
for (let i = 0; i < 256; i++) { const c = i / 255; toLin[i] = Math.round(4095 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); }
for (let i = 0; i < 4096; i++) { const l = i / 4095; fromLin[i] = Math.round(255 * (l <= 0.0031308 ? l * 12.92 : 1.055 * l ** (1 / 2.4) - 0.055)); }
const acc = new Uint32Array(W * H * 4);
const out = new ImageData(W, H);

window.seek = (t, samples = 1, shutter = 1 / 120) => {
  if (samples <= 1) { draw(ctx, t); return; }
  acc.fill(0);
  for (let k = 0; k < samples; k++) {
    draw(sctx, t + ((k + 0.5) / samples - 0.5) * shutter);
    const d = sctx.getImageData(0, 0, W, H).data;
    for (let i = 0; i < d.length; i++) acc[i] += toLin[d[i]];
  }
  const o = out.data;
  for (let i = 0; i < o.length; i++) o[i] = fromLin[Math.round(acc[i] / samples)];
  ctx.putImageData(out, 0, 0);
};

window.ready = (async () => {
  const beats = await (await fetch('beats.json')).json();
  setBeats(beats);
  await document.fonts.load('500 40px JB');
  await document.fonts.ready;
  return true;
})();

// live preview when opened in a browser: ?t=4.2 for a still, otherwise loop in real time
const q = new URLSearchParams(location.search);
if (!navigator.webdriver) window.ready.then(() => {
  if (q.has('t')) return window.seek(+q.get('t'));
  const t0 = performance.now();
  const loop = () => { window.seek(((performance.now() - t0) / 1000) % 15); requestAnimationFrame(loop); };
  loop();
});
