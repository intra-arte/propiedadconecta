"""Original soundtrack for the 32 s explainer, synthesised from scratch.

Usage:  python3 video/explicativo/music/compose.py   → video/explicativo/music/soundtrack.wav

Same synthesis engine as the first film (video/music/compose.py: additive
saws, plucks, bells, noise drums, synthetic reverb), so both films share one
sonic identity. No samples or third-party audio; fixed seed, reproducible.

140 BPM played half-time (feels like 70), B minor, heavier and darker than
the first film. Every cut of the picture is a bar line (1.714 s), so the
downbeats carry the cuts. The music stops dead at 29.14 s on a last hit; the
closing card only has the reverb tail and one soft bell.
"""
import importlib.util
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
CUT = 68 * B                       # 29.143 s: music stops
OUT = HERE / "soundtrack.wav"
rng = np.random.default_rng(20261012)

PROG = ["Bm9", "Bm9", "Gmaj9", "Dmaj9", "A69", "Bm9", "Gmaj9", "Dmaj9", "A69",
        "Bm9", "Gmaj9", "Dmaj9", "A69", "Bm9", "Gmaj9", "Dmaj9", "A69"]       # one chord per bar, 17 bars


def bar(n):                        # start of bar n (1-based)
    return (n - 1) * BAR


