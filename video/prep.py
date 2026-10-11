"""Builds the images the launch film uses from the real site screenshots.

Usage:  python3 video/prep.py

Reads the 1440 x 900 captures (untouched) in
anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440/ and writes
video/assets/. Nothing is redrawn: every output is a crop of real pixels,
resampled with Lanczos to 3 px per world unit so the browser scales down
instead of up.

World units: index.html works in the coordinates of the earlier 800 x 500
captures (1 unit = 1.8 px of these), with x measured from the left edge of
the page column. The page column runs from x = 144 to x = 1296 px (the width
of the site header). The "page" is 02 (top of the form, filled) stitched to
04 (Características, filled): both show the Presupuesto card, which puts 04
exactly 718 px below 02. The red development badge sits at x = 19-138 px,
outside the column, so it never appears.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440"
OUT = Path(__file__).resolve().parent / "assets"
UNIT = 1.8                  # px of these captures per world unit
DENSITY = 3                 # px per world unit in the assets

PAGE_X = (144, 1296)        # page column, as wide as the site header
HEADER_H = 73               # header incl. its bottom border (row 72)
SEAM = 796                  # 02 is used above this row (in the gap after Presupuesto) ...
OFFSET_04 = 718             # ... and 04 below it (04 row = page row - 718)
PAGE_H = 900 + OFFSET_04    # 1618

# Cards in page rows / capture columns (exclusive end), measured on the borders.
CARD_X = (399, 1042)
CARDS = {
    "que": (224, 394),
    "ubicacion": (416, 600),
    "presupuesto": (622, 786),
    "caracteristicas": (808, 1312),
}
BUTTON = ("05-contacto-y-publicar.png", (399, 806, 1042, 862))


def load(name):
    return Image.open(ORIG / name).convert("RGB")


def save(img, name):
    OUT.mkdir(exist_ok=True)
    w, h = round(img.width / UNIT * DENSITY), round(img.height / UNIT * DENSITY)
    img.resize((w, h), Image.LANCZOS).save(OUT / name, optimize=True)
    print("  wrote", (OUT / name).relative_to(ROOT), f"{w} x {h}")


def unit(v, dx=0.0):
    return round(v / UNIT - dx, 2)


def main():
    vacio, lleno, carac = load("01-formulario-vacio.png"), load("02-formulario-lleno-arriba.png"), load("04-caracteristicas-lleno.png")
    x0, x1 = PAGE_X

    # Full page column (filled), stitched.
    page = Image.new("RGB", (x1 - x0, PAGE_H))
    page.paste(lleno.crop((x0, 0, x1, SEAM)), (0, 0))
    page.paste(carac.crop((x0, SEAM - OFFSET_04, x1, 900)), (0, SEAM))
    save(page.crop((0, 0, x1 - x0, HEADER_H)), "header.png")
    save(page.crop((0, HEADER_H, x1 - x0, PAGE_H)), "page.png")

    # Single cards, empty and filled (01 and 02 share the exact layout).
    for name, (top, bottom) in CARDS.items():
        if name == "caracteristicas":
            continue
        box = (CARD_X[0], top, CARD_X[1], bottom)
        save(lleno.crop(box), f"{name}-lleno.png")
        if name != "que":
            save(vacio.crop(box), f"{name}-vacio.png")

    src, box = BUTTON
    save(load(src).crop(box), "publicar.png")

    ox = x0 / UNIT
    meta = {
        "source": str(ORIG.relative_to(ROOT)),
        "unit": UNIT,
        "density": DENSITY,
        "pageW": unit(x1 - x0),
        "pageH": unit(PAGE_H),
        "headerH": unit(HEADER_H),
        "cardX": [unit(CARD_X[0], ox), unit(CARD_X[1], ox)],
        "cards": {k: [unit(a), unit(b)] for k, (a, b) in CARDS.items()},
        "button": [unit(box[2] - box[0]), unit(box[3] - box[1])],
        "cardRadius": 7.8,
        "buttonRadius": 6,
    }
    (OUT / "meta.json").write_text(json.dumps(meta, indent=2) + "\n")
    print("  wrote", (OUT / "meta.json").relative_to(ROOT))


if __name__ == "__main__":
    main()
