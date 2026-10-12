"""Original soundtrack for «Monedas al aire» (32 s), synthesised from scratch.

Usage:  python3 video/monedas/music/compose.py   → video/monedas/music/soundtrack.wav

Same synthesis engine as the other films (video/music/compose.py). Here the
objects are the percussion: coins clink as the hi-hats, the slot machine
ratchets, clocks tick-tock through the seeker's act, stamps thud, and the click
of the piece falling into its slot is the drop (22.29 s). Silence before the
logo, one bell chord on it. 140 BPM half-time, B minor. No samples.

Event times mirror video/monedas/index.html (same beat grid, same formulas).
"""
import importlib.util
import math
from pathlib import Path

import numpy as np
import pyloudnorm
from scipy.io import wavfile

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("engine", HERE.parents[1] / "music" / "compose.py")
E = importlib.util.module_from_spec(spec)
spec.loader.exec_module(E)

SR = E.SR
DUR = 32.0
N = int(SR * DUR)
B = 60 / 140
BAR = 4 * B
DROP = 52 * B          # 22.29 s: the piece clicks in
STOP = 26.95           # silence before the logo
LOGO = 64 * B          # 27.43 s
OUT = HERE / "soundtrack.wav"
rng = np.random.default_rng(20261013)
tt = E.tt
place = E.place


# ------------------------------------------------------------------ object sounds
def clink(f=3200, level=1.0, decay=55):
    n = int(0.25 * SR); t = tt(n)
    x = sum(a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6)) * np.exp(-t * decay * d)
            for r, a, d in ((1, 1, 1), (2.43, 0.55, 1.4), (3.71, 0.35, 1.9), (5.12, 0.2, 2.4), (6.9, 0.12, 3)))
    x += E.hp(rng.standard_normal(n), 5000) * np.exp(-t * 900) * 0.4
    return x * 0.16 * level


def thud(f=90, level=1.0, noise=1200):
    n = int(0.3 * SR); t = tt(n)
    x = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 40))) / SR) * np.exp(-t * 14)
    x += E.lp(rng.standard_normal(n), noise) * np.exp(-t * 35) * 0.5
    return x * 0.5 * level


def clunk(level=1.0):
    n = int(0.25 * SR); t = tt(n)
    x = (np.sin(2 * np.pi * 210 * t) + 0.6 * np.sin(2 * np.pi * 333 * t)) * np.exp(-t * 26)
    x += E.bp(rng.standard_normal(n), 400, 1300) * np.exp(-t * 45) * 0.7
    return x * 0.35 * level


def ratchet(dur, level=1.0, rate=0.034):
    n = int(dur * SR); out = np.zeros(n); k = 0
    while k * rate < dur:
        i = int(k * rate * SR); c = E.bp(rng.standard_normal(int(0.006 * SR)), 1800, 4200) * np.hanning(int(0.006 * SR))
        out[i:i + len(c)] += c[: max(0, n - i)] * (0.7 + 0.3 * rng.random()); k += 1
    return out * 0.12 * level


def tick(hi=True, level=1.0):
    n = int(0.03 * SR); t = tt(n)
    f = 3300 if hi else 2300
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 260) + E.hp(rng.standard_normal(n), 3000) * np.exp(-t * 700) * 0.5
    return x * 0.14 * level


def fit_click(level=1.0):
    n = int(0.4 * SR); t = tt(n)
    x = E.hp(rng.standard_normal(n), 4000) * np.exp(-t * 1400) * 0.9
    x += np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * 0.5
    x += np.sin(2 * np.pi * np.cumsum(55 + 60 * np.exp(-t * 30)) / SR) * np.exp(-t * 7) * 0.9
    return x * 0.6 * level


def shimmer(dur, f0=2000, f1=6000, level=1.0):
    n = int(dur * SR); t = tt(n)
    f = f0 * (f1 / f0) ** (t / dur)
    x = sum(np.sin(2 * np.pi * np.cumsum(f * r) / SR) for r in (1, 1.5, 2.01)) / 3
    return x * np.sin(np.pi * t / dur) ** 2 * 0.05 * level


# the same hash as index.html, to know when the sweeping coin lights each match
def jhash(i):
    imul = lambda a, b: ((a & 0xFFFFFFFF) * (b & 0xFFFFFFFF)) & 0xFFFFFFFF
    h = imul(i + 1, 2654435761) ^ 0x9E3779B9
    h = imul(h ^ (h >> 15), 2246822519)
    return ((h ^ (h >> 13)) & 0xFFFFFFFF) / 4294967295


def in_out(x):
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def match_times():
    times = []
    for i in (0, 4, 7, 11):
        col = i % 5; x = 1.6 + (col - 2) * 2.5 + (jhash(i) - 0.5) * 0.6
        p = (x + 6.5) / 14.7; lo, hi = 0.0, 1.0
        for _ in range(30):
            m = (lo + hi) / 2
            lo, hi = (m, hi) if in_out(m) < p else (lo, m)
        times.append(24 * B + lo * 1.55)
    return times


