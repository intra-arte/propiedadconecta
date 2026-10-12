# «Monedas al aire» · 32 s · 16:9 · 3D

Concept and script: [`docs/monedas/idea.md`](../../docs/monedas/idea.md). Style frames: `style-frames/`.

- **Output:** `out/monedas-al-aire-32s.mp4` (1920 × 1080, 60 fps, 1920 frames, H.264 + AAC) and a contact sheet.
- **Preview:** serve the repo root (`npx http-server .`), open `/video/monedas/index.html` in a browser with WebGL. Click to pause; `?t=22.3` shows the click.

## Rebuild

```sh
python3 video/monedas/music/compose.py      # original score (same engine as the other films; needs scipy, pyloudnorm)
node video/render.mjs --gl --page video/monedas/index.html --out video/monedas/out \
  --name monedas-al-aire-32s --duration 32 --music video/monedas/music/soundtrack.wav
node video/monedas/frames.mjs               # the six style frames (optional)
```

`--gl` launches Chromium with software WebGL (SwiftShader); about 1.8 s per frame, ~1 h for the film.

## What's in it

- Everything is drawn in code with Three.js (MIT, `vendor/three/`): the agent's coin (roof chevron, «PROPIEDAD · CONECTA»), its clock reverse (redrawn every frame; the second hand ticks on the beat), the slot machine with generic «PORTALES · PUBLICIDAD», the people, the endless feed, the slab and pieces.
- The only brand asset is the real logo (`anuncios/reel-publica-tu-busqueda/marca/`), on ivory, ≤ 100 %, never animated: the two coins land on its heads and it fades in over them.
- 140 BPM grid: one beat = 60/140 s; cuts on bar lines; the piece clicks into its slot on beat 52 (22.29 s), which is the drop of the music.
- No real portals named, no invented figures, no cities.
