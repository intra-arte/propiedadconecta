// Partitura y SFX de «Los dos del logo», colocados sobre los eventos del guion. La mezcla, la cesión
// ante la voz, la reverb y la sonoridad las hace el motor (motor/herramientas/musica.mjs).
// Identidad de la campaña: el agente habla con la marimba de vidrio del punto (D.punto); los clientes,
// con madera grave. Re mayor y cálido desde el principio (aquí no hay dolor que contar); se ensombrece
// a si menor cuando el cliente no contesta y estalla en re mayor cuando los dos forman el logo. La marca
// firma con re–la–fa# en el logo, el botón y el nombre, como en los otros anuncios.
//
// componer() recibe: VAR, place(bus, segundo, señal, ganancia, paneo, envío a reverb), B(beat) → segundo
// (cuadrícula nominal), D (voces de nucleo/dsp.mjs), M (notas MIDI por nombre), EV, rnd y los buses.
export function componer({ place, B, D, M, EV, rnd, musica, ritmo, sfx }) {
  const PAN = [-0.5, 0, 0.5]; // cada cliente suena de su lado

  // ---------- gancho (0–3 s): aparecen los clientes y el agente ----------
  const arpegio = [M.D3, M.A3, M.Fs3, M.A3, M.D3, M.B3, M.Fs3, M.A3];
  for (let s = 0; s < 12; s++) place(musica, B(s * 0.5), D.pulso(arpegio[s % 8] + 12), 0.16 + 0.1 * (s / 12), s % 2 ? 0.25 : -0.25, 0.15);
  place(musica, 0, D.pad([M.D3, M.A3, M.E4], B(6) - 0.05, 0.6, 0.4, 900), 0.34, 0, 0.3);
  for (let s = 0; s < 24; s++) place(ritmo, B(s * 0.25), D.maraca(), 0.03 + 0.04 * (s / 24), 0.3);
  EV.leads.forEach((b, i) => {
    place(sfx, B(b) - 0.18, D.barrido(0.18, 2600, 900, 2, 'cae'), 0.1, PAN[i], 0.1);        // cae
    place(ritmo, B(b), D.bombo(0.3, 0.55), 0.42, PAN[i] * 0.5);                                // madera grave: aterriza
    place(sfx, B(b), D.clic(1100 + 150 * i), 0.3, PAN[i], 0.15);
    place(musica, B(b), D.bajo([M.D2, M.Fs2, M.A2][i] + 12, B(0.4)), 0.32, PAN[i] * 0.4);
    place(sfx, B(b) + 0.12, D.barrido(0.12, 1600, 4600, 3, 'sube'), 0.14, PAN[i], 0.2);       // le brota la burbuja
  });
  place(sfx, B(EV.cuerpo), D.barrido(0.25, 500, 2400, 2, 'sube'), 0.16, 0.5, 0.15);           // brota el cuerpo claro
  place(sfx, B(EV.cabeza[0]), D.barrido(B(1), 4200, 900, 2.2, 'cae'), 0.18, 0.45, 0.2);       // el punto cae
  place(musica, B(EV.cabeza[1]), D.punto(M.D5, 1.2, 1.2), 0.6, 0.45, 0.4);                    // y es la cabeza: la voz del punto
  place(ritmo, B(EV.cabeza[1]), D.bombo(0.4, 0.8), 0.5);
  place(ritmo, B(EV.cabeza[1]), D.grave(0.6, 95, 50), 0.3);
  place(musica, B(4.5), D.punto(M.A5, 0.6, 0.9), 0.2, 0.4, 0.4);

  // ---------- elige · la moneda · no responde · responde (3–12,5 s): pulso estable bajo la voz ----------
  const acordes = [
    [6, [M.D3, M.Fs3, M.A3, M.E4], M.D2], [8, [M.B2, M.D3, M.Fs3, M.A3], M.B1 + 12], [10, [M.G2, M.B2, M.D3, M.Fs3], M.G1 + 12],
    [12, [M.A2, M.Cs3, M.E3, M.A3], M.A1 + 12], [14, [M.D3, M.Fs3, M.A3, M.E4], M.D2], [16, [M.B2, M.D3, M.Fs3, M.A3], M.B1 + 12],
    [18, [M.G2, M.B2, M.D3, M.Fs3], M.G1 + 12], [20, [M.A2, M.Cs3, M.E3, M.A3], M.A1 + 12], [22, [M.D3, M.Fs3, M.A3, M.E4], M.D2],
    [24, [M.G2, M.B2, M.D3, M.Fs3], M.G1 + 12],
  ];
  acordes.forEach(([b, ch, root], i) => {
    const len = (acordes[i + 1] ? acordes[i + 1][0] : 25) - b;
    place(musica, B(b), D.pad(ch.map(m => m + 12), B(len) - 0.05, 0.2, 0.3, 1300), 0.3, 0, 0.3);
    for (let q = 0.5; q < len; q += 1) place(musica, B(b + q), D.bajo(root, B(0.35)), 0.36);
  });
  for (let b = 6; b < 25; b++) { place(ritmo, B(b), D.bombo(0.35, 0.72), 0.38); if (b % 2) place(ritmo, B(b), D.aro(), 0.2, 0.1, 0.15); }
  for (let b = 6; b < 25; b += 0.25) place(ritmo, B(b), D.maraca(b % 1 === 0.5 ? 1.3 : 1), b % 1 === 0.5 ? 0.1 : 0.05, -0.25);
  [M.D5, M.E5, M.Fs5, M.A5].forEach((m, j) => place(musica, B(EV.saltos[j]), D.punto(m, 0.5, 0.9), 0.3, 0.5 - 0.18 * j, 0.35)); // el agente salta
  place(sfx, B(EV.burbuja), D.barrido(0.45, 700, 4200, 1.4, 'campana'), 0.3, 0, 0.3);         // la burbuja se abre en la app
  [M.D5, M.Fs5, M.A5, M.B5, M.D6, M.A5].forEach((m, j) => {
    place(musica, B(EV.pasos[j]), D.punto(m, 0.5, 0.85), 0.2, 0.25, 0.4);
    place(sfx, B(EV.pasos[j]) - 0.05, D.barrido(0.16, 900, 3800, 2.4, 'campana'), 0.12, 0, 0.1);
  });
  place(sfx, B(EV.acerca), D.clic(2600), 0.16, 0, 0.25);
  EV.candados.forEach((b, i) => place(sfx, B(b), D.clic(2600 + 500 * i), 0.3, PAN[i], 0.2));  // aparecen los candados

  // la moneda: aparece, sale de la mano, entra y abre
  place(sfx, B(EV.lanza - 0.5), D.moneda(3100, 0.3), 0.18, 0.2, 0.3);
  place(sfx, B(EV.lanza), D.barrido(B(EV.entra - EV.lanza), 800, 3600, 1.6, 'sube'), 0.16, 0.1, 0.2);
  place(sfx, B(EV.entra), D.moneda(2350, 0.55), 0.5, 0, 0.25);
  place(sfx, B(EV.entra) + 0.03, D.clic(3000), 0.4, 0, 0.2);
  place(musica, B(EV.abre), D.punto(M.A5, 0.8, 1.0), 0.36, 0, 0.4);
  // «…» y nada: tres toques suaves que se repiten y un tono que se apaga
  for (let k = 0; k < 6; k++) place(sfx, B(EV.espera) + k * 0.25, D.clic(4800 - (k % 3) * 300), 0.06, 0, 0.2);
  place(sfx, B(EV.silencio), D.barrido(0.7, 1300, 320, 2, 'cae'), 0.16, 0, 0.3);
  // la moneda vuelve (al revés) y el agente la atrapa
  place(sfx, B(EV.vuelve[0]) - 0.3, D.inverso(0.3), 0.22);
  place(sfx, B(EV.vuelve[0]), D.clic(3000), 0.3, 0, 0.2);
  place(sfx, B(EV.vuelve[0]), D.barrido(B(EV.vuelve[1] - EV.vuelve[0]), 3600, 1200, 1.6, 'campana'), 0.14, 0.2, 0.2);
  place(sfx, B(EV.vuelve[1]), D.moneda(2600, 0.45), 0.42, 0.2, 0.3);
  place(musica, B(EV.vuelve[1]), D.punto(M.Fs5, 0.7, 0.9), 0.3, 0.2, 0.4);
  // la misma moneda abre al otro cliente, que contesta
  place(sfx, B(EV.lanza2), D.barrido(B(EV.entra2 - EV.lanza2), 700, 3800, 1.6, 'sube'), 0.16, -0.2, 0.2);
  place(sfx, B(EV.entra2), D.moneda(2350, 0.55), 0.5, -0.4, 0.25);
  place(sfx, B(EV.entra2) + 0.03, D.clic(3000), 0.4, -0.4, 0.2);
  place(musica, B(EV.abre2), D.punto(M.A5, 0.8, 1.0), 0.36, -0.4, 0.4);
  place(musica, B(EV.responde), D.punto(M.D6, 1.0, 1.1), 0.42, -0.4, 0.45);
  place(sfx, B(EV.responde), D.barrido(0.3, 1500, 6000, 2.4, 'campana'), 0.24, -0.4, 0.3);
  place(sfx, B(EV.apartan), D.barrido(0.5, 2000, 500, 1.6, 'cae'), 0.12, 0.4, 0.2);           // los otros se apartan
  place(ritmo, B(EV.acercan[1]), D.bombo(0.3, 0.6), 0.36);
  place(musica, B(EV.acercan[1]), D.punto(M.B4, 0.5, 0.8), 0.24, 0, 0.35);

  // ---------- se forma el logo (12,5–14,5 s): todo se calla, saltan, y re mayor ----------
  place(sfx, B(EV.camara[0]), D.subida(B(EV.junta - EV.camara[0])), 0.26, 0, 0.25);
  place(sfx, B(EV.junta) - 0.45, D.inverso(0.45), 0.36);
  place(sfx, B(EV.salto), D.barrido(B(EV.junta - EV.salto), 500, 3200, 1.6, 'sube'), 0.24, 0, 0.25);
  place(musica, B(EV.junta), D.punto(M.D5, 1.4, 1.2), 0.64, 0, 0.45);                          // firma: re
  place(musica, B(EV.junta), D.ep([M.D3, M.A3, M.Cs4, M.E4, M.Fs4], 2.8, 1.4), 0.9, 0, 0.5);
  place(musica, B(EV.junta), D.pad([M.D3, M.Fs3, M.A3, M.E4], B(40 - EV.junta) - 0.6, 0.4, 0.6, 1500), 0.34, 0, 0.35);
  place(ritmo, B(EV.junta), D.grave(1.2, 80, 38), 0.5);
  place(ritmo, B(EV.junta), D.bombo(0.45, 0.9), 0.55);
  place(musica, B(EV.junta) + 0.05, D.campana(M.A5), 0.2, 0.2, 0.5);
  [M.D5, M.Fs5, M.A5, M.D6].forEach((m, j) => place(musica, B(EV.ventanas[j]), D.punto(m, 0.7, 0.95), 0.3, -0.3 + 0.2 * j, 0.45)); // la ventana se enciende
  place(sfx, B(EV.aCierre[0]), D.barrido(B(1), 600, 2400, 1.4, 'campana'), 0.14, 0, 0.3);

  // ---------- cierre (14,5–20 s): re–la–fa# ----------
  place(musica, B(EV.cta), D.punto(M.A5, 1.2, 1.0), 0.48, 0.15, 0.45);                         // firma: la
  place(musica, B(EV.cta), D.bajo(M.D2, B(0.6)), 0.4);
  for (let b = 30; b < 36; b++) { place(ritmo, B(b), D.bombo(0.3, 0.6), 0.28); place(ritmo, B(b + 0.5), D.maraca(), 0.06, 0.25); if (b % 2) place(ritmo, B(b), D.aro(), 0.13, 0.1, 0.15); }
  for (let b = 30; b < 36; b++) place(musica, B(b + 0.5), D.bajo(M.D2, B(0.3)), 0.28);
  place(musica, B(EV.nombre), D.punto(M.Fs5, 1.6, 1.0), 0.5, 0.05, 0.5);                       // firma: fa#
  place(musica, B(EV.nombre), D.campana(M.A5), 0.24, -0.2, 0.5);
  EV.empujes.forEach(b => place(sfx, B(b), D.clic(2600), 0.15, 0.3, 0.3));
  void rnd;
}
