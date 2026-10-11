# Informe de control de calidad — animatic v0

Generado por `node generar.mjs`.

## Archivos

| Archivo | Resolución | fps | Frames | Duración (s) | Tamaño |
|---|---|---|---|---|---|
| animatic-A-v0.mp4 | 1080 × 1920 | 30/1 | 660 | 22,000 | 2,0 MB |
| animatic-A-v0-revision.mp4 | 1080 × 1920 | 30/1 | 660 | 22,000 | 2,6 MB |
| animatic-B-v0-revision.mp4 | 1080 × 1920 | 30/1 | 660 | 22,000 | 2,3 MB |

## Línea de tiempo

- Sin huecos ni solapes entre escenas o líneas de voz; todas las líneas por debajo del umbral de ritmo; bloques de texto ≥ 0,8 s y titulares ≥ 1,5 s.
- Versión A: 49 palabras, 96 sílabas. La voz termina en 20,70 s y deja 1,3 s de cierre sin voz.

## Zonas seguras (versión A, una muestra cada 0,1 s fuera de transiciones)

- OK: titulares, burbujas, marcadores, subtítulos, logo y botón quedan dentro de x 65–1015 px e y 270–1248 px.
- El bloque «IMAGEN POR PRODUCIR» va a propósito en la franja inferior: es una nota del animatic y no existe en el anuncio final.

## Logo

- Archivo: `marca/logo-horizontal-transparente.png`, 1208 × 431 px.
- En el cierre: 800,0 × 285,4 px → escala horizontal 66,23 % y vertical 66,22 % (OK: escala uniforme; OK: no supera el 100 %).
- Medido en el MP4 exportado (frame de 21,5 s): contenido del logo 705 × 188 px, proporción 3,750; en el archivo original 1064 × 285 px, proporción 3,733. Desvío 0,45 % (OK; el margen cubre el redondeo de bordes al codificar).
- Posición: x 140–940, y 617–902; solo sobre fondo marfil.

## CTA «Publica gratis tu búsqueda»

- Botón de 759 × 120 px, texto Outfit 600 a 50 px.
- En un celular de 390 pt de ancho (iPhone de 6,1″) el texto se ve a 18,1 pt; en uno de 360 dp, a 16,7 dp. La referencia de texto cómodo en iOS es 17 pt (OK).
- Contraste blanco sobre verde bosque #142A22: 15,2:1 (mínimo AA para texto grande: 3:1; para texto normal: 4,5:1) OK.
- Además, el mismo texto aparece antes como titular en E7 (96 px) mientras la voz lo dice.
- Vista a tamaño de celular: `cierre-en-movil.png` (en esta carpeta) (390 × 693 px).

## Marcadores pendientes (no son pantallas reales)

Versión A:
- E4: CAPTURA PENDIENTE · Formulario para publicar una búsqueda
- E4: CAPTURA PENDIENTE · Botón para publicar y pantalla que aparece después
- E5: CAPTURA PENDIENTE · Cómo ve el agente una búsqueda
- E5: POR CONFIRMAR · ¿Los agentes ya usan la plataforma hoy?
- E6: POR CONFIRMAR · Canal de contacto: llamada, WhatsApp, correo o dentro de la app

Versión B: los mismos desde 6,6 s.
