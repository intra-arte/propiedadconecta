"""Original soundtrack for the 15 s launch film, synthesised from scratch.

Usage:  python3 video/music/compose.py      → video/music/soundtrack.wav (48 kHz, float, stereo)

No samples, loops or third-party audio: every sound is generated here
(additive saws, plucks, bells, noise-based drums and risers, synthetic
reverb), with a fixed random seed so the result is reproducible.

Tempo 150 BPM played half-time (feels like 75): one beat = 0.40 s, so the
film's main hits sit on the grid — 2.40 downbeat after the bloom, 4.00 cards,
7.60 / 8.00 / 8.40 / 8.80 feature words, 11.60 hard cut, 12.40 CTA, 14.00 logo.
Key: D major. Three buses mirror the picture: the dark gradient intro,
the white world (cut dead at 11.60 like the picture) and the outro.
"""
from pathlib import Path

import numpy as np
import pyloudnorm
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 15.0
N = int(SR * DUR)
BEAT = 0.40
BAR = 4 * BEAT
OUT = Path(__file__).resolve().parent / "soundtrack.wav"
rng = np.random.default_rng(20261011)


# ------------------------------------------------------------------ helpers
def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(n):
    return np.arange(n) / SR


def stereo(x, pan=0.0):
    a = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def place(bus, sig, t, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        sig = stereo(sig, pan)
    i = int(round(t * SR))
    if i < 0:
        sig, i = sig[-i:], 0
    n = min(len(sig), len(bus) - i)
    if n > 0:
        bus[i:i + n] += sig[:n] * gain


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, min(fc, SR / 2 * 0.95), "low", fs=SR, output="sos"), x, axis=0)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def sweep_lp(x, f0, f1, block=256):
    """Low-pass whose cutoff moves exponentially from f0 to f1 over the signal."""
    out = np.zeros_like(x)
    zi = None
    nb = int(np.ceil(len(x) / block))
    for b in range(nb):
        fc = f0 * (f1 / f0) ** (b / max(nb - 1, 1))
        sos = signal.butter(2, min(fc, SR / 2 * 0.95), "low", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2) + x.shape[1:])
        seg = x[b * block:(b + 1) * block]
        out[b * block:(b + 1) * block], zi = signal.sosfilt(sos, seg, axis=0, zi=zi)
    return out


def env_adsr(n, a=0.01, r=0.1, hold=None):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na) ** 1.5
    nr = max(1, int(r * SR))
    if hold is not None:
        nh = int(hold * SR)
        e[nh:] = 0
        tail = min(nr, n - nh)
        if tail > 0:
            e[nh:nh + tail] = np.linspace(1, 0, tail) ** 2
    else:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def reverb(x, seconds=2.4, damp=5000, seed=1):
    """Stereo convolution with a synthetic, exponentially decaying noise tail."""
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-np.arange(n) / SR * (6.9 / seconds))
    ir = np.stack([r.standard_normal(n) * decay, r.standard_normal(n) * decay], axis=1)
    ir = lp(ir, damp)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return wet


# ------------------------------------------------------------------ instruments
def saw(f, n, cents=0.0):
    f = f * 2 ** (cents / 1200)
    t = tt(n)
    k_max = int(min(36, 9000 / f))
    ph = rng.uniform(0, 2 * np.pi)
    return sum(np.sin(2 * np.pi * k * f * t + k * ph) / k for k in range(1, k_max + 1)) * 0.6


def pad(chord, dur, cutoff, attack=0.35, release=0.6):
    n = int((dur + release) * SR)
    out = np.zeros((n, 2))
    for m in chord:
        for cents, pan in ((-9, -0.7), (0, 0.0), (9, 0.7)):
            out += stereo(saw(mtof(m), n, cents), pan) * 0.16
    out = hp(lp(out, cutoff, order=4), 170)                    # lows belong to bass and kick
    return out * env_adsr(n, a=attack, r=release, hold=dur)[:, None]


def pluck(m, dur=0.9, bright=1.0):
    n = int(dur * SR)
    t = tt(n)
    f = mtof(m)
    x = sum(a * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (5 + 7 * k * (1.2 - bright)))
            for k, a in ((1, 1.0), (2, 0.42 * bright), (3, 0.2 * bright), (4, 0.08 * bright)))
    x *= np.minimum(1, t / 0.003)
    return x * 0.5


def bell(m, dur=2.2):
    n = int(dur * SR)
    t = tt(n)
    f = mtof(m)
    x = sum(a * np.sin(2 * np.pi * r * f * t) * np.exp(-t * d)
            for r, a, d in ((1, 1.0, 2.2), (2.76, 0.35, 4.5), (5.4, 0.16, 8.0), (8.93, 0.07, 12.0)))
    return x * np.minimum(1, t / 0.002) * 0.35