def music_bus():
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    place = E.place
    # pads: bar 1 dark, then the progression (filter opens from bar 4)
    for n, c in enumerate(PROG, start=1):
        cutoff = 650 if n <= 3 else (2600 if n < 10 else 3200)
        p = E.pad(E.CH[c], BAR, cutoff, attack=0.05 if n > 1 else 0.3, release=0.25)
        place(dry, p, bar(n), 0.5 if n > 1 else 0.7)
        place(send, p, bar(n), 0.2)
    # 1 · the line: soft ticks that thin out, two plucks on the chevron
    for k in range(20):
        t = 0.05 + k * B / 4
        if t < 1.2:
            place(dry, E.type_click(0.5 + 0.5 * rng.random()), t, pan=rng.uniform(-0.4, 0.4))
    for t, m in ((1.2, 66), (1.38, 71)):
        place(dry, E.pluck(m + 12, 0.7), t, 0.35)
        place(send, E.pluck(m + 12, 0.7), t, 0.3)
    place(dry, E.sub(35, bar(2) - 0.05, 0.7), 0.0)
    # 2 · pills: a pop per pill, on the beat; short riser into the push
    for k, m in enumerate((71, 74, 78, 83)):
        t = bar(2) + k * B
        place(dry, E.pluck(m, 0.4, bright=1.2), t, 0.4, pan=[-0.4, 0.4, -0.2, 0.2][k])
        place(dry, E.tick(1400 + 200 * k, 0.6, 0.025), t)
    place(send, E.riser(B, 600, 6000, 0.8), bar(2) + 3 * B)
    # 3 · title + lens: low boom on the cut, filter sweep under the lens
    n = int(1.4 * SR)
    t_ = E.tt(n)
    boom = np.sin(2 * np.pi * np.cumsum(36 + 34 * np.exp(-t_ * 8)) / SR) * np.exp(-t_ * 2.4) * 0.75
    place(dry, boom, bar(3))
    place(send, E.whoosh_down(1.4, 0.6)[::-1], bar(3) + 0.15)
    # drums: half-time from bar 2 (kick on 1 and the "and" of 2, clap on 3, eighth hats from bar 3)
    t = bar(2)
    while t < CUT - 1e-6:
        pos = int(round((t % BAR) / (B / 2))) % 8
        n_bar = int(t // BAR) + 1
        if pos == 0:
            place(dry, E.kick(1.0), t)
        if pos == 3 and n_bar >= 3:
            place(dry, E.kick(0.65), t)
        if pos == 4 and n_bar >= 3:
            place(dry, E.clap(1.0), t, pan=0.05)
            place(send, E.clap(1.0), t, 0.45)
        if n_bar >= 3:
            place(dry, E.hat(0.9 if pos % 2 else 0.5), t, pan=0.3)
        if n_bar >= 10 and pos in (5, 7):              # agent side: extra off-beat hats
            place(dry, E.hat(0.5, 0.04), t + B / 4, pan=-0.3)
        t += B / 2
    # bass (sub), following the kicks; a busier figure from the agent side (bar 10)
    for n, c in enumerate(PROG, start=1):
        if n < 2:
            continue
        r = E.ROOT[c]
        hits = [(0, 1.4), (1.5, 0.45), (2.5, 1.4)] if n < 10 else [(0, 0.7), (0.75, 0.6), (1.5, 0.45), (2.5, 0.7), (3.25, 0.6)]
        for beat, length in hits:
            t = bar(n) + beat * B
            if t < CUT:
                place(dry, E.sub(r, min(length * B, CUT - t), 1.1), t)
    # dark plucked arpeggio from bar 4
    pattern, vel = [0, 2, 1, 3, 2, 4, 3, 1], [1, .5, .75, .5, .85, .5, .7, .45]
    step, t = 0, bar(4)
    while t < CUT - 1e-6:
        c = PROG[int(t // BAR)]
        upper = sorted(m + 12 for m in E.CH[c] if m >= 54)
        m = upper[pattern[step % 8] % len(upper)]
        v = vel[step % 8]
        pl = E.lp(E.pluck(m, 0.6, bright=0.8), 2600)
        pan = [-0.35, 0.25, -0.15, 0.4][step % 4]
        place(dry, pl, t, 0.22 * v, pan)
        place(send, pl, t, 0.16 * v, pan)
        t += B / 2
        step += 1
    # picture hits
    place(dry, E.tick(900, 0.7, 0.04), 12.0 + 0.86)                       # button press (shot 8)
    place(send, E.riser(0.5, 500, 5000, 0.5), 13.71 - 0.5)                # into "published"
    place(dry, E.tick(800, 0.8, 0.04), bar(12) + 3 * B)                    # unlock press, beat 47 (20.14 s)
    for m in (83, 90):                                                    # lock opens on beat 48 (20.57 s)
        place(dry, E.bell(m, 1.8), 48 * B, 0.45)
        place(send, E.bell(m, 1.8), 48 * B, 0.4)
    for k in range(3):                                                    # channel pills (shot 13)
        place(dry, E.pluck(78 + 3 * k, 0.35, bright=1.2), 52 * B + (k + 1) * B, 0.3, pan=0.2 * (k - 1))
    for t0 in (27.16, 27.78, 28.35):                                      # page peels
        place(dry, E.whoosh_down(0.24, 0.9), t0)
    place(send, E.riser(BAR, 400, 9000, 1.0), CUT - BAR)                  # last bar lifts into the stop
    bus = dry + E.reverb(send, 2.0, 5500, seed=11) * 0.85
    e = np.ones(N)
    a, b = int(CUT * SR) - int(0.015 * SR), int(CUT * SR)
    e[a:b] = np.linspace(1, 0, b - a)
    e[b:] = 0
    return bus * e[:, None]


def ending_bus():
    """The stop: one last hit whose reverb rings into the silent closing card, and a soft bell."""
    dry, send = np.zeros((N, 2)), np.zeros((N, 2))
    E.place(dry, E.kick(1.0), CUT)
    n = int(1.2 * SR)
    t_ = E.tt(n)
    E.place(dry, np.sin(2 * np.pi * np.cumsum(40 + 25 * np.exp(-t_ * 9)) / SR) * np.exp(-t_ * 3) * 0.6, CUT)
    E.place(send, E.pad(E.CH["Bm9"], 0.08, 3000, attack=0.005, release=0.05), CUT, 1.0)
    E.place(send, E.bell(74, 2.0), 30.6, 0.35)
    E.place(dry, E.bell(74, 2.0), 30.6, 0.12)
    bus = dry + E.reverb(send, 3.0, 4500, seed=12) * 1.1
    bus[: int(CUT * SR)] = 0
    a = int(31.2 * SR)
    bus[a:] *= np.linspace(1, 0, N - a)[:, None] ** 1.5
    return bus


def main():
    mix = music_bus() + ending_bus()
    mix = E.hp(mix, 28)
    mix = np.tanh(mix * 1.15) / 1.15
    meter = pyloudnorm.Meter(SR)
    mix *= 10 ** ((-14.0 - meter.integrated_loudness(mix)) / 20)
    ceiling = 10 ** (-1.2 / 20)
    over = np.abs(mix) > ceiling * 0.8
    mix[over] = np.sign(mix[over]) * (ceiling * 0.8 + ceiling * 0.2 * np.tanh((np.abs(mix[over]) - ceiling * 0.8) / (ceiling * 0.2)))
    print(f"  loudness {meter.integrated_loudness(mix):.1f} LUFS · peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS")
    wavfile.write(OUT, SR, mix.astype(np.float32))
    print("  wrote", OUT.relative_to(HERE.parents[2]))


if __name__ == "__main__":
    main()
