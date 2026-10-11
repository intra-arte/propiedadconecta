// One timeline, in beats, shared by picture and score.
// 128 BPM, 32 beats = 8 bars = 15.000 s. The film converts beats to seconds
// through the *measured* grid in beats.json, not through this nominal tempo.
export const BPM = 128;
export const BEATS = 32;
export const DURATION = 15;

export const CUE = {
  // bar 1 — bounce: launch, then a halving rhythm (1/2, 1/4, 1/8, 1/16)
  launch: 0,
  bounces: [2, 3, 3.5, 3.75],
  // bar 2 — type
  erupt: 4, // "motion" rises, the i-stem catches the dot
  tittle: 5, // dot lands as the tittle; weight wave
  accordion: 6, // width squeeze
  hop: 7, // anticipation done, dot hops off, word falls through the floor
  // bar 3 — grid
  grid: 8,
  ripple: 9,
  swirl: 10,
  tilt: 11,
  // bar 4 — 3D
  terrain: 12,
  sphere: 13,
  orbit: 14,
  dive: 15,
  dropout: 15.5,
  // bar 5 — liquid
  liquid: 16,
  pulse: 17,
  merge: 18,
  pour: 19,
  // bar 6 — curve editor, one ease per beat
  curve: 20,
  // bar 7 — word slams
  slams: [24, 25, 26, 27],
  stutter: [27, 27.25, 27.5, 27.75],
  // bar 8 — end card: dot falls into the period, halving rhythm mirrored
  end: 28,
  endBounces: [29, 29.5, 29.75, 29.875],
  rest: 30,
};

export const WORDS = ['TYPE', '3D', 'LIQUID', 'SOUND'];
