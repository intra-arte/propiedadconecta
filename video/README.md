# Launch film · 15 s · 16:9

Built from [`docs/shotlist.md`](../docs/shotlist.md) in the grammar of [`docs/style_guide.md`](../docs/style_guide.md).

- **Output:** `out/propiedad-conecta-15s.mp4` (1920 × 1080, 60 fps, 900 frames, H.264, silent) and `out/propiedad-conecta-15s-contact-sheet.jpg` (one frame every 0.5 s).
- **Preview:** serve the repo root (`npx http-server .`) and open `/video/index.html`. Click to pause; `?t=6.5` shows one still.

## Rebuild

```sh
python3 video/prep.py          # crops the real screenshots into video/assets/ (x3 Lanczos, nothing redrawn)
node video/render.mjs          # renders every frame with Playwright and pipes it to ffmpeg
node video/render.mjs --stills 1,6.5,14.9   # stills only, into video/out/stills/
```

`index.html` draws every frame as a pure function of time (`draw(t)`), so a render is deterministic.

## Sources

- UI: the five real captures in `anuncios/reel-publica-tu-busqueda/animatic/capturas/originales/` (800 × 500). They are soft at 1080p; replace them with 2× captures of the live site and re-run `prep.py` (the crop coordinates assume the same layout).
- Logo: `anuncios/reel-publica-tu-busqueda/marca/` at 45 % of the file (≤ 100 %, uniform), on ivory only, parts never animated.
- Font: Outfit (OFL), from `anuncios/reel-publica-tu-busqueda/animatic/fuentes/`.