def kick(level=1.0):
    n = int(0.55 * SR)
    t = tt(n)
    f = 44 + 95 * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = lp(rng.standard_normal(n), 2500) * np.exp(-t * 400) * 0.25
    return (x + 1.6 * click) * level * 0.7


def clap(level=1.0):
    n = int(0.35 * SR)
    t = tt(n)
    nz = bp(rng.standard_normal(n), 900, 2600)
    e = np.zeros(n)
    for d in (0.0, 0.011, 0.023):
        e += (t >= d) * np.exp(-np.maximum(t - d, 0) * (90 if d < 0.02 else 16))
    return nz * e * 0.28 * level


def hat(level=1.0, length=0.06):
    n = int(length * SR)
    t = tt(n)
    return hp(rng.standard_normal(n), 7500) * np.exp(-t * (55 / length * 0.06)) * 0.20 * level


def sub(m, dur, level=1.0):
    n = int((dur + 0.08) * SR)
    t = tt(n)
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t)
    return x * env_adsr(n, a=0.012, r=0.08, hold=dur) * 0.30 * level


def riser(dur, f0, f1, level=1.0):
    n = int(dur * SR)
    nz = rng.standard_normal((n, 2))
    x = sweep_lp(nz, f0, f1)
    x = hp(x, 300)
    e = np.linspace(0, 1, n) ** 2.2
    return x * e[:, None] * 0.22 * level


def whoosh_down(dur, level=1.0):
    n = int(dur * SR)
    x = sweep_lp(rng.standard_normal((n, 2)), 6000, 250)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return x * e[:, None] * 0.2 * level


def tick(freq=1800, level=1.0, length=0.03):
    n = int(length * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * freq * t * (1 - 0.25 * t / length)) * np.exp(-t * 140)
    return x * 0.18 * level


def type_click(level=1.0):
    n = int(0.012 * SR)
    t = tt(n)
    return bp(rng.standard_normal(n), 1800, 5200) * np.exp(-t * 600) * 0.12 * level


# ------------------------------------------------------------------ harmony
CH = {
    "Bm9": [47, 54, 57, 61, 62],
    "Dmaj9": [50, 57, 61, 64, 66],
    "Gmaj9": [43, 50, 54, 57, 59, 62],
    "A69": [45, 52, 57, 61, 66, 71],
    "Asus2": [45, 52, 57, 59, 64],
    "A": [45, 52, 57, 61, 64],
}
ROOT = {"Bm9": 35, "Dmaj9": 38, "Gmaj9": 31, "A69": 33, "Asus2": 33, "A": 33}
# (start, end, chord) in the white world, all on the beat grid
WHITE = [(2.4, 4.0, "Dmaj9"), (4.0, 5.6, "Bm9"), (5.6, 7.2, "Gmaj9"), (7.2, 8.8, "A69"), (8.8, 10.4, "Dmaj9"), (10.4, 11.6, "Bm9")]


def chord_at(t, table):
    for a, b, c in table:
        if a <= t < b:
            return c
    return table[-1][2]


# ------------------------------------------------------------------ bus 1 · gradient intro (0 – 2.40)
def intro_bus():
    bus = np.zeros((N, 2))
    place(bus, pad(CH["Bm9"], 2.45, 700, attack=0.12, release=0.25), 0.0, 0.85)
    place(bus, sub(35, 2.35, 0.55), 0.0)
    shimmer = sum(np.sin(2 * np.pi * mtof(m) * tt(int(2.4 * SR))) for m in (85, 90)) * 0.012
    place(bus, shimmer * np.linspace(0, 1, len(shimmer)) ** 2, 0.0, pan=0.3)
    for i in range(27):                                    # one soft key click per typed character
        place(bus, type_click(rng.uniform(0.6, 1.0)), 0.30 + i * 0.055, pan=rng.uniform(-0.15, 0.15))
    # reverse swell into the bloom: a bright chord's reverb, played backwards, peaking at 2.30
    src = np.zeros((int(1.9 * SR), 2))
    place(src, pad(CH["Dmaj9"], 0.15, 5000, attack=0.005, release=0.1), 0.0)
    for m in (74, 78, 81):
        place(src, pluck(m, 0.6), 0.0, 0.6)
    wet = reverb(src, 1.8, 7000, seed=3)[::-1]
    wet *= np.linspace(0, 1, len(wet))[:, None] ** 1.6
    place(bus, wet * 2.2, 2.30 - len(wet) / SR)
    bus += reverb(bus, 1.8, 4000, seed=2) * 0.25
    e = np.ones(N)
    a, b = int(2.40 * SR), int(2.55 * SR)
    e[a:b] = np.linspace(1, 0, b - a)
    e[b:] = 0
    return bus * e[:, None]


