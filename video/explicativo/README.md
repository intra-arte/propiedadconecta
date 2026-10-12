# Explicativo · 32 s · 16:9

«Qué es Propiedad Conecta»: built from [`docs/explicativo/shot_list.md`](../../docs/explicativo/shot_list.md) in the grammar of [`docs/explicativo/guia_de_estilo.md`](../../docs/explicativo/guia_de_estilo.md).

- **Output:** `out/propiedad-conecta-explicativo-32s.mp4` (1920 × 1080, 60 fps, 1920 frames, H.264 + AAC 256 kbps) and a contact sheet (one frame every 0.5 s).
- **Preview:** serve the repo root (`npx http-server .`) and open `/video/explicativo/index.html`. Click to pause; `?t=20.6` shows one still.

## Rebuild

```sh
python3 video/explicativo/prep.py            # crops the real 1440×900 captures (Lanczos, nothing redrawn; test phone/e-mail blurred) + QR
python3 video/explicativo/music/compose.py   # original soundtrack, same engine as the first film (needs scipy, pyloudnorm)
node video/render.mjs --page video/explicativo/index.html --out video/explicativo/out \
  --name propiedad-conecta-explicativo-32s --duration 32 --music video/explicativo/music/soundtrack.wav
```

Cuts sit on a 140 BPM grid (one beat = 60/140 s); `BEATS` in `index.html` holds the shot boundaries.

## Sources

- UI: real captures in `anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440/` (form, «Solicitud publicada», agent marketplace, detail, unlock dialog, unlocked lead). Development badges stay outside every crop; only two marketplace cards are shown (no request count).
- Logo and isotipo: `anuncios/reel-publica-tu-busqueda/marca/`, only on white or ivory (an ivory tile on dark scenes), ≤ 100 %, parts never animated.
- Fonts: Barlow Condensed 800 (`fuentes/`, OFL, from `@fontsource/barlow-condensed`) and Outfit (OFL).
- QR: generated with `segno` for https://www.propiedadconecta.com/.
- Music: original, `music/compose.py` (140 BPM half-time, B minor, −14 LUFS). No samples or licensed audio.
