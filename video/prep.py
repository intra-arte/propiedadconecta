"""Builds the images the launch film uses from the real site screenshots.

Usage:  python3 video/prep.py

Reads the original captures (800 x 500, untouched) in
anuncios/reel-publica-tu-busqueda/animatic/capturas/originales/ and writes
video/assets/. Nothing is redrawn: every output is a crop of real pixels,
upscaled x3 with Lanczos so the browser scales down instead of up.

Coordinates below are pixels of the original captures. The page column
runs from x = 80 to x = 720 (the width of the site header), and the "page"
is 02 (top of the form, filled) stitched to 04 (Características, filled):
both show the Presupuesto card, which puts 04 exactly 357 px below 02.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "anuncios/reel-publica-tu-busqueda/animatic/capturas/originales"
OUT = Path(__file__).resolve().parent / "assets"
SCALE = 3

PAGE_X = (80, 720)          # page column, as wide as the site header
HEADER_H = 41               # header incl. its bottom border (row 40)
SEAM_02 = 442               # 02 is used above this row ...
OFFSET_04 = 357             # ... and 04 below it (04 row = page row - 357)
PAGE_H = 500 + OFFSET_04    # 857

# Cards: (left, top, right, bottom), exclusive right/bottom, in page rows.
CARD_X = (222, 579)
CARDS = {
    "que": (124, 220),
    "ubicacion": (231, 334),
    "presupuesto": (345, 437),
    "caracteristicas": (449, 729),
}
BUTTON = ("05-contacto-y-publicar.jpg", (222, 448, 578, 479))


def load(name):
    return Image.open(ORIG / name).convert("RGB")


def up(img):
    return img.resize((img.width * SCALE, img.height * SCALE), Image.LANCZOS)


def save(img, name):
    OUT.mkdir(exist_ok=True)
    up(img).save(OUT / name, optimize=True)
    print("  wrote", (OUT / name).relative_to(ROOT), f"{img.width * SCALE} x {img.height * SCALE}")


def main():
    vacio, lleno, carac = load("01-formulario-vacio.jpg"), load("02-formulario-lleno-arriba.jpg"), load("04-caracteristicas-lleno.jpg")
    x0, x1 = PAGE_X

    # Full page column (filled), stitched.
    page = Image.new("RGB", (x1 - x0, PAGE_H))
    page.paste(lleno.crop((x0, 0, x1, SEAM_02)), (0, 0))
    page.paste(carac.crop((x0, SEAM_02 - OFFSET_04, x1, 500)), (0, SEAM_02))
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

    meta = {
        "scale": SCALE,
        "pageX": PAGE_X,
        "pageW": x1 - x0,
        "pageH": PAGE_H,
        "headerH": HEADER_H,
        "cardX": [CARD_X[0] - x0, CARD_X[1] - x0],
        "cards": CARDS,
        "button": [box[2] - box[0], box[3] - box[1]],
        "cardRadius": 7,
        "buttonRadius": 6,
    }
    (OUT / "meta.json").write_text(json.dumps(meta, indent=2) + "\n")
    print("  wrote", (OUT / "meta.json").relative_to(ROOT))


if __name__ == "__main__":
    main()