# ------------------------------------------------------------------ bus 2 · white world (2.40 – 11.60, cut dead)
def white_bus():
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    # pads
    for a, b, c in WHITE:
        p = pad(CH[c], b - a, 6500, attack=0.25 if a > 2.4 else 0.04, release=0.5)
        place(dry, p, a, 0.55)
        place(send, p, a, 0.25)
    # downbeat after the bloom
    place(dry, kick(0.8), 2.40)
    place(send, riser(0.25, 9000, 9000, 0.0), 2.40)
    # plucked arpeggio: quarters while the first line reveals, eighths from the cards on
    pattern, vel = [0, 2, 1, 3, 2, 4, 3, 1], [1, .55, .8, .55, .9, .55, .75, .5]
    t, step = 2.4, 0
    while t < 11.6 - 1e-6:
        c = chord_at(t, WHITE)
        upper = sorted(m + 12 for m in CH[c] if m >= 54)
        eighth = t >= 4.0
        if eighth or step % 2 == 0:
            m = upper[pattern[step % 8] % len(upper)]
            v = vel[step % 8] * (0.55 if 7.6 <= t < 9.2 else 1.0) * (0.7 if not eighth else 1.0)
            pl = pluck(m, 0.8, bright=1.1)
            pan = [-0.35, 0.25, -0.15, 0.4][step % 4]
            place(dry, pl, t, 0.32 * v, pan)
            place(send, pl, t, 0.22 * v, pan)
        t += BEAT / 2
        step += 1
    # drums from the cards (4.00), half-time: kick 1 and the "and" of 2, clap on 3, eighth hats
    t = 4.0
    while t < 11.6 - 1e-6:
        pos = round((t - 4.0) / (BEAT / 2)) % 8                  # eighth within the bar
        if pos in (0, 3):
            place(dry, kick(1.0 if pos == 0 else 0.7), t)
        if pos == 4:
            place(dry, clap(), t, pan=0.05)
            place(send, clap(), t, 0.5)
        place(dry, hat(0.9 if pos % 2 else 0.55), t, pan=0.35)
        t += BEAT / 2
    for k in range(8):                                          # 16th hat fill into the cut
        place(dry, hat(0.5 + 0.08 * k, 0.04), 11.2 + k * BEAT / 4, pan=0.35)
    # bass, following the kicks
    for a, b, c in WHITE:
        if a < 4.0:
            place(dry, sub(ROOT[c], b - a, 0.6), a)
            continue
        x = a
        while x < b - 1e-6:
            place(dry, sub(ROOT[c], 0.55), x)
            place(dry, sub(ROOT[c] + 12 if (x - a) % BAR > 1e-6 else ROOT[c], 0.9), x + 0.6)
            x += BAR
    # sound design on the picture
    for i in range(160):                                        # dither dissolve 3.65-3.95: sparse grains
        g = int(rng.integers(80, 200))
        grain = hp(rng.standard_normal(g), 5000) * np.hanning(g) * 0.10
        tg = 3.65 + 0.30 * rng.random() ** 1.4
        place(dry, grain * (1 - (tg - 3.65) / 0.35), tg, pan=rng.uniform(-0.8, 0.8))
    for t0, lvl in ((4.05, 1.0), (4.50, 1.0), (4.95, 1.0)):     # card arrivals
        place(dry, tick(950, lvl), t0, pan=-0.1)
    for t0 in (4.75, 5.20):                                     # empty → filled
        place(dry, tick(1900, 0.6, 0.02), t0, pan=0.15)
    place(send, riser(0.5, 400, 7000, 0.8), 5.90)               # frame draws on
    place(dry, whoosh_down(0.35, 0.5), 6.95)                    # in-window scroll
    for t0, m in ((7.6, 69), (8.0, 71), (8.4, 73), (8.8, 78)):  # feature words land on the beat
        b_ = bell(m + 12, 1.6)
        place(dry, b_, t0, 0.55, pan=0.0)
        place(send, b_, t0, 0.45)
    place(dry, whoosh_down(0.3, 0.8), 9.15)                     # window drops out
    place(dry, tick(700, 0.8, 0.04), 9.40)                      # button
    place(send, riser(0.8, 300, 9000, 1.2), 10.80)              # into the hard cut
    rise = np.sin(2 * np.pi * np.cumsum(np.geomspace(mtof(62), mtof(74), int(0.8 * SR))) / SR) * np.linspace(0, 1, int(0.8 * SR)) ** 3 * 0.05
    place(dry, rise, 10.80, pan=0.0)
    bus = dry + reverb(send, 2.2, 6000, seed=4) * 0.9
    e = np.ones(N)
    a, b = int(11.585 * SR), int(11.60 * SR)
    e[:int(2.40 * SR)] = 0
    e[a:b] = np.linspace(1, 0, b - a)
    e[b:] = 0
    return bus * e[:, None]


