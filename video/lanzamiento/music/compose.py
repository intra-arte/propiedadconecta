"""Original soundtrack for «Nuevas reglas» (40 s), synthesised from scratch.

Usage:  python3 video/lanzamiento/music/compose.py   → video/lanzamiento/music/soundtrack.wav

Same synthesis engine as the other films (video/music/compose.py) and the object
sounds of «Monedas al aire» (video/monedas/music/compose.py). The game pieces are
the percussion: the board's squares clack into place, the pawn's hops tap the
beat, the sand hisses, the money clinks into the billboard, the board flips with
a hit (16.5 s) and the music turns from E minor to G major. The coin that lands
on the right prospect is the drop (28.0 s). Silence before the logo, one bell
chord on it. 120 BPM, no samples.

Event times mirror video/lanzamiento/index.html (same beat grid, same formulas).
"""
import importlib.util
import math
from pathlib import Path

import numpy as np
import pyloudnorm
from scipy.io import wavfile

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


E = load("engine", HERE.parents[1] / "music" / "compose.py")
M = load("monedas", HERE.parents[1] / "monedas" / "music" / "compose.py")   # clink, thud, clunk, tick, fit_click, shimmer

SR = E.SR
DUR = 40.0
N = int(SR * DUR)
B = 0.5
BAR = 4 * B
FLIP = 16.5            # NUEVAS REGLAS
DROP = 28.0            # the coin lands on the prospect
STOP = 33.25           # silence before the logo
LOGO = 33.5
OUT = HERE / "soundtrack.wav"
rng = np.random.default_rng(20261014)
tt, place = E.tt, E.place

CH = {
    "Em9": [40, 47, 50, 54, 55, 59], "Cmaj9": [36, 43, 47, 50, 52, 55], "Am9": [33, 40, 43, 47, 48, 52],
    "B7sus": [35, 42, 45, 47, 52, 57], "Gmaj9": [43, 50, 54, 57, 59, 62], "Dmaj9": [38, 50, 54, 57, 61, 64],
    "Em7": [40, 47, 50, 55, 59, 62],
}
ROOT = {"Em9": 28, "Cmaj9": 36, "Am9": 33, "B7sus": 35, "Gmaj9": 31, "Dmaj9": 38, "Em7": 28}
PROG = ["Em9", "Em9", "Em9", "Cmaj9", "Am9", "Em9", "Cmaj9", "B7sus", "B7sus",      # bars 1-9 (0-18 s)
        "Gmaj9", "Dmaj9", "Em7", "Cmaj9", "Gmaj9", "Dmaj9", "Gmaj9", "Cmaj9"]         # bars 10-17 (18-34 s)


# ------------------------------------------------------------------ game-piece sounds
def clack(level=1.0, f=950):
    """A plastic square landing on the table."""
    n = int(0.08 * SR); t = tt(n)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 90) * 0.6 + E.bp(rng.standard_normal(n), 1200, 5000) * np.exp(-t * 160)
    return x * 0.22 * level


def tap(level=1.0, f=620):
    """The pawn's felt base on a square: a soft wooden tap."""
    n = int(0.1 * SR); t = tt(n)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 55) + 0.4 * np.sin(2 * np.pi * f * 2.7 * t) * np.exp(-t * 90)
    x += E.lp(rng.standard_normal(n), 2500) * np.exp(-t * 200) * 0.4
    return x * 0.3 * level


def sand(dur, level=1.0):
    n = int(dur * SR)
    x = E.bp(rng.standard_normal(n), 3000, 9000) * (0.6 + 0.4 * E.lp(rng.standard_normal(n), 6) * 8).clip(0.2, 1.4)
    e = np.ones(n); a = int(0.2 * SR); e[:a] = np.linspace(0, 1, a); e[-a:] = np.linspace(1, 0, a)
    return x * e * 0.018 * level


