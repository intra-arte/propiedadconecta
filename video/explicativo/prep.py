"""Builds the images the explainer uses from the real site screenshots.

Usage:  python3 video/explicativo/prep.py

Reads the 1440 x 900 captures (untouched) in
anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440/ and writes
video/explicativo/assets/. Nothing is redrawn: every output is a crop of real
pixels, resampled with Lanczos so the browser scales down instead of up.
The only alteration: the test phone and e-mail on the unlocked lead are
blurred (same precaution as the first reel). Crops avoid the development
badges in the bottom-left corner (x < 140, y > 840).
Also writes a QR code for https://www.propiedadconecta.com/ (segno).
"""
import json
from pathlib import Path

import segno
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ORIG = ROOT / "anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440"
OUT = Path(__file__).resolve().parent / "assets"

# name: (capture, box (left, top, right, bottom) in capture px, upscale factor)
CROPS = {
    "pagina": ("02-formulario-lleno-arriba.png", (150, 0, 1290, 641), 2.0),
    "caracteristicas": ("04-caracteristicas-lleno.png", (399, 91, 1042, 595), 5 / 3),
    "publicar": ("05-contacto-y-publicar.png", (399, 806, 1042, 862), 2.5),
    "publicada": ("06-solicitud-publicada.png", (330, 70, 1110, 790), 2.0),
    "marketplace": ("07-agente-marketplace.png", (150, 320, 912, 622), 2.0),
    "detalle": ("08-agente-detalle.png", (390, 700, 1050, 893), 2.5),
    "desbloquear": ("09-agente-desbloquear.png", (0, 0, 384, 276), 2.6),
    "lead": ("10-agente-lead-desbloqueado.png", (390, 103, 1050, 405), 2.4),
}
# Blurred before cropping, in capture px: test phone and test e-mail on the lead.
BLUR = {"lead": [(418, 214, 524, 244), (720, 214, 1060, 244)]}


def main():
    OUT.mkdir(exist_ok=True)
    meta = {}
    for name, (src, box, k) in CROPS.items():
        img = Image.open(ORIG / src).convert("RGB")
        for b in BLUR.get(name, []):
            region = img.crop(b).filter(ImageFilter.GaussianBlur(7))
            img.paste(region, b[:2])
        crop = img.crop(box)
        w, h = round(crop.width * k), round(crop.height * k)
        crop.resize((w, h), Image.LANCZOS).save(OUT / f"{name}.png", optimize=True)
        meta[name] = {"box": box, "scale": k, "w": w, "h": h}
        print(f"  wrote video/explicativo/assets/{name}.png {w} x {h}")
    qr = segno.make("https://www.propiedadconecta.com/", error="m")
    qr.save(OUT / "qr.svg", dark="#142A22", light=None, border=0, scale=10)
    print("  wrote video/explicativo/assets/qr.svg")
    (OUT / "meta.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
