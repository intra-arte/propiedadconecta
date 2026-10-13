#!/usr/bin/env python3
"""
Voice-over mix for «Nuevas reglas».

Takes one ElevenLabs take (locucion/toma.mp3: the eight lines read in one go), speeds it up 10 %,
splits it into its voiced chunks, groups the chunks into the eight lines by expected length, tightens
the pauses inside each line, places each line where its shot or headline appears, ducks the score under
the voice and writes music/soundtrack-locucion.wav (48 kHz stereo, -14 LUFS, peak <= -1 dBFS).

    python3 video/monedas/locucion/mezcla.py [toma.mp3]
"""
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyloudnorm
from scipy import ndimage, signal
from scipy.io import wavfile

HERE = Path(__file__).resolve().parent
TAKE = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "toma.mp3"
SCORE = HERE.parent / "music" / "soundtrack.wav"
OUT = HERE.parent / "music" / "soundtrack-locucion.wav"
SR, DUR = 48000, 40.0

LINES = [  # (entry in seconds, text as read) — docs/lanzamiento/locucion.md
    (0.40, "Buscar casa era un juego con malas reglas."),
    (4.40, "Si buscas, pierdes horas en portales… sin saber si está ahí."),
    (10.40, "Si eres agente, inviertes dinero en portales y publicidad que no te prometen nada."),
    (16.30, "Cambiamos las reglas."),
    (18.40, "Con Propiedad Conecta, publicas gratis lo que necesitas… y los agentes trabajan por ti."),
    (24.40, "Y el agente invierte solo en prospectos que encajan con lo que tiene."),
    (30.40, "Deja de regalar tu tiempo. Deja de invertir a ciegas."),
    (34.40, "Propiedad Conecta. Tú buscas… nosotros conectamos."),
]
TEMPO = 1.10        # speeds the take up a little so every line fits its shot (1.0 = as read)
INNER = 0.18        # longest pause kept inside a line
DUCK_DB = -8.0      # score level under the voice
GAP = 0.12          # minimum air between two lines when one runs long


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-af", f"atempo={TEMPO}", "-ac", "1",
                          "-ar", str(SR), "-f", "f32le", "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def chunks(x):
    """Voiced runs of the take as (start, end) samples; pauses under 0.15 s stay inside a run."""
    hop = int(0.01 * SR)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop * 3) / (hop * 3), "same")[::hop])
    voiced = 20 * np.log10(rms + 1e-9) > 20 * np.log10(rms.max()) - 38
    runs, i = [], 0
    while i < len(voiced):
        if voiced[i]:
            j = i
            while j < len(voiced) and voiced[j]:
                j += 1
            if runs and i - runs[-1][1] < 15:
                runs[-1][1] = j
            elif j - i > 5:
                runs.append([i, j])
            i = j
        else:
            i += 1
    return [(a * hop, b * hop) for a, b in runs]


def syllables(text):
    return len(re.findall(r"[aeiouáéíóúü]+", text.lower()))


def group(runs, lines):
    """Split the runs into len(lines) consecutive groups whose lengths best match each line's syllables."""
    syl = [syllables(t) for _, t in lines]
    k = sum(b - a for a, b in runs) / sum(syl)
    n, m = len(runs), len(lines)
    best = np.full((m + 1, n + 1), np.inf); best[0, 0] = 0
    back = np.zeros((m + 1, n + 1), int)
    for l in range(1, m + 1):
        for j in range(l, n + 1):
            for i in range(l - 1, j):
                span = sum(b - a for a, b in runs[i:j])
                c = best[l - 1, i] + ((span - k * syl[l - 1]) / (k * syl[l - 1])) ** 2
                if c < best[l, j]:
                    best[l, j], back[l, j] = c, i
    if not np.isfinite(best[m, n]):
        sys.exit(f"{n} voiced chunks cannot make {m} lines")
    cuts, j = [], n
    for l in range(m, 0, -1):
        cuts.append((back[l, j], j)); j = back[l, j]
    return [runs[i:j] for i, j in reversed(cuts)]


def render(x, runs):
    """One line: its chunks back to back, pauses capped at INNER, with short fades."""
    pad, f = int(0.04 * SR), int(0.01 * SR)
    parts = []
    for n, (a, b) in enumerate(runs):
        seg = x[max(0, a - pad):min(len(x), b + pad)].copy()
        seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        if n:                                        # the pads already give 2 * pad of air
            pause = min(INNER * SR, a - runs[n - 1][1]) - 2 * pad
            parts.append(np.zeros(max(0, int(pause)), np.float32))
        parts.append(seg)
    return np.concatenate(parts)


def limit(x, ceiling, look=0.005):
    """Look-ahead peak limiter: hold the needed gain over 2 * look, then smooth over look."""
    n = int(look * SR)
    need = np.minimum(1.0, ceiling / (np.abs(x).max(axis=1) + 1e-12))
    g = ndimage.uniform_filter1d(ndimage.minimum_filter1d(need, 2 * n + 1), n + 1)
    return x * np.minimum(g, need)[:, None]


def main():
    take = decode(TAKE)
    segs = [render(take, g) for g in group(chunks(take), LINES)]
    voice = np.zeros(int(DUR * SR), np.float32)
    cursor = 0.0
    print("  line  entry   length  text")
    for n, ((t, text), seg) in enumerate(zip(LINES, segs), 1):
        t = max(t, cursor + GAP)
        a = int(t * SR)
        seg = seg[: len(voice) - a]
        voice[a:a + len(seg)] += seg
        cursor = t + len(seg) / SR
        print(f"  {n:>4}  {t:6.2f}  {len(seg) / SR:5.2f} s  {text}")
    if cursor > DUR - 0.3:
        sys.exit(f"voice runs to {cursor:.2f} s, past the end of the film")

    # voice: rumble out, a touch of presence, gentle leveling
    voice = signal.sosfilt(signal.butter(2, 90, "highpass", fs=SR, output="sos"), voice)
    pres = signal.sosfilt(signal.butter(2, [2500, 6000], "bandpass", fs=SR, output="sos"), voice)
    voice = voice + 0.25 * pres
    meter = pyloudnorm.Meter(SR)
    voice *= 10 ** ((-15 - meter.integrated_loudness(voice)) / 20)

    # duck the score: envelope follower on the voice (60 ms attack, 350 ms release)
    sr_score, score = wavfile.read(SCORE)
    assert sr_score == SR
    score = score.astype(np.float32)[: len(voice)]
    env = np.abs(voice)
    k_a, k_r = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.35 * SR))
    follow = np.empty_like(env); y = 0.0
    thresh = 10 ** (-40 / 20)
    for i, v in enumerate(env > thresh):
        target = 1.0 if v else 0.0
        k = k_a if target > y else k_r
        y = k * y + (1 - k) * target
        follow[i] = y
    gain = 10 ** (DUCK_DB * follow / 20)
    mix = score * gain[:, None] + voice[:, None]

    for _ in range(3):                               # loudness to -14 LUFS, peaks held at -1 dBFS
        mix *= 10 ** ((-14 - pyloudnorm.Meter(SR).integrated_loudness(mix)) / 20)
        mix = limit(mix, 10 ** (-1 / 20))
    wavfile.write(OUT, SR, mix.astype(np.float32))
    print(f"  wrote {OUT.relative_to(HERE.parents[2])}: {pyloudnorm.Meter(SR).integrated_loudness(mix):.1f} LUFS, "
          f"peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS")


if __name__ == "__main__":
    main()
