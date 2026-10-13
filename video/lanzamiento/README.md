# «Nuevas reglas» · 40 s · 16:9 · 3D

Launch film. Concept and script: [`docs/lanzamiento/idea.md`](../../docs/lanzamiento/idea.md). Voice-over script: [`docs/lanzamiento/locucion.md`](../../docs/lanzamiento/locucion.md). Style frames: `style-frames/`.

- **Output:** `out/nuevas-reglas-40s.mp4` (1920 × 1080, 60 fps, 2400 frames, H.264 + AAC) and a contact sheet; `out/nuevas-reglas-40s-locucion.mp4` once the voice-over take is in.
- **Preview:** serve the repo root (`npx http-server .`), open `/video/lanzamiento/index.html` in a browser with WebGL. Click to pause; `?t=28` shows the coin landing.

## Rebuild

```sh
python3 video/lanzamiento/music/compose.py   # original score, 120 BPM (needs scipy, pyloudnorm)
node video/render.mjs --gl --page video/lanzamiento/index.html --out video/lanzamiento/out \
  --name nuevas-reglas-40s --duration 40 --music video/lanzamiento/music/soundtrack.wav
node video/lanzamiento/frames.mjs            # the six style frames (optional)

# voice-over: put the ElevenLabs take at video/lanzamiento/locucion/toma.mp3, then
python3 video/lanzamiento/locucion/mezcla.py  # → music/soundtrack-locucion.wav
ffmpeg -i video/lanzamiento/out/nuevas-reglas-40s.mp4 -i video/lanzamiento/music/soundtrack-locucion.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart \
  video/lanzamiento/out/nuevas-reglas-40s-locucion.mp4
```

`--gl` launches Chromium with software WebGL (SwiftShader); about 1.7 s per frame, a little over an hour for the film.

## What's in it

- A tabletop game drawn in code with Three.js (MIT, shared from `video/monedas/vendor/three/`): the listing squares, the seeker's pawn, the hourglass (its sand drains frame by frame), the agent's money (the campaign coin), the generic «PORTALES · PUBLICIDAD» billboard, the request card, the agents' houses. Tilt-shift blur makes it read as a miniature.
- Old rules (0–16 s) → the board flips (16 s, «NUEVAS REGLAS.») → new rules (18–30 s) → the pawn's head and the coin become the logo's heads (30–34 s) → end card with the slogan «Tú buscas. Nosotros conectamos.» (34–40 s).
- The only brand asset is the real logo (`anuncios/reel-publica-tu-busqueda/marca/`), on ivory, ≤ 100 %, never animated.
- 120 BPM grid: one beat = 0.5 s; cuts on bar lines; the coin lands on the prospect at 28.0 s, which is the drop of the music.
- The voice and the texts say «dinero», never «monedas». No real portals named, no invented figures, no cities.