# ------------------------------------------------------------------ score
PROG = ["Bm9", "Bm9", "Gmaj9", "Gmaj9", "Dmaj9", "A69", "Bm9", "Gmaj9", "Dmaj9",
        "Bm9", "Gmaj9", "Dmaj9", "A69", "Bm9", "Gmaj9", "Dmaj9"]                 # bars 1-16 (to 27.43 s)


def bar(n):
    return (n - 1) * BAR


def score():
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    # pads (closed until the machine, opening after the drop)
    for n, c in enumerate(PROG, start=1):
        st = bar(n); end = min(st + BAR, STOP)
        if st >= STOP:
            break
        cutoff = 700 if n <= 2 else (2400 if st < DROP - 0.01 else 4200)
        if 20.57 <= st < DROP:
            cutoff = 900                                                            # pre-drop: closed
        p = E.pad(E.CH[c], end - st, cutoff, attack=0.05, release=0.2)
        place(dry, p, st, 0.45 if n > 1 else 0.6)
        place(send, p, st, 0.18)
        if st >= 3.43:
            place(dry, E.sub(E.ROOT[c], end - st - 0.02, 0.6 if st < DROP else 0.9), st)
    place(dry, E.sub(35, bar(3) - 0.05, 0.6), 0.0)

    # 1 · the toss: a rising metallic whirr, the title hit, the fall
    place(send, shimmer(1.7, 900, 3800, 1.2), 0.05)
    place(dry, E.kick(0.9), 4 * B); place(dry, clink(2900, 1.4, 30), 4 * B); place(send, clink(2900, 1.0, 20), 4 * B)
    place(send, E.whoosh_down(0.6, 0.6), 2.85)

    # 2-3 · the machine: hero coin into the slot, the stream, the reels
    place(dry, clink(3600, 1.2), 3.43 + 0.38); place(dry, thud(110, 0.5, 900), 3.43 + 0.38)
    for i in range(36):
        t = 3.43 + 0.3 + i * 0.07 + 0.95
        if t < 6.86:
            place(dry, clink(rng.uniform(2600, 4200), rng.uniform(0.35, 0.7)), t, pan=rng.uniform(0.1, 0.6))
    for k in range(3):                                           # reels: ratchet until each stops on its beat
        stop = 3.43 + 4 * B + k * B
        place(dry, ratchet(stop - (3.43 + 0.3), 0.8 - 0.15 * k), 3.43 + 0.3, pan=-0.2 + 0.2 * k)
        place(dry, clunk(0.8), stop, pan=-0.2 + 0.2 * k)
    for t0 in (1.95, 2.35, 2.75):                                # coins that bounce on the floor
        for j, d in enumerate((0.35, 0.47, 0.55)):
            place(dry, clink(rng.uniform(2200, 3000), 0.5 / (j + 1), 70), 3.43 + t0 + d, pan=-0.3)

    # 4 · DEJA DE TIRAR: hit + a coin flying across
    place(dry, E.kick(1.0), 16 * B); place(send, E.whoosh_down(1.2, 0.5)[::-1], 16 * B + 0.15)

    # 5 · rewind: reversed clinks, the machine folding
    rev = np.zeros(int(1.0 * SR))
    for i in range(30):
        c = clink(rng.uniform(2600, 4200), 0.5); j = int(rng.uniform(0, 0.8) * SR); rev[j:j + len(c)] += c[: len(rev) - j]
    place(dry, rev[::-1], 20 * B, 1.0, pan=0.1)
    place(send, E.riser(0.9, 300, 6000, 0.9), 20 * B)
    place(dry, thud(70, 0.9, 600), 20 * B + 1.4)

    # 6 · the field: a pop for each match the coin lights, the coin lands on a person
    for k, t in enumerate(match_times()):
        place(dry, E.pluck(78 + [0, 2, 5, 7][k], 0.5, bright=1.2), t, 0.35, pan=-0.4 + 0.25 * k)
        place(send, E.pluck(78 + [0, 2, 5, 7][k], 0.5), t, 0.25)
    place(send, shimmer(1.5, 1500, 4000, 0.8), 24 * B)
    place(dry, fit_click(0.5), 30 * B); place(dry, E.bell(83, 1.4), 30 * B, 0.35); place(send, E.bell(83, 1.4), 30 * B, 0.3)

    # 7 · flip
    place(send, E.whoosh_down(0.5, 0.7)[::-1], 32 * B)

    # 8-9 · feed: stamps on every beat
    for k in range(8):
        place(dry, thud(85, 0.8, 1400), 36 * B + k * B, pan=rng.uniform(-0.3, 0.3))
    place(dry, E.kick(1.0), 40 * B)

    # 10-11 · the slab, the tags, the wrong pieces, the click
    place(dry, thud(65, 1.0, 700), 44 * B + 0.35)
    for k in range(4):
        place(dry, E.pluck(74 + 3 * k, 0.35, bright=1.1), 44 * B + (k + 1) * B, 0.3)
    place(dry, clunk(1.0), 49 * B, pan=-0.3); place(dry, clunk(0.9), 50 * B, pan=0.3)
    place(send, E.riser(DROP - 20.57, 250, 9000, 1.3), 20.57)
    place(dry, fit_click(1.2), DROP); place(send, fit_click(0.6), DROP)
    place(dry, E.pluck(88, 0.3, bright=1.3), DROP + 0.2, 0.25); place(dry, E.pluck(95, 0.3, bright=1.3), DROP + 0.29, 0.25)   # message blip

    # 12-13 · payoff
    place(send, E.whoosh_down(0.6, 0.5)[::-1], 56 * B); place(send, E.whoosh_down(0.6, 0.4)[::-1], 56.5 * B)
    place(send, shimmer(0.7, 2500, 5000, 0.8), 56 * B + 0.45)
    place(dry, E.kick(1.0), 60 * B); place(dry, clink(3000, 1.0, 30), 60 * B)
    place(send, shimmer(0.8, 3000, 7000, 0.7), 56 * B + 2.25)

    # rhythm section
    t = 3.43
    while t < STOP - 1e-6:
        pos = int(round((t % BAR) / (B / 2))) % 8
        act2 = 32 * B <= t < DROP
        pre = 48 * B <= t < DROP
        if pos == 0 and not pre:
            place(dry, E.kick(1.0 if t >= DROP else 0.85), t)
        if pos == 3 and not pre:
            place(dry, E.kick(0.6), t)
        if pos == 4 and not pre:
            place(dry, E.clap(0.9), t, pan=0.05); place(send, E.clap(0.9), t, 0.4)
        if act2 or t >= DROP:                                       # clock: tick-tock on the eighths
            place(dry, tick(pos % 2 == 0, 1.0 if pos % 2 == 0 else 0.7), t, pan=0.25)
        if not act2:                                                # coins: clink hats
            place(dry, clink(rng.uniform(5200, 6800), 0.45 if pos % 2 else 0.28, 120), t, pan=-0.25)
        t += B / 2
    # dark arpeggio, brighter after the drop
    pattern, vel = [0, 2, 1, 3, 2, 4, 3, 1], [1, .5, .75, .5, .85, .5, .7, .45]
    step, t = 0, 16 * B
    while t < STOP - 1e-6:
        c = PROG[int(t // BAR)]
        upper = sorted(m + 12 for m in E.CH[c] if m >= 54)
        m = upper[pattern[step % 8] % len(upper)]
        pl = E.lp(E.pluck(m, 0.6, bright=1.0 if t >= DROP else 0.8), 5000 if t >= DROP else 2400)
        lvl = (0.26 if t >= DROP else 0.18) * vel[step % 8] * (0.4 if 48 * B <= t < DROP else 1)
        place(dry, pl, t, lvl, [-0.35, 0.25, -0.15, 0.4][step % 4]); place(send, pl, t, lvl * 0.7)
        t += B / 2; step += 1

    bus = dry + E.reverb(send, 2.0, 5500, seed=21) * 0.85
    e = np.ones(N); a, b = int((STOP - 0.02) * SR), int(STOP * SR)
    e[a:b] = np.linspace(1, 0, b - a); e[b:] = 0
    return bus * e[:, None]


def ending():
    """Silence, then one bell chord on the logo and its tail."""
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    place(send, E.reverb(np.zeros((10, 2)), 0.1)[:0], 0)            # keep the shape of the other films' code
    for k, m in enumerate((74, 78, 81, 85, 90)):
        place(dry, E.bell(m, 2.6), LOGO + k * 0.03, 0.4, pan=-0.4 + 0.2 * k)
        place(send, E.bell(m, 2.6), LOGO + k * 0.03, 0.35)
    place(dry, E.pad(E.CH["Dmaj9"], 2.5, 3000, attack=0.02, release=1.5), LOGO, 0.35)
    place(dry, E.sub(38, 2.0, 0.6), LOGO)
    for k in (1, 2):
        place(dry, E.pluck(86 + 2 * k, 0.3, bright=1.0), LOGO + k * B, 0.12)
    bus = dry + E.reverb(send, 3.0, 5000, seed=22) * 1.0
    bus[: int(LOGO * SR)] = 0
    a = int(30.6 * SR); bus[a:] *= np.linspace(1, 0, N - a)[:, None] ** 1.5
    return bus


def main():
    mix = score() + ending()
    mix = E.hp(mix, 28)
    mix = np.tanh(mix * 1.15) / 1.15
    meter = pyloudnorm.Meter(SR)
    mix *= 10 ** ((-14.0 - meter.integrated_loudness(mix)) / 20)
    ceiling = 10 ** (-1.2 / 20)
    over = np.abs(mix) > ceiling * 0.8
    mix[over] = np.sign(mix[over]) * (ceiling * 0.8 + ceiling * 0.2 * np.tanh((np.abs(mix[over]) - ceiling * 0.8) / (ceiling * 0.2)))
    print(f"  loudness {meter.integrated_loudness(mix):.1f} LUFS · peak {20 * math.log10(np.abs(mix).max()):.1f} dBFS")
    wavfile.write(OUT, SR, mix.astype(np.float32))
    print("  wrote", OUT.relative_to(HERE.parents[2]))


if __name__ == "__main__":
    main()