# ------------------------------------------------------------------ bus 3 · outro (11.60 – 15.00)
def outro_bus():
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    # hard cut: low boom and a dark Gmaj9 world while the discs converge
    n = int(1.6 * SR)
    t = tt(n)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 30 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.6) * 0.7
    place(dry, boom, 11.60)
    place(send, lp(rng.standard_normal((int(0.4 * SR), 2)), 1800) * np.exp(-tt(int(0.4 * SR)) * 9)[:, None] * 0.25, 11.60)
    dark = pad(CH["Gmaj9"], 0.8, 900, attack=0.01, release=0.35)
    place(dry, dark, 11.60, 0.7)
    place(send, dark, 11.60, 0.3)
    place(dry, sub(31, 0.8, 0.5), 11.60)
    place(dry, tick(1300, 0.5, 0.03), 12.30)                    # isotipo appears
    # CTA: Asus2 → A, light groove, a bell when «gratis» lands
    for a, b, c in ((12.4, 13.2, "Asus2"), (13.2, 14.0, "A")):
        p = pad(CH[c], b - a, 6000, attack=0.03, release=0.4)
        place(dry, p, a, 0.5)
        place(send, p, a, 0.25)
        place(dry, sub(ROOT[c], b - a - 0.02, 0.8), a)
    for k, t0 in enumerate(np.arange(12.4, 14.0 - 1e-6, BEAT / 2)):
        if k % 8 in (0, 3):
            place(dry, kick(0.9 if k % 8 == 0 else 0.6), t0)
        if k % 8 == 4:
            place(dry, clap(0.8), t0)
            place(send, clap(0.8), t0, 0.5)
        place(dry, hat(0.8 if k % 2 else 0.45), t0, pan=0.35)
    for k, m in enumerate((76, 81, 83)):                       # small motif under the words
        place(dry, pluck(m, 0.7), 12.45 + k * 0.15, 0.3, pan=0.2 - 0.2 * k)
        place(send, pluck(m, 0.7), 12.45 + k * 0.15, 0.2)
    place(dry, bell(88, 1.8), 12.60, 0.5, pan=0.2)             # «gratis»
    place(send, bell(88, 1.8), 12.60, 0.4)
    place(send, whoosh_down(0.25, 0.6), 13.45)                  # words drop out
    # logo: resolve to Dmaj9 with an arpeggiated bell chord
    p = pad(CH["Dmaj9"], 0.95, 7000, attack=0.02, release=0.5)
    place(dry, p, 14.0, 0.55)
    place(send, p, 14.0, 0.35)
    place(dry, kick(0.8), 14.0)
    place(dry, sub(38, 0.95, 0.8), 14.0)
    for k, m in enumerate((74, 78, 81, 85, 90)):
        place(dry, bell(m, 1.6), 14.0 + k * 0.035, 0.42, pan=-0.4 + 0.2 * k)
        place(send, bell(m, 1.6), 14.0 + k * 0.035, 0.35)
    bus = dry + reverb(send, 2.4, 6500, seed=5) * 0.9
    e = np.ones(N)
    e[:int(11.60 * SR)] = 0
    a = int(14.55 * SR)
    e[a:] = np.linspace(1, 0, N - a) ** 1.5
    return bus * e[:, None]


# ------------------------------------------------------------------ master
def main():
    mix = intro_bus() + white_bus() + outro_bus()
    mix = hp(mix, 28)
    mix = np.tanh(mix * 1.1) / 1.1
    meter = pyloudnorm.Meter(SR)
    gain = 10 ** ((-14.0 - meter.integrated_loudness(mix)) / 20)
    mix *= gain
    ceiling = 10 ** (-1.2 / 20)                                 # soft ceiling just under −1 dBFS
    over = np.abs(mix) > ceiling * 0.8
    mix[over] = np.sign(mix[over]) * (ceiling * 0.8 + ceiling * 0.2 * np.tanh((np.abs(mix[over]) - ceiling * 0.8) / (ceiling * 0.2)))
    print(f"  loudness {meter.integrated_loudness(mix):.1f} LUFS · peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
    wavfile.write(OUT, SR, mix.astype(np.float32))
    print("  wrote", OUT.relative_to(OUT.parents[2]))


if __name__ == "__main__":
    main()