def glass(level=1.0):
    n = int(0.6 * SR); t = tt(n)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in ((2350, 1, 9), (3720, 0.6, 12), (5200, 0.3, 16)))
    return x * 0.08 * level


def bar(n):
    return (n - 1) * BAR


# ------------------------------------------------------------------ score
def score():
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    # pads and sub
    for n, c in enumerate(PROG, start=1):
        st = bar(n); end = min(st + BAR, STOP)
        if st >= STOP:
            break
        new = st >= 18
        cutoff = 600 if n <= 2 else (1600 if not new else (3000 if st < DROP - 0.01 else 4500))
        if 26.0 <= st < DROP:
            cutoff = 1200
        p = E.hp(E.pad(CH[c], end - st, cutoff, attack=0.05 if n > 1 else 0.8, release=0.25), 170)   # leave the low end to the sub
        place(dry, p, st, 0.42 if n > 1 else 0.5)
        place(send, p, st, 0.2)
        if st >= 4.0 and not (16.0 <= st < 18.0):
            place(dry, E.sub(ROOT[c], end - st - 0.02, 0.38 if not new else 0.5), st)

    # 1 · the board lays itself out: 64 squares clack into place
    for i in range(64):
        t = 0.1 + i * 0.042 + 0.28
        place(dry, clack(0.25 + 0.5 * (1 - i / 64), 900 + rng.uniform(-80, 80)), t, pan=rng.uniform(-0.5, 0.5))
    place(send, E.whoosh_down(0.8, 0.4)[::-1], 0.6)
    place(dry, M.thud(70, 0.8, 900), 3.3)                       # the pawn lands
    place(dry, M.thud(55, 1.0, 700), 3.5); place(dry, glass(1.0), 3.5); place(send, glass(0.8), 3.5)   # the timer slams down
    place(dry, sand(10 - 3.55, 1.0), 3.55, pan=-0.3)

    # 2 · the hops (one per beat, landing at 70 % of the beat) and the stamps
    stamped = {9, 11, 12, 14, 16, 17, 19}
    for h in range(12):
        land = 4 + h * B + 0.7 * B
        place(dry, tap(0.8, 600 + 40 * (h % 3)), land, pan=0.2)
        if h + 9 in stamped:
            place(dry, M.thud(85, 0.75, 1400), land + 0.02, pan=rng.uniform(-0.2, 0.3))

    # 3 · the money: each coin leaves the stack and clinks into the billboard; the pawns walk past
    for i in range(16):
        tc = 10 + 0.3 + i * 0.32
        place(dry, M.clink(rng.uniform(3000, 4200), 0.35), tc, pan=-0.4)
        if tc + 0.85 < 16:
            place(dry, M.clunk(0.45), tc + 0.85, pan=0.35); place(dry, M.clink(2600, 0.4, 40), tc + 0.86, pan=0.35)
    for k in range(12):
        place(dry, tap(0.35, 520), 10 + k * B + 0.25, pan=0.1)

    # 4 · the flip: a riser, the board turning, the hit, the old pieces scattering
    place(send, E.riser(1.6, 200, 7000, 1.2), 14.6)
    place(send, E.whoosh_down(0.8, 0.9)[::-1], 16.15)
    place(dry, E.kick(1.3), FLIP); place(dry, E.clap(1.0), FLIP); place(send, E.clap(1.2), FLIP, 0.6)
    place(dry, M.thud(48, 1.2, 600), FLIP)
    for k in range(18):
        place(dry, clack(rng.uniform(0.2, 0.5), rng.uniform(700, 1300)), FLIP + 0.1 + rng.uniform(0, 0.9), pan=rng.uniform(-0.8, 0.8))
    place(send, M.shimmer(1.2, 1500, 5000, 1.0), 16.95)

    # 5 · the new board: the pawn lands, the card stands up, the signal pulses, the timer lies down
    place(dry, M.thud(75, 0.8, 900), 18.3)
    place(send, E.whoosh_down(0.5, 0.5)[::-1], 18.5); place(dry, E.pluck(79, 0.5, bright=1.2), 19.0, 0.35)
    for k in range(5):
        place(send, E.bell(91, 1.2), 19.0 + k, 0.12); place(dry, E.pluck(91, 0.3, bright=1.1), 19.0 + k, 0.08, pan=0.3)
    place(dry, M.clunk(0.7), 20.05); place(dry, glass(0.7), 20.05)

    # 6 · the scan ring, the houses it touches, the one that fits, its trip, the money on this prospect
    place(send, M.shimmer(1.6, 1200, 4500, 1.0), 24.4)
    for k, d in enumerate(sorted(math.hypot(x, z) for x, z in [(-9.5, -6), (-5, -9), (0.5, -10.5), (11, -6), (12.5, -1), (-12, -1.5), (9, 5.5), (-8.5, 6), (4.5, -12.5)])):
        t = 24.4 + d / 12 * 1.6
        if t < 26.2:
            place(dry, tap(0.35, 700 + 30 * k), t, pan=rng.uniform(-0.6, 0.6))
    place(dry, E.bell(86, 1.6), 25.8, 0.4); place(send, E.bell(86, 1.6), 25.8, 0.35)
    for k, m in enumerate((74, 78, 81, 83, 86, 90)):
        place(dry, E.pluck(m, 0.3, bright=1.1), 26.0 + k * 0.27, 0.22, pan=-0.3 + 0.12 * k)
    place(send, E.riser(DROP - 26.0, 300, 8000, 1.0), 26.0)
    place(send, E.whoosh_down(0.45, 0.6), DROP - 0.45)
    place(dry, M.fit_click(1.2), DROP); place(send, M.fit_click(0.6), DROP); place(dry, M.clink(3200, 1.0, 30), DROP)
    place(dry, E.pluck(88, 0.3, bright=1.3), DROP + 0.2, 0.25); place(dry, E.pluck(95, 0.3, bright=1.3), DROP + 0.29, 0.25)   # message blip

    # 7 · the payoff
    place(send, E.whoosh_down(0.6, 0.5)[::-1], 30.0); place(send, E.whoosh_down(0.6, 0.4)[::-1], 30.25)
    place(send, M.shimmer(0.7, 2500, 5000, 0.8), 30.45)
    place(dry, E.kick(0.9), 31.0)
    place(send, M.shimmer(0.8, 3000, 7000, 0.7), 32.5)

    # rhythm section
    t = 4.0
    while t < STOP - 1e-6:
        pos = int(round((t % BAR) / (B / 2))) % 8
        old, flip = t < 16.0, 16.0 <= t < 18.0
        pre = 26.0 <= t < DROP
        if flip:
            t += B / 2; continue
        if old:                                                     # half-time and tense
            if pos == 0: place(dry, E.kick(0.6), t)
            if pos == 4: place(dry, E.clap(0.7), t, pan=0.05); place(send, E.clap(0.7), t, 0.35)
            if pos % 2 == 1: place(dry, M.clink(rng.uniform(5200, 6800), 0.45 if t >= 10 else 0.25, 120), t, pan=-0.25)
        else:                                                       # four on the floor, open
            if pos % 2 == 0 and not pre: place(dry, E.kick(0.7 if t >= DROP else 0.6), t)
            if pos in (2, 6) and not pre: place(dry, E.clap(0.8), t, pan=0.05); place(send, E.clap(0.8), t, 0.35)
            place(dry, M.tick(pos % 2 == 1, 1.2 if pos % 2 else 0.7), t, pan=0.25); place(dry, E.hat(0.5 if pos % 2 else 0.25), t, pan=-0.2)
        t += B / 2
    # arpeggio: dark in the old rules, bright in the new ones
    pattern, vel = [0, 2, 1, 3, 2, 4, 3, 1], [1, .5, .75, .5, .85, .5, .7, .45]
    step, t = 0, 4.0
    while t < STOP - 1e-6:
        if 16.0 <= t < 18.0:
            t += B / 2; step += 1; continue
        c = PROG[int(t // BAR)]
        upper = sorted(m + 12 for m in CH[c] if m >= 47)
        m = upper[pattern[step % 8] % len(upper)]
        new = t >= 18
        pl = E.lp(E.pluck(m, 0.5, bright=1.0 if new else 0.75), 5000 if new else 2000)
        lvl = (0.24 if new else 0.15) * vel[step % 8] * (0.5 if 26.0 <= t < DROP else 1)
        place(dry, pl, t, lvl, [-0.35, 0.25, -0.15, 0.4][step % 4]); place(send, pl, t, lvl * 0.7)
        t += B / 2; step += 1

    bus = dry + E.reverb(send, 2.0, 5500, seed=31) * 0.85
    e = np.ones(N); a, b = int((STOP - 0.05) * SR), int(STOP * SR)
    e[a:b] = np.linspace(1, 0, b - a); e[b:] = 0
    return bus * e[:, None]


def ending():
    """Silence, then one bell chord as the logo appears, a small figure on the slogan, a long tail."""
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    for k, m in enumerate((67, 71, 74, 78, 83)):
        place(dry, E.bell(m, 3.0), LOGO + k * 0.03, 0.4, pan=-0.4 + 0.2 * k)
        place(send, E.bell(m, 3.0), LOGO + k * 0.03, 0.35)
    place(dry, E.hp(E.pad(CH["Gmaj9"], 4.0, 3000, attack=0.02, release=2.0), 170), LOGO, 0.32)
    place(dry, E.sub(31, 3.0, 0.4), LOGO)
    for k, m in enumerate((86, 83, 86, 90)):
        place(dry, E.pluck(m, 0.4, bright=1.0), 34.5 + k * 0.25, 0.12, pan=0.2)
    bus = dry + E.reverb(send, 3.2, 5000, seed=32) * 1.0
    bus[: int(LOGO * SR)] = 0
    a = int(37.0 * SR); bus[a:] *= np.linspace(1, 0, N - a)[:, None] ** 1.5
    return bus


def camera():
    """Sound for the camera moves, on its own random stream so the rest of the score stays note for note."""
    r = np.random.default_rng(77)
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    air = lambda dur, f0, f1, level: E.hp(E.sweep_lp(r.standard_normal((int(dur * SR), 2)), f0, f1), 200) * (np.sin(np.linspace(0, np.pi, int(dur * SR))) ** 1.5)[:, None] * 0.2 * level
    place(send, air(1.5, 5500, 300, 0.75), 2.65)                # the dive to table level
    place(dry, air(1.5, 5500, 300, 0.35), 2.65)
    place(send, air(1.5, 300, 4000, 0.45), 7.0)                 # the crane back
    place(dry, sand(1.5, 2.6), 8.5, pan=0.2)                    # the macro: the sand up close
    place(dry, glass(0.25), 8.52); place(send, glass(0.3), 8.52)
    place(dry, air(0.9, 1200, 5000, 0.6), 10.28, pan=-0.2)      # riding the coin
    place(send, air(0.9, 1200, 5000, 0.5), 10.28)
    for k in range(4):                                          # low and close behind the walkers
        place(dry, tap(0.45, 470), 14.0 + k * B + 0.25, pan=-0.15)
    place(send, E.riser(3.0, 250, 2600, 1.3), 21.0)            # the crane up to the agents' houses
    place(dry, air(1.3, 900, 3500, 0.9), 26.0, pan=0.3)        # alongside the house
    place(dry, M.thud(90, 0.55, 1500), DROP + 0.005)            # the coin on the square, close
    place(send, air(1.2, 4000, 600, 0.3), 30.0)                 # the push-in
    return dry + E.reverb(send, 1.6, 6000, seed=33) * 0.8


def main():
    mix = score() + ending() + camera()
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
