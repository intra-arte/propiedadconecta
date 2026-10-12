// Estado de un render: cuadrícula de beats medida, variante A/B, modo revisión, logo y capturas.
// Las escenas leen estas variables (enlaces vivos de ES modules); main.js las fija con configure().
export let BT = null, VAR = 'A', REV = false, LOGO_IMG = null, CAPS = [];
export function configure({ beats, variant = 'A', revision = false, logo, capturas = [] }) { BT = beats.beats; VAR = variant; REV = revision; LOGO_IMG = logo; CAPS = capturas; }
// beat → segundo con la cuadrícula MEDIDA sobre la música (beats.json), no con el BPM nominal
export function B(n) {
  const P = BT[1] - BT[0], last = BT.length - 1;
  if (n <= 0) return BT[0] + n * P;
  if (n >= last) return BT[last] + (n - last) * P;
  const i = Math.floor(n);
  return BT[i] + (n - i) * (BT[i + 1] - BT[i]);
}
