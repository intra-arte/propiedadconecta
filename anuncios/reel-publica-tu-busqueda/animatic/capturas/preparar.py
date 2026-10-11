"""Recorta las capturas reales del formulario para el animatic.

Uso:  python3 animatic/capturas/preparar.py

Lee originales/ (capturas tal como llegaron, 800 × 500 px) y escribe recortes/:
cada tarjeta del formulario en su estado vacío y lleno, ampliada ×3 con Lanczos
para que el navegador la reduzca en lugar de ampliarla. No se redibuja ni se
agrega nada a la interfaz. Lo único que se altera es el teléfono de ejemplo, que
se difumina por si correspondiera a una persona real.

Las coordenadas son de las capturas originales, en píxeles (izq, arriba, der, abajo).
"""
from pathlib import Path

from PIL import Image, ImageFilter

DIR = Path(__file__).resolve().parent
ORIG = DIR / "originales"
SALIDA = DIR / "recortes"
ESCALA = 3

# nombre del recorte: (captura, caja)
RECORTES = {
    "cabecera": ("02-formulario-lleno-arriba.jpg", (80, 0, 720, 86)),
    "que-vacio": ("01-formulario-vacio.jpg", (221, 124, 579, 220)),
    "que-lleno": ("02-formulario-lleno-arriba.jpg", (221, 124, 579, 220)),
    "ubicacion-vacio": ("01-formulario-vacio.jpg", (221, 231, 579, 333)),
    "ubicacion-lleno": ("02-formulario-lleno-arriba.jpg", (221, 231, 579, 333)),
    "presupuesto-vacio": ("01-formulario-vacio.jpg", (221, 343, 579, 436)),
    "presupuesto-lleno": ("02-formulario-lleno-arriba.jpg", (221, 343, 579, 436)),
    "caracteristicas-vacio": ("03-caracteristicas-vacio.jpg", (221, 183, 579, 463)),
    "caracteristicas-lleno": ("04-caracteristicas-lleno.jpg", (221, 91, 579, 371)),
    # Se corta antes del rótulo «Quiero recibir contacto de hasta X agentes» (tiene una X literal).
    "contacto": ("05-contacto-y-publicar.jpg", (221, 250, 579, 392)),
    # Solo la fila de opciones 1 / 3 / 5 agentes, para ampliarla.
    "agentes": ("05-contacto-y-publicar.jpg", (230, 408, 400, 427)),
    "publicar": ("05-contacto-y-publicar.jpg", (221, 445, 579, 482)),
}

# Zonas a difuminar, en coordenadas de la captura original.
DIFUMINAR = {
    "05-contacto-y-publicar.jpg": [(408, 306, 466, 325)],  # teléfono de ejemplo «0991234567»
}


def main():
    SALIDA.mkdir(exist_ok=True)
    capturas = {}
    for nombre, (archivo, _) in RECORTES.items():
        if archivo not in capturas:
            im = Image.open(ORIG / archivo).convert("RGB")
            for caja in DIFUMINAR.get(archivo, []):
                zona = im.crop(caja).filter(ImageFilter.GaussianBlur(4))
                im.paste(zona, caja[:2])
            capturas[archivo] = im
    for nombre, (archivo, caja) in RECORTES.items():
        rec = capturas[archivo].crop(caja)
        rec = rec.resize((rec.width * ESCALA, rec.height * ESCALA), Image.LANCZOS)
        rec = rec.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
        rec.save(SALIDA / f"{nombre}.png", optimize=True)
        print(f"{nombre}.png  {caja[2] - caja[0]} × {caja[3] - caja[1]} px de origen")


if __name__ == "__main__":
    main()
